/**
 * A class representing a frontend step's states
 */

import {
  DBFlow,
  DBStep,
  DBToken,
  YCAction,
  YCArgument,
  YCClassifications,
  YCFlow,
  YCFunc,
  YCProtocol,
  YCToken,
  assert,
} from "@yc/yc-models";
import {
  ActionConfigs,
  BaseStepStates,
  DBStepConstructionProps,
  DefaultDimensions,
  Dimensions,
  IStep,
  JSONStep,
  Position,
  StepSizing,
  StepState,
  StepType,
} from "./types";
import { v4 as uuid } from "uuid";
import { FlextreeNode, flextree } from "d3-flextree";
import { HierarchyNode } from "d3-hierarchy";
import { FlowDirection } from "@prisma/client";
import { ImageSrc } from "components/wrappers/types";

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
    // Remove the child
    this.children = this.children.filter((child) => child.id !== id);
    // If the children array is now empty, we add an empty step that is used to add new steps on the frontend (Assuming that we are writable)
    if (this.children.length === 0 && this.writeable)
      this.attemptAddEmptyChild();
  };

  /**
   * Add an empty child,
   * used for adding new childs, usually
   */
  attemptAddEmptyChild = () => {
    if (this.children.length === 0 && this.writeable)
      this.addChild(
        new Step({
          state: "empty",
        })
      );
  };

  /**
   * Change the @state field
   * @param newState  - the new state to update to
   * @param actionConf - if the new state is of type CONFIG, an action config must be provided
   */
  changeState = (newState: StepState, actionConf?: ActionConfigs) => {
    assert(
      !(newState in ActionConfigs) || actionConf !== undefined,
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
      this.dimensions = dimensions || DefaultDimensions[newSize];

      // If it's a manual resize we set the global variable specifying the user manually resized this step
      if (manual) this.manuallyResized = true;
    }
  };

  /**
   * Resize this step and it's descendents
   */
  resizeAll = (
    newSize: StepSizing,
    dimensions: Dimensions | null = DefaultDimensions[newSize],
    manual: boolean = false
  ) => {
    this.each((step: Step) => step.resize(newSize, dimensions, manual));
  };

  // ====================
  //      VARIABLES
  // ====================

  // ------
  // Globals
  // ------
  /**
   * The UUID of this step
   */
  id: string;

  /**
   * The "Type" of this step
   * can either be "STEP", "TRIGGER", or "CONDITION"
   */
  type: StepType;

  /**
   * The state of this step.
   * Can either be "complete", "initial", or "config"
   */
  state: StepState;

  /**
   * A enumerable sizing variable for this step.
   * i.e "SMALL", "MEDIUM"
   */
  size: StepSizing;

  /**
   * The dimensions of this step (width, height). Used for graph calcs
   */
  dimensions: Dimensions = { width: 0, height: 0 };

  /**
   * The positions of this step on the used canvas. This is set by the graph() function
   */
  position: Position = { x: 0, y: 0 };

  // ----------
  // Reguler Step Variables
  // ----------
  /**
   * The protocol of the step (e.g GMX, Uniswap)
   */
  protocol: YCProtocol | null = null;

  /**
   * The inflows of this step - In YCTokens (e.g ETH, BTC)
   */
  inflows: YCToken[] = [];

  /**
   * The outflows of this step - In YCTokens (e.g ETH, BTC)
   */
  outflows: YCToken[] = [];

  /**
   * The action of this step, in YCAction (e.g Stake, Swap, Long, LP)
   */
  action: YCAction | null = null;

  /**
   * The YCFunction used by this step. (i.e stakeTokens(), addLiquidityETH())
   */
  function: YCFunc | null = null;

  /**
   * The different possible action configurations for a @notice REGULER step
   */
  actionConfig: ActionConfigs | null;

  // -----------
  // Trigger Step Variables
  // -----------
  /**
   * The name of this trigger
   */
  triggerName: string | null = null;

  /**
   * A short description of this trigger
   */
  triggerDescription: string | null = null;

  /**
   * An icon representing this trigger
   */
  triggerIcon: ImageSrc = null;

  /**
   * Any additional data that the Trigger config will want to save
   */
  data: any | null = null;

  /**
   * Any additional data that the trigger step will want to display on the frontend.
   */
  triggerVisuals: React.ReactNode;

  percentage: number;

  // --------
  // Conditional Step Variables
  // --------

  /**
   * Utility variables
   */
  manuallyResized: boolean = false;
  edgelength: number = 80;
  writeable: boolean = false;

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor(config?: IStep<Step>, writeable: boolean = false) {
    /**
     * Construct global variables
     */
    this.id = config?.id || uuid();
    this.state = config?.state || "initial";
    this.size = config?.size || StepSizing.MEDIUM;
    this.dimensions = DefaultDimensions[this.size];
    this.type = config?.type || StepType.STEP;
    this.inflows = config?.inflows || [];
    this.outflows = config?.outflows || [];
    this.writeable = writeable;
    this.children = config?.children || [];

    // Add an empty placeholder child if our length is 0 and we are writeable
    this.attemptAddEmptyChild();

    /**
     * Construct reguler step variables
     */
    this.actionConfig = config?.actionConfig || null;
    this.protocol = config?.protocol || null;
    this.action = config?.action || null;
    this.function = config?.function || null;
    this.actionConfig = config?.actionConfig || null;

    /**
     * Construct trigger step variables
     */
    this.triggerName = config?.triggerName || null;
    this.triggerIcon = config?.triggerIcon || null;
    this.triggerDescription = config?.triggerDescription || null;
    this.triggerVisuals = config?.triggerVisuals || null;

    this.percentage = config?.percentage || 0;
  }

  // ========================================
  //    CONSTRUCT USING DBSTEP + CONTEXT
  // ========================================
  static fromDBStep = ({
    step,
    context,
    iStepConfigs,
  }: DBStepConstructionProps<Step>) => {
    const stepConfig: IStep<Step> = {
      id: step.id,
      protocol: context.getProtocol(step.protocol),
      inflows: step.inflows.map((dbtoken: DBToken) => {
        return new YCToken(dbtoken, context);
      }),
      outflows: step.outflows.map((dbtoken: DBToken) => {
        return new YCToken(dbtoken, context);
      }),
      state: "complete",
      percentage: step.percentage,
      action: context.getAction(step.action),
      function: context.getFunction(step.function),
      children: step.children.map((child: DBStep) =>
        Step.fromDBStep({
          step: child,
          context: context,
          iStepConfigs: iStepConfigs,
        })
      ),
      size: iStepConfigs?.size,
    };
    return new Step(stepConfig);
  };

  /**
   * From JSONStep construction
   */
  static fromJSONStep = ({
    step,
    context,
  }: {
    step: JSONStep;
    context: YCClassifications;
  }): Step => {
    if (!step) return new Step();
    const config: IStep<Step> = {
      ...step,
      id: step.id,
      inflows: step.inflows
        ? step.inflows.flatMap((dbtoken: string) => {
            const token = context.getToken(dbtoken);
            return token ? [token] : [];
          })
        : [],
      outflows: step.outflows
        ? step.outflows.flatMap((dbtoken: string) => {
            const token = context.getToken(dbtoken);
            return token ? [token] : [];
          })
        : [],
      children: step.children.map((child: JSONStep) =>
        Step.fromJSONStep({
          step: child,
          context: context,
        })
      ),
      type: step.type,
      size: step.size,
      percentage: step.percentage,
      action: step.action ? context.getAction(step.action) : null,
      function: step.function ? context.getFunction(step.function) : null,
      protocol: step.protocol ? context.getProtocol(step.protocol) : null,
      customArguments: step.customArguments,
    };
    return new Step(config);
  };

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
    console.log("Running Graph...");
    // Instantiate layout instance with our settings
    const layout = flextree({
      nodeSize: (node: HierarchyNode<Step>) => [
        node.data.dimensions.width,
        node.data.dimensions.height + node.data.edgelength,
      ],

      /**
       * Our spacing logic for the steps nodes
       *
       * If the nodes share the same parent, and their own sibling bundle is of
       * an even length, and they are the ones closest to the parent - We give it
       * a spacing worth of the parent's width. Otherwise, we give it a base spacing
       * of 80
       */
      // spacing: 80,
      spacing: (aNode, bNode) => {
        const aParent = aNode.parent;
        const bParent = bNode.parent;
        // if none of them are defined we just return 80
        if (!aParent || !bParent) return 80;

        const aChildren = aParent.children;

        if (!aChildren) return 80;

        // If the mentioned requirements are true, we add the parent's width
        if (
          aParent.id === bParent.id &&
          aChildren.length % 2 === 0 &&
          aChildren.findIndex((child) => child.id === aNode.id) ===
            aChildren.length / 2 - 1
        )
          return aParent.data.dimensions.width || 40;

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
    const tree = layout.hierarchy(this);

    // Create the positions
    layout(tree);

    /**
     * @notice
     * We calculate the sizing of the canvas here
     */

    // Init variables for the width and height
    let negativeWidth = 0;
    let negativeHeight = 0;
    let positiveWidth = 0;
    let positiveHeight = 0;

    // Iterate over each d3 node, find it's corresponding step, and set the positioning on it
    tree.each((node: FlextreeNode<Step>) => {
      const Step = this.find((step) => step.id == node.data.id);
      if (!Step)
        throw new Error(
          "D3 Step ERR: Cannot find corresponding YCStep - ID: " + node.data.id
        );

      // Set the position
      Step.position = {
        x: node.x,
        y: node.y,
      };

      /**
       * We move onto canvas-size calculation
       */
      // Shortand for mem efficieny
      const sizing = Step.getNodeSizing();
      positiveWidth = Math.max(sizing.width.positive, positiveWidth);
      negativeWidth = Math.min(sizing.width.negative, negativeWidth);
      positiveHeight = Math.max(sizing.height.positive, positiveHeight);
      negativeHeight = Math.min(sizing.height.negative, negativeHeight);
    });

    /**
     * Return the dimensions of the canvas.
     *
     * logic:
     *
     * If positive width is 500, min width is -300 (there are 5 nodes to the right and 3 to the left),
     * end result would be 800 total width (500 - (-300)), so all of them would fit
     */
    return [positiveWidth - negativeWidth, positiveHeight - negativeHeight] as [
      number,
      number
    ];
  };

  /**
   * @method
   * getNodeSizing
   * Calculates the positive & negative width, height of the node
   */
  getNodeSizing = () => {
    return {
      width: {
        positive: this.position.x + this.dimensions.width,
        negative: this.position.x,
      },
      height: {
        positive: this.position.y + this.dimensions.height,
        negative: this.position.y,
      },
    };
  };

  // ===================
  //     TREE FIELDS
  // ===================
  children: Step[];

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
   * find
   * Iterates over the tree to find a step corresponding to a callback check, and returns it (or null if not found)
   */
  find = (condition: (step: Step) => boolean): Step | null => {
    // Create a stack array
    const stack: Step[] = [this];

    // While it's length is bigger than 0, pop a step,
    // invoke the condition on it. If true, return the node - otherwise, add all of it's children to the stack (to keep looping)
    while (stack.length > 0) {
      const node = stack.pop() as Step;
      const res = condition(node);
      if (res) return node;

      for (const child of node.children) {
        stack.push(child);
      }
    }
    // return null if we found none that answer our condition
    return null;
  };

  /**
   * Map
   * standard mapping function for the tree
   */

  map = <T>(callback: (step: Step) => T): T[] => {
    // Create a stack array
    const stack: Step[] = [this];
    const result: T[] = [];

    // While it's length is bigger than 0, pop a step,
    // invoke the callback on it, and then add all of it's children to the stack
    while (stack.length > 0) {
      const node = stack.pop() as Step;
      result.push(callback(node));

      for (const child of node.children) {
        stack.push(child);
      }
    }

    return result;
  };

  /**
   * A function for the frontend to compare for changes and rerun the graph
   * function (in order to proprely and efficiently rerender)
   */
  shouldGraph = (prevTree: Step | null): boolean => {
    return (
      prevTree == null ||
      JSON.stringify(prevTree.toJSON(false)) !==
        JSON.stringify(this.toJSON(false))
    );
  };

  /**
   * A function to convert this tree into a JSON object
   * @param onlyCompleted - Optional, convert only completed steps into the JSON object
   * @default true
   */

  toJSON = (onlyCompleted: boolean = true): JSONStep | null => {
    if ((this.state === "complete" && onlyCompleted) || !onlyCompleted)
      return {
        id: this.id,
        size: this.size,
        action: this.action?.id,
        protocol: this.protocol?.id,
        dimensions: this.dimensions,
        inflows: this.inflows.map((token) => token.id),
        outflows: this.outflows.map((token) => token.id),
        writeable: this.writeable,
        percentage: this.percentage,
        state: this.state,
        children: this.children
          .filter((child) =>
            onlyCompleted ? child.state === "complete" : true
          )
          .flatMap((child) => {
            const jsonChild = child.toJSON();
            if (jsonChild !== null) return [jsonChild];
            return [];
          }),
        type: this.type,
        triggerName: this.triggerName,
        triggerDescription: this.triggerDescription,
        triggerVisuals: this.triggerVisuals,
        triggerIcon: this.triggerIcon,
        // customArguments: this.customArguments.map((arg) => arg.) // TODO
      };

    return null;
  };

  // TODO: toDBStep()
}
