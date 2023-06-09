/**
 * A class representing a frontend step's states
 */

import {
  DBToken,
  YCAction,
  YCArgument,
  YCClassifications,
  YCFunc,
  YCProtocol,
  YCToken,
  assert,
  DBFunction,
  JSONStep,
  StepData,
  TriggerTypes,
} from "@yc/yc-models";
import {
  ActionConfigs,
  DBStepConstructionProps,
  DefaultDimensions,
  Dimensions,
  TokenPercentage,
  IStep,
  Position,
  StepSizing,
  StepState,
  StepType,
  TriggerConfigs,
  JSONFrontendStep,
} from "./types";
import { v4 as uuid } from "uuid";
import { FlextreeNode, flextree } from "d3-flextree";
import { HierarchyNode } from "d3-hierarchy";
import { ImageSrc } from "components/wrappers/types";
import { DEPOSIT_TRIGGER_CONFIG } from "components/steps/constants";
import { getCustomFields } from "./helpers/get-custom-fields";
import { Node } from "@yc/yc-models";

export class Step extends Node<Step> implements IStep<Step> {
  // ====================
  //      METHODS
  // ====================

  // -----------
  //    CORE
  // -----------
  /**
   * Add a child step
   * @param child - A Step instance
   */
  addChild = (child: Step, inherit: boolean = true) => {
    this.removeEmptyChildren();
    this.children = [...this.children, child];
    child.parent = this;
    inherit && child.inheritStyle();
  };

  /**
   * Remove a child
   * @param id - the string ID of the child to remove
   */
  removeChild = (id: string) => {
    // Remove the child
    this.children = this.children.filter((child) => {
      // If the ID is another one than the child to remove, we return true
      const isMatchingID = child.id == id;
      if (!isMatchingID) return true;

      // Otherwise, we first look for it's function in our unlockedFunctions.
      // if we find it, we re-open it for use.
      const unlockedFunctionIdx = this.unlockedFunctions.findIndex(
        (unlockedFunc) => unlockedFunc.func.id === child.function?.id
      );
      if (unlockedFunctionIdx !== -1)
        this.unlockedFunctions[unlockedFunctionIdx] = {
          func: this.unlockedFunctions[unlockedFunctionIdx].func,
          used: false,
        };

      // We return false to filter it out and remove it
      return false;
    });
    // If the children array is now empty, we add an empty step that is used to add new steps on the frontend (Assuming that we are writable)
    if (this.children.length === 0 && this.writeable)
      this.attemptAddEmptyChild();
  };

  /**
   * Add an empty child,
   * used for adding new childs, usually
   */
  attemptAddEmptyChild = () => {
    // We obv dont want an empty child for an empty child
    if (this.state == "empty") return;

    // If we got no children and this step is writeable, add a new one
    if (this.children.length === 0 && this.writeable)
      this.addChild(
        new Step({
          state: "empty",
        }),
        true
      );
  };

  /**
   * Removes all "empty" childs. Used when new children are added, to remove the empty child-adder
   * placeholders
   */
  removeEmptyChildren = () => {
    this.children = this.children.filter((child) => child.state !== "empty");
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
    dimensions: Dimensions | null = this.defaultDimensions[newSize],
    manual: boolean = false,
    override: boolean = false
  ) => {
    // If this step has been manually resized before, then this resize must be manual as well to retain their choice
    if (manual || override || !this.manuallyResized) {
      // We set the new dimensions & Sizing
      this.size = newSize;
      this.dimensions = dimensions || this.defaultDimensions[newSize];

      // If it's a manual resize we set the global variable specifying the user manually resized this step
      if (manual) this.manuallyResized = true;
    }
  };

  /**
   * Resize this step and it's descendents
   */
  resizeAll = (
    newSize: StepSizing,
    dimensions: Dimensions | null,
    manual: boolean = false
  ) => {
    this.each((step: Step) => step.resize(newSize, dimensions, manual));
  };

