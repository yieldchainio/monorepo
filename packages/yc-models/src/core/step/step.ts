import {
  FlowDirection,
  JSONStep,
  StepType,
  TokenPercentage,
  DBFlow,
  DBToken,
  YCToken,
  YCAction,
  YCClassifications,
  YCFunc,
  YCProtocol,
  DBFunction,
  YCArgument,
  StepData,
  TriggerTypes,
} from "@yc/yc-models";
import { Node } from "../../general/node/plain.js";

export class YCStep extends Node<YCStep> {
  // ====================
  //      CONSTNATS
  // ====================
  // The signature used to encode/decode the YCStep struct - i.e a tuple representing it's fields
  static readonly YCStepTupleSig =
    "tuple(bytes func, uint256[] childrenIndices, bytes[] conditions, bool isCallback)";

  // ====================
  //      VARIABLES
  // ====================
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
  tokenPercentages: Map<string, number> = new Map();

  /**
   * The action of this step, in YCAction (e.g Stake, Swap, Long, LP)
   */
  action: YCAction | null = null;

  /**
   * The YCFunction used by this step. (i.e stakeTokens(), addLiquidityETH())
   */
  function: YCFunc | null = null;

  /**
   * Optional custom arguments for the used function
   */
  customArguments: Array<string | null> = [];

  /**
   * Any additional data that the Trigger config will want to save
   */
  data: StepData = {};

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
  triggerIcon: string | { dark: string; light: string } | null = null;

  /**
   * Chain ID othis step
   */
  chainId: number;

  /**
   * If false, custom args are not copied when cloning the step.
   * Otherwise, the same array reference is used
   */
  retainCustomArgsRef: boolean = false;

  constructor(_step: JSONStep, _context: YCClassifications) {
    super();
    this.id = _step.id;

    this.parent = null;
    this.protocol = _step.protocol
      ? _context.getProtocol(_step.protocol)
      : null;
    this.inflows = _step.inflows.map((dbtoken: DBToken) => {
      return new YCToken(dbtoken, _context);
    });
    this.outflows = _step.outflows.map((dbbtoken: DBToken) => {
      return new YCToken(dbbtoken, _context);
    });
    this.children = _step.children.map((child: JSONStep) => {
      const step = new YCStep(child, _context);
      step.parent = this;
      return step;
    });
    this.type = _step.type;
    this.action = _step.action ? _context.getAction(_step.action) : null;
    this.function =
      typeof _step.function == "string"
        ? _context.getFunction(_step.function)
        : _step.function
        ? new YCFunc(_step.function, _context)
        : null;
    this.customArguments = _step.customArguments;
    this.data = _step.data;
    this.tokenPercentages = new Map(
      Array.isArray(_step.tokenPercentages) ? _step.tokenPercentages : []
    );

    this.triggerType = _step.triggerType || null;
    this.triggerDescription = _step.triggerDescription || null;
    this.triggerIcon = _step.triggerIcon || null;

    this.chainId = _step.chainId;
    this.retainCustomArgsRef = _step.retainCustomArgsRef;
  }

  /**
   * Convert the step into a JSON step
   */
  toJSON = (
    retainFunc: boolean = false,
    retainParent: boolean = true
  ): JSONStep => {
    return {
      id: this.id,
      parentId: retainParent
        ? (this.parent as unknown as string)
        : this.parent?.id,
      action: this.action?.id || "",
      protocol: this.protocol?.id || "",
      inflows: this.inflows.map((token) => token.toJSON()),
      outflows: this.outflows.map((token) => token.toJSON()),
      function: this.function?.toJSON(retainFunc) as DBFunction,
      customArguments: this.customArguments,
      children: this.children.map((child) =>
        child.toJSON(retainFunc, retainParent)
      ),
      data: this.data,
      tokenPercentages: Array.from(this.tokenPercentages.entries()),
      type: this.type,
      chainId: this.chainId,
      retainCustomArgsRef: this.retainCustomArgsRef,
    };
  };

  /**
   * Clone this step
   */
  clone(retainFunc: boolean = true) {
    const jsonStep = this.toJSON(retainFunc);
    jsonStep.customArguments = this.retainCustomArgsRef
      ? jsonStep.customArguments
      : [...jsonStep.customArguments];
    jsonStep.tokenPercentages = [...jsonStep.tokenPercentages];
    jsonStep.children = [...jsonStep.children];
    const newStep = new YCStep(jsonStep, YCClassifications.getInstance());
    newStep.parent = this.parent;
    return newStep;
  }

  print(indent: number = 0) {
    let indentation = "";
    while (indentation.length < indent) indentation += " ";
    console.log(
      indentation +
        this.function?.signature +
        " - " +
        (this.parent?.function?.signature ||
          this.parent?.triggerType ||
          "No Parent")
    );

    for (const child of this.children) child.print(indent + 2);
  }
}
