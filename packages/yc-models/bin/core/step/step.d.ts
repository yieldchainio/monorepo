import { JSONStep, StepType, YCToken, YCAction, YCClassifications, YCFunc, YCProtocol } from "@yc/yc-models";
import { Node } from "../../general/node/plain.js";
export declare class YCStep extends Node<YCStep> {
    static readonly YCStepTupleSig = "tuple(bytes func, uint256[] childrenIndices, bytes[] conditions, bool isCallback)";
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
    protocol: YCProtocol | null;
    /**
     * The inflows of this step - In YCTokens (e.g ETH, BTC)
     */
    inflows: YCToken[];
    /**
     * The outflows of this step - In YCTokens (e.g ETH, BTC)
     */
    outflows: YCToken[];
    /**
     * Mapping tokens (outflows of this step) => percentage used of parent's inflow of the token
     * (id => percentage & isDirty)
     */
    tokenPercentages: Map<string, number>;
    /**
     * The action of this step, in YCAction (e.g Stake, Swap, Long, LP)
     */
    action: YCAction | null;
    /**
     * The YCFunction used by this step. (i.e stakeTokens(), addLiquidityETH())
     */
    function: YCFunc | null;
    /**
     * Optional custom arguments for the used function
     */
    customArguments: Array<string | null>;
    /**
     * Any additional data that the Trigger config will want to save
     */
    data: any;
    /**
     * The name of this trigger
     */
    triggerName: string | null;
    /**
     * A short description of this trigger
     */
    triggerDescription: string | null;
    /**
     * An icon representing this trigger
     */
    triggerIcon: string | {
        dark: string;
        light: string;
    } | null;
    constructor(_step: JSONStep, _context: YCClassifications);
    /**
     * Convert the step into a JSON step
     */
    toJSON: (retainFunc?: boolean) => JSONStep;
    print(indent?: number): void;
}