  /**
   * @notice
   * Inherits styling from the parent
   */
  inheritStyle = () => {
    // Inherit the current sizing (e.g when a SMALL parent adds a child, they obv dont want
    // it to be a MEDIUM)
    this.parent?.size !== undefined && this.resize(this.parent.size);

    // Inherit writeability. Writeability is false by default, but when we add a child to
    // a writeable parent, then it should be writeable
    this.writeable = this.parent?.writeable || this.writeable;

    this.chainId = this.parent?.chainId || null;
  };

  // ---------------
  //  IMPL-SPECIFIC
  // ---------------

  /**
   * Set the step's function
   * @param newFunc - The function to set
   */
  setFunction(func: YCFunc | null) {
    this.function = func;
    this.customArguments = func ? getCustomFields(func) : [];
  }

  /**
   * Set some custom argument,
   * done in order to change the array ref and allow frontend to react
   * @param idx - Index to insert in
   * @param value - The value to insert
   */
  setCustomArg(idx: number, value: any) {
    const newArr = [...this.customArguments];
    newArr[idx] = value;
    this.customArguments = newArr;
  }

  /**
   * @notice
   * Get the available inflow tokens.
   *
   * This retreives the parent's outflows, and subtracts the percentage of each
   * token used by other siblings, and hence returns a filtered array
   */
  get availableTokens(): YCToken[] {
    // Filter the parent's inflows to return more than 0% available percentage on @availableAndEvenPercentage
    return (this.parent?.inflows || []).filter(
      (token) =>
        (this.parent?.availableAndEvenPercentage(token).available || 0) > 0
    );
  }

  /**
   * @notice
   * Add an outflow to this step,
   * This has additional logic in order to ensure appropriate percentage splitting
   * of each token across all siblings, from the parent's inflows.
   */

  addOutflow = (token: YCToken) => {
    // If we already have this outflow, then we return
    if (this.outflows.some((_token) => _token.id === token.id)) return;

    // A parent must be existant
    if (!this.parent)
      throw new Error("Step ERR: Cannot Add Outflow Without A Valid Parent!");

    /**
     * Update the clean tokens' percentages on our parent for the token requested, add us as an additional for the calcs
     */
    const even = this.parent.updateCleanTokenPercentages(token, [this]);

    // Validate that this token is available for us,
    // if not, remove it from our mapping (set by the above function), and return
    if (even === 0) {
      this.tokenPercentages.delete(token.id);
      return;
    }

    // Otherwise, push the outflow
    this.outflows.push(token);

    // We refrain from pushing the outflow in the beginning to avoid unwanted side effects
  };

  /**
   * Add an inflow,
   * this does not do much other than pushing into the array, main reason for this is a unified API
   * with the addOutflow which has a purpose
   */
  addInflow = (token: YCToken) => {
    if (this.inflows.some((_token) => _token.id === token.id)) return;
    this.inflows.push(token);
  };

  /**
   * Remove an outflow
   */

  removeOutflow = (token: YCToken, index?: number) => {
    // Remove it from our array
    const idx =
      index !== undefined
        ? index
        : this.outflows.findIndex((_token) => _token.id == token.id);
    if (idx == -1) throw "Cannot Remove Outflow - Index Is -1 (Nonexistant!)";
    this.outflows.splice(idx, 1);

    // Delete it from our mapping of token percentages
    this.tokenPercentages.delete(token.id);

    // Re-update the other clean siblings' percentages of this token
    this.parent?.updateCleanTokenPercentages(token);
  };

  /**
   * Remove an inflow
   */
  removeInflow = (token: YCToken, index?: number) => {
    // Remove it from our array
    const idx =
      index !== undefined
        ? index
        : this.inflows.findIndex((_token) => _token.id == token.id);
    if (idx == -1) throw "Cannot Remove Inflow - Index Is -1 (Nonexistant!)";
    this.inflows.splice(idx, 1);
  };

  /**
   * clearFlows
   * removes all existing flows
   */
  clearFlows = () => {
    // Remove all mapped percentages
    this.clearOutflows();
    this.clearInflows();
  };

  /**
   * clearInflows
   */
  clearInflows = () => {
    for (const token of this.inflows) this.removeInflow(token);
  };

