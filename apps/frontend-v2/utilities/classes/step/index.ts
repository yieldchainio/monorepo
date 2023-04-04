/**
 * A class representing a frontend step's states
 */

import {
  YCAction,
  YCArgument,
  YCFunc,
  YCProtocol,
  YCToken,
  assert,
} from "@yc/yc-models";
import {
  ActionConfigs,
  DefaultDimensions,
  Dimensions,
  IStep,
  JSONStep,
  Position,
  StepSizing,
  StepState,
} from "./types";
import { v4 as uuid } from "uuid";
import { FlextreeNode, FlextreeOptions, flextree } from "d3-flextree";
import { HierarchyNode } from "d3-hierarchy";

export class Step implements IStep<Step> {
  // ====================
  //       METHODS
  // ====================

  /**
   * Add a child step
   * @param child - A Step instance
   */
  addChild = (child: Step) => {
    this.children = [...this.children, child];
  };

  /**
   * Remove a child
   * @param id - the string ID of the child to remove
   */
  removeChild = (id: string) => {
    this.children = this.children.filter((child) => child.id !== id);
  };

  /**
   * Change the @state field
   * @param newState  - the new state to update to
   * @param actionConf - if the new state is of type CONFIG, an action config must be provided
   */
  changeState = (newState: StepState, actionConf?: ActionConfigs) => {
    assert(
      newState !== StepState.CONFIG || actionConf !== undefined,
      "Step ERR: An Action config must be provided if chosen state is 'ActionConfig'."
    );
    this.state = newState;
    if (actionConf) this.actionConfig = actionConf;
  };

  /**
   * Change the size
   * @param newSize - the new size
   * @param manual - Whether this resize is automatic (i.e, auto resize by zoom?) or manual by the user
   */
  resize = (
    newSize: StepSizing,
    dimensions: Dimensions | null = DefaultDimensions[newSize],
    manual: boolean = false
  ) => {
    // If this step has been manually resized before, then this resize must be manual as well to retain their choice
    if (manual || !this.manuallyResized) {
      // We set the new dimensions & Sizing
      this.size = newSize;
      if (dimensions != null) this.dimensions = dimensions;

      // If it's a manual resize we set the global variable specifying the user manually resized this step
      if (manual) this.manuallyResized = true;
    }
  };

  // ====================
  //      VARIABLES
  // ====================

  /**
   * Config-related variables
   */
  id: string;
  state: StepState;
  size: StepSizing;
  actionConfig: ActionConfigs | null;
  dimensions: Dimensions = { width: 0, height: 0 };
  position: Position = { x: 0, y: 0 };

  /**
   * Step-related variables
   */
  protocol: YCProtocol | null = null;
  inflows: YCToken[] = [];
  outflows: YCToken[] = [];
  action: YCAction | null = null;
  function: YCFunc | null = null;
  customArguments: YCArgument[] = [];

  /**
   * Utility variables
   */
  manuallyResized: boolean = false;

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(config?: IStep<Step>) {
    // We construct the gloal variables from the config
    this.id = config?.id || uuid();
    this.state = config?.state || StepState.INIT;
    this.size = config?.size || StepSizing.MEDIUM;
    this.actionConfig = config?.actionConfig || null;

    this.protocol = config?.protocol || null;
    this.inflows = config?.inflows || [];
    this.outflows = config?.outflows || [];
    this.action = config?.action || null;
    this.function = config?.function || null;
    this.customArguments = config?.customArguments || [];

    this.children = config?.children || [];
    this.parent = config?.parent || null;
  }

  // ========================
  //      UTILITY METHODS
  // ========================

  /**
   * @method
   * graph()
   *
   * @uses D3 to graphicize this step node and all if it's descendents
   */

