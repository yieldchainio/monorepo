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
  Position,
  StepSizing,
  StepState,
} from "./types";
import { v4 as uuid } from "uuid";

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
   * Core variables
   */
  children: Step[];
  parent: Step | null = null; // This will be null if this step is a root

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

  graph = () => {};
}