  /**
   * clearOutflows
   */
  clearOutflows = () => {
    for (const token of this.outflows) this.removeOutflow(token);
  };

  /**
   * @notice availableAndEvenPercentage
   * @param token - The token to calculate the percentages of
   * @param additionalChilds - Optioanl additional childs to take in mind as clean
   * @returns even - A percentage that is splittable across all clean siblings for this token
   * @returns available - The maximum available percentage for this token, so the accumlative percentage
   * of this token not used by dirty siblings
   * @returns clean - the children that are considered non-dirty that have this flow, along with the index of it
   * @returns dirty - same format as above but only dirty
   *
   * @notice this is called on the parent
   */
  availableAndEvenPercentage = (
    token: YCToken,
    additionalCleanChilds?: Step[],
    childIDToExclude?: string
  ) => {
    // Init a variable for available percentage
    let available = 100;

    /**
     * Retreive an array of clean siblings (including us) that have this inflow
     * and are not dirty, as well as an array of siblings which are dirty
     *
     * Note that we map them to save the index of the flow within their hardInflows,
     * for effiency.
     */
    const dirty: Step[] = [];
    const clean: Step[] = [];

    for (const child of this.children || []) {
      // Get the percentage object in the child's token percentages mapping
      const childPercentage = child.tokenPercentages.get(token.id);

      // Irrelavent if does not contain our desired token in it's outflows mapping
      if (!childPercentage) continue;

      // Push to clean/dirty depending on proprety of it.
      // If it's dirty, subtract it from the available percentage
      if (childPercentage.dirty) {
        dirty.push(child);
        if (child.id !== childIDToExclude)
          available -= childPercentage.percentage;
      } else clean.push(child);
    }

    for (const child of additionalCleanChilds || []) clean.push(child);

    /**
     * Divide the available percentage to get an even percent to spread across all clean siblings
     */
    const even = available / clean.length;

    // Return both
    return {
      even,
      available,
      dirty,
      clean,
    };
  };

  /**
   * @notice
   * editTokenPercentage
   * edit a token's percentage inflowing from the parent to us
   */

  editTokenPercentage = (token: YCToken, percentage: number): boolean => {
    // We must have this token in our inflows
    if (!this.outflows.some((_token) => _token.id == token.id))
      throw "Cannot Edit Token Percentage - Inflow Not Found!";

    // Get available (and even) percentage
    const { even, available } = this.parent?.availableAndEvenPercentage(
      token
    ) || { available: 0, even: 0 };

    // Assert that the available percentage must be sufficient to the requested one
    if (percentage > available) return false;

    // Set the percentage
    this.tokenPercentages.set(token.id, {
      percentage,
      dirty: true,
    });

    // Update all of the other clean siblings on our parent
    this.parent?.updateCleanTokenPercentages(token);

    return true;
  };

  /**
   * Get the available percentage for a token
   */
  availableTokenPercentage = (token: YCToken) => {
    const { available } = this.availableAndEvenPercentage(token);
    return available;
  };

  /**
   * @notice
   * updateTokenPercentages
   * Updates the flows percentages on clean children
   * @param token - Optional, a token to do this on
   * @default all
   *
   * @param additionalChilds - Optioanl additional childs to take in mind as clean
   *
   * @returns even - The even percentage used, or the last one assumgn an interation was used
   */
  updateCleanTokenPercentages = (
    token?: YCToken,
    additionalChilds?: Step[]
  ) => {
    if (token) {
      const { even, clean } = this.availableAndEvenPercentage(
        token,
        additionalChilds
      );
      for (const child of clean)
        child.tokenPercentages.set(token.id, {
          percentage: even,
          dirty: false,
        });

      return even;
    }

    for (const token of this.inflows) {
      const { even, clean } = this.availableAndEvenPercentage(token);
      for (const child of clean)
        child.tokenPercentages.set(token.id, {
          percentage: even,
          dirty: false,
        });
    }
  };