  graph = (baseNodeSize: StepSizing, baseNodeDimensions?: Dimensions) => {
    // Instantiate layout instance with our settings
    const layout = flextree({
      nodeSize: (node: HierarchyNode<Step>) => [
        node.data.dimensions.width,
        node.data.dimensions.height,
      ],

      /**
       * Our spacing logic for the steps nodes
       *
       * If the nodes share the same parent, and their own sibling bundle is of
       * an even length, and they are the ones closest to the parent - We give it
       * a spacing worth of the parent's width. Otherwise, we give it a base spacing
       * of 80
       */
      spacing: (aNode, bNode) => {
        const aParent = aNode.parent;
        const bParent = bNode.parent;
        // if none of them are defined we just return 80
        if (!aParent || !bParent) return 80;

        // If the mentioned requirements are true, we add the parent's width
        if (
          aParent.id === bParent.id &&
          (aParent.children?.length || 1) % 2 === 0 &&
          aParent.children?.findIndex((child) => child.id === aNode.id) ===
            (aParent.children?.length || 0) / 2
        )
          return aParent.data.dimensions.width || 80;

        // otherwise we return base spacing
        return 80;
      },
    });

    // We resize the nodes according to the base input.
    // @notice that nodes that were manually resized by the
    // user before will not be
    // overriden by this.
    this.each((step) =>
      step.resize(
        baseNodeSize,
        baseNodeDimensions || DefaultDimensions[baseNodeSize]
      )
    );

    // Convert our steps hierarchy to D3-compatible hierarchy
    const tree: FlextreeNode<Step> = layout.hierarchy(this);

    // Create the positions
    layout(tree);

    // iterate over the steps tree
    this.each((step) => {
      // Find the corresponding d3 node from the layouting
      const d3Node = tree.find((node) => node.id === step.id);
      if (!d3Node)
        throw new Error(
          "Step Layouting Err - Cannot find corresponding D3 node in hierarchy."
        );

      // Set the positions on the instance
      step.position = {
        x: d3Node.x,
        y: d3Node.y,
      };
    });

    console.log("Finished Graphing! Tree:", this);
  };

  // ===================
  //     D3 FIELDS
  // ===================
  children: Step[];
  parent: Step | null = null; // This will be null if this step is a root

  // ===================
  //    TREE METHODS
  // ===================

  /**
   * Standard hierarchy iteration function,
   * goes floor-by-floor
   */
  each = (callback: (step: Step) => any) => {
    // Create a stack array
    const stack: Step[] = [this];

    // While it's length is bigger than 0, pop a step,
    // invoke the callback on it, and then add all of it's children to the stack
    while (stack.length > 0) {
      const node = stack.pop() as Step;
      callback(node);

      for (const child of node.children) {
        stack.push(child);
      }
    }
  };

  /**
   * eachBefore
   * standard iteration breadth-first iteration method
   */
  eachBefore = (callback: (step: Step) => any): void => {
    callback(this);
    for (const child of this.children) child.eachBefore(callback);
  };

  /**
   * A function for the frontend to compare for changes and rerun the graph
   * function (in order to proprely and efficiently rerender)
   */
  shouldGraph = (prevTree: Step): boolean => {
    return JSON.stringify(prevTree.toJSON()) !== JSON.stringify(this.toJSON());
  };

  /**
   * A function to convert this tree into a JSON object
   * @param onlyCompleted - Optional, convert only completed steps into the JSON object
   * @default true
   */

  toJSON = (onlyCompleted: boolean = true): JSONStep | null => {
    if ((this.state === StepState.COMPLETE && onlyCompleted) || !onlyCompleted)
      return {
        id: this.id,
        size: this.size,
        action: this.action?.id,
        protocol: this.protocol?.id,
        dimensions: this.dimensions,
        inflows: this.inflows.map((inflow) => inflow.id),
        outflow: this.outflows.map((outflow) => outflow.id),
        children: this.children
          .filter((child) =>
            onlyCompleted ? child.state === StepState.COMPLETE : true
          )
          .flatMap((child) => {
            const jsonChild = child.toJSON();
            if (jsonChild !== null) return [jsonChild];
            return [];
          }),
        parent: this.parent?.toJSON() || null,
        // customArguments: this.customArguments.map((arg) => arg.) // TODO
      };

    return null;
  };
}
