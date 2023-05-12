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
  data: any = {};

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
    this.type = StepType.STEP;
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
      typeof _step.tokenPercentages == "object" ? [] : _step.tokenPercentages
    );
  }

  /**
   * Convert the step into a JSON step
   */
  toJSON = (): JSONStep => {
    return {
      id: this.id,
      parentId: this.parent as unknown as string,
      action: this.action?.id || "",
      protocol: this.protocol?.id || "",
      inflows: this.inflows.map((token) => token.toJSON()),
      outflows: this.outflows.map((token) => token.toJSON()),
      function: this.function?.toJSON() as DBFunction,
      customArguments: this.customArguments,
      children: this.children.map((child) => child.toJSON()),
      data: this.data,
      tokenPercentages: Array.from(this.tokenPercentages.entries()),
      type: this.type,
    };
  };
}