  /**
   * Clean step configs,
   * clean all different variables/fields (that are not core), reset it to initial
   */
  resetConfigs = () => {
    this.type = StepType.STEP;
    this.state = "initial";
    this.protocol = null;
    this.action = null;
    this.actionConfig = null;
    this.data = {};
    this.setFunction(null);
    for (let i = 0; i < this.outflows.length; i++)
      this.removeOutflow(this.outflows[i], i);
    for (let i = 0; i < this.inflows.length; i++)
      this.removeOutflow(this.inflows[i], i);
    this.tokenPercentages.clear();
  };

  /**
   * disableDescendentsWriteabillity,
   * disables writability on the step and all of its descendents
   */
  disableDescendantsWriteability = () => {
    this.map((step) => {
      step.writeable = false;
      step.removeEmptyChildren();
    });
  };

  /**
   * enableDescendentsWriteability
   * Enable writeability on all descendents
   */
  enableDescendentsWriteability = () => {
    this.map((step) => {
      step.writeable = true;
      step.attemptAddEmptyChild();
    });
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
   * Default dimensions. A node component may not be compliant with the reguler default dimensions,
   * so we need to keep track of these so that it does not mess up on resizes
   */
  defaultDimensions: Record<StepSizing, Dimensions> = DefaultDimensions;

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
   * Mapping tokens (outflows of this step) => percentage used of parent's inflow of the token
   * (id => percentage & isDirty)
   */
  tokenPercentages: Map<string, TokenPercentage> = new Map();

  /**
   * The action of this step, in YCAction (e.g Stake, Swap, Long, LP)
   */
  action: YCAction | null = null;

  /**
   * The YCFunction used by this step. (i.e stakeTokens(), addLiquidityETH())
   */
  function: YCFunc | null = null;

  /**
   * Chain ID of this step
   */
  chainId: number | null = null;

  /**
   * If false, custom args are not copied when cloning the step.
   * Otherwise, the same array reference is used
   */
  retainCustomArgsRef: boolean = false;

  /**
   * Functions that are unlocked starting from this node to it's descendents,
   * by some external factor (i.e, this is a tree strategy and some functions
   * were unlocked by the seed strategy, added to this array)
   */
  unlockedFunctions: {
    func: YCFunc;
    used: boolean;
  }[] = [];

  /**
   * The different possible action configurations for a @notice REGULER step
   */
  actionConfig: ActionConfigs | null = null;

  /**
   * Optional custom arguments for the used function
   */
  customArguments: Array<any | null> = [];

  // -----------
  // Trigger Step Variables
  // -----------
  /**
   * The name of this trigger
   */
  triggerType: TriggerTypes | null = null;

  /**
   * A short description of this trigger
   */
  triggerDescription: string | null = null;

  /**
   * An icon representing this trigger
   */
  triggerIcon: ImageSrc = null;

  /**
   * Trigger config
   * actionConfig equivlenet for @notice trigger
   */
  triggerConfig: TriggerConfigs | null = null;

  /**
   * Any additional data that the Trigger config will want to save
   */
  data: StepData = {};

  /**
   * Any additional data that the trigger step will want to display on the frontend.
   */
  triggerVisuals: React.ReactNode;

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
  constructor(
    config?: IStep<Step>,
    writeable: boolean = config?.writeable || false,
    inherit: boolean = true
  ) {
    super();
    /**
     * Construct global variables
     */
    this.id = config?.id || uuid();
    this.state = config?.state || "initial";
    this.size = config?.size || this.parent?.size || StepSizing.MEDIUM;
    this.dimensions = this.defaultDimensions[this.size];
    this.type = config?.type || StepType.STEP;
    this.chainId = config?.chainId || null;
    this.inflows = config?.inflows || [];
    this.outflows = config?.outflows || [];
    this.writeable = writeable;
    this.children = config?.children || [];
    this.data = config?.data || {};
    this.tokenPercentages = config?.tokenPercentages
      ? new Map<string, TokenPercentage>(config.tokenPercentages)
      : this.tokenPercentages;

    this.retainCustomArgsRef = config?.retainCustomArgsRef || false;

    /**
     * Construct reguler step variables
     */
    this.protocol = config?.protocol || null;
    this.action = config?.action || null;
    config?.function ? this.setFunction(config.function) : null;
    this.customArguments = config?.customArguments || [];
    this.unlockedFunctions = config?.unlockedFunctions || [];
    this.actionConfig = config?.actionConfig || null;

    /**
     * Construct trigger step variables
     */
    this.triggerType = config?.triggerType || null;
    this.triggerIcon = config?.triggerIcon || null;
    this.triggerDescription = config?.triggerDescription || null;
    this.triggerVisuals = config?.triggerVisuals || null;
    this.triggerConfig = config?.triggerConfig || null;

    for (const child of this.children) {
      child.parent = this;
      child.inheritStyle();
      if (!child.chainId) child.chainId = this.chainId;
    }

    // Add an empty placeholder child if our length is 0 and we are writeable
    this.attemptAddEmptyChild();

    if (this.state == "empty") this.inheritStyle();
  }

  // ========================================
  //    CONSTRUCT USING DBSTEP + CONTEXT
  // ========================================
  static fromDBStep = ({
    step,
    context,
    iStepConfigs,
  }: DBStepConstructionProps<Step>) => {
    // If this is the root,
    const additionalConfigs = step.id !== "root" ? {} : DEPOSIT_TRIGGER_CONFIG;
    const stepConfig: IStep<Step> = {
      id: step.id,
      protocol: step.protocol ? context.getProtocol(step.protocol) : null,
      inflows: step.inflows.map((dbtoken: DBToken) => {
        return new YCToken(dbtoken, context);
      }),
      outflows: step.outflows.map((dbtoken: DBToken) => {
        return new YCToken(dbtoken, context);
      }),
      state: "complete",
      action: step.action ? context.getAction(step.action) : null,
      function: step.function ? new YCFunc(step.function, context) : null,
      children: step.children.map((child: JSONStep) =>
        Step.fromDBStep({
          step: child,
          context: context,
          iStepConfigs: iStepConfigs,
        })
      ),
      size: iStepConfigs?.size,
      retainCustomArgsRef: step.retainCustomArgsRef,
      ...additionalConfigs,
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
    step: JSONFrontendStep;
    context: YCClassifications;
  }): Step => {
    if (!step) return new Step();
    const config: IStep<Step> = {
      ...step,
      id: step.id,
      inflows: step.inflows.map(
        (dbtoken: DBToken) => new YCToken(dbtoken, context)
      ),
      outflows: step.outflows.map(
        (dbtoken: DBToken) => new YCToken(dbtoken, context)
      ),
      children: step.children.map((child: JSONFrontendStep) =>
        Step.fromJSONStep({
          step: child,
          context: context,
        })
      ),
      type: step.type,
      size: step.size,
      action: step.action ? context.getAction(step.action) : null,
      function: step.function ? new YCFunc(step.function, context) : null,
      unlockedFunctions: step.unlockedFunctions
        ? step.unlockedFunctions.flatMap(({ funcID, used }) => {
            const func = context.getFunction(funcID);
            return func ? [{ func, used }] : [];
          })
        : [],

      protocol: step.protocol ? context.getProtocol(step.protocol) : null,
      customArguments: step?.customArguments || [],
      retainCustomArgsRef: step?.retainCustomArgsRef,
    };
    const resStep = new Step(config);
    for (const child of resStep.children) child.parent = resStep;
    return resStep;
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

  graph = (basePositions?: Position) => {
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
        x: node.x + (basePositions?.x || 0),
        y: node.y + (basePositions?.y || 0),
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
  //    TREE METHODS
  // ===================

  /**
   * A function for the frontend to compare for changes and rerun the graph
   * function (in order to proprely and efficiently rerender)
   */
  shouldGraph = (prevTree: Step | null): boolean => {
    return (
      prevTree == null ||
      JSON.stringify(prevTree.toJSON({ onlyCompleted: false })) !==
        JSON.stringify(this.toJSON({ onlyCompleted: false }))
    );
  };

  /**
   * A function to convert this tree into a JSON object
   * @param onlyCompleted - Optional, convert only completed steps into the JSON object
   * @default true
   */

  toJSON = ({
    onlyCompleted = false,
  }: {
    onlyCompleted?: boolean;
  }): JSONFrontendStep | null => {
    if (onlyCompleted && this.state !== "complete") return null;
    return {
      id: this.id,
      size: this.size,
      action: this.action?.id || "",
      protocol: this.protocol?.id || "",
      dimensions: this.dimensions,
      inflows: this.inflows.map((token) => token.toJSON()),
      outflows: this.outflows.map((token) => token.toJSON()),
      writeable: this.writeable,
      function: this.function?.toJSON(true) as DBFunction,
      unlockedFunctions: this.unlockedFunctions.map((func) => ({
        funcID: func.func.id,
        used: func.used,
      })),
      retainCustomArgsRef: this.retainCustomArgsRef,
      state: this.state,
      children: this.children.flatMap((child) => {
        const jsonChild = child.toJSON({ onlyCompleted: false });
        if (jsonChild !== null) return [jsonChild];
        return [];
      }),
      actionConfig: this.actionConfig,
      type: this.type,
      triggerType: this.triggerType,
      triggerDescription: this.triggerDescription,
      triggerVisuals: this.triggerVisuals,
      triggerIcon: this.triggerIcon,
      triggerConfig: this.triggerConfig,
      data: this.data,
      tokenPercentages: Array.from(this.tokenPercentages.entries()),
      customArguments: this.customArguments,
      chainId: this.chainId || undefined,
    };
  };

  toDeployableJSON(): JSONStep | null {
    if (this.state !== "complete") return null;
    return {
      id: this.id,
      action: this.action?.id || "",
      protocol: this.protocol?.id || "",
      inflows: this.inflows.map((token) => token.toJSON()),
      outflows: this.outflows.map((token) => token.toJSON()),
      function: this.function?.toJSON(true) as DBFunction,
      children: this.children.flatMap((child) => {
        const jsonChild = child.toDeployableJSON();
        if (jsonChild !== null) return [jsonChild];
        return [];
      }),
      data: this.data,
      tokenPercentages: Array.from(this.tokenPercentages.entries()).map(
        ([tokenID, { percentage }]) => [tokenID, percentage]
      ),
      customArguments: this.customArguments,
      type: this.type,
      triggerType: this.triggerType,
      chainId: this.chainId || 1,
      retainCustomArgsRef: this.retainCustomArgsRef,
    };
  }
}

// const serializeCustomArgs = (
//   argsTreeArr: CustomArgsTree[]
// ): CustomArgsTree[] => {
//   const serialized: CustomArgsTree[] = [];

//   for (const arg of argsTreeArr) {
//     const serializedArg: CustomArgsTree = {
//       value: null,
//       customArgs: arg.customArgs,
//       preConfigured: true,
//     };

//     if (typeof arg.value == "object")
//       serializedArg.value =
//         arg.value instanceof YCFunc
//           ? arg.value.toJSON()
//           : safeToJSON(arg.value);
//     else serializedArg.value = arg.value;

//     if (arg.customArgs.length > 0)
//       serializedArg.customArgs = serializeCustomArgs(serializedArg.customArgs);

//     serialized.push(serializedArg);
//   }

//   return serialized;
// };

// const deseriallizeCustomArgs = (
//   argsTreeArr: CustomArgsTree[]
// ): CustomArgsTree[] => {
//   const circulerCreator = (arg: any) => {
//     if (typeof arg !== "object") {
//       const potentialFunction =
//         YCClassifications.getInstance().getFunction(arg);
//       return potentialFunction || arg;
//     }

//     if (typeof arg == "object") {
//       const newObj: typeof arg = {};
//       for (const entry of Object.entries(arg))
//         newObj[entry[0]] = circulerCreator(entry[1]);
//       return newObj;
//     }
//   };
//   const deseriallized: CustomArgsTree[] = [];

//   for (const arg of argsTreeArr) {
//     const deserializedArg: CustomArgsTree = {
//       value: circulerCreator(arg),
//       customArgs: arg.customArgs.map((nestedArg) => circulerCreator(nestedArg)),
//       preConfigured: true,
//     };
//     deseriallized.push(deserializedArg);
//   }

//   return deseriallized;
// };
