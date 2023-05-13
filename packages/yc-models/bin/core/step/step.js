import { StepType, YCToken, YCFunc, } from "@yc/yc-models";
import { Node } from "../../general/node/plain.js";
class YCStep extends Node {
    // ====================
    //      CONSTNATS
    // ====================
    // The signature used to encode/decode the YCStep struct - i.e a tuple representing it's fields
    static YCStepTupleSig = "tuple(bytes func, uint256[] childrenIndices, bytes[] conditions, bool isCallback)";
    // ====================
    //      VARIABLES
    // ====================
    /**
     * The UUID of this step
     */
    id;
    /**
     * The "Type" of this step
     * can either be "STEP", "TRIGGER", or "CONDITION"
     */
    type;
    /**
     * The protocol of the step (e.g GMX, Uniswap)
     */
    protocol = null;
    /**
     * The inflows of this step - In YCTokens (e.g ETH, BTC)
     */
    inflows = [];
    /**
     * The outflows of this step - In YCTokens (e.g ETH, BTC)
     */
    outflows = [];
    /**
     * Mapping tokens (outflows of this step) => percentage used of parent's inflow of the token
     * (id => percentage & isDirty)
     */
    tokenPercentages = new Map();
    /**
     * The action of this step, in YCAction (e.g Stake, Swap, Long, LP)
     */
    action = null;
    /**
     * The YCFunction used by this step. (i.e stakeTokens(), addLiquidityETH())
     */
    function = null;
    /**
     * Optional custom arguments for the used function
     */
    customArguments = [];
    /**
     * Any additional data that the Trigger config will want to save
     */
    data = {};
    constructor(_step, _context) {
        super();
        this.id = _step.id;
        this.parent = null;
        this.protocol = _step.protocol
            ? _context.getProtocol(_step.protocol)
            : null;
        this.inflows = _step.inflows.map((dbtoken) => {
            return new YCToken(dbtoken, _context);
        });
        this.outflows = _step.outflows.map((dbbtoken) => {
            return new YCToken(dbbtoken, _context);
        });
        this.children = _step.children.map((child) => {
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
        this.tokenPercentages = new Map(typeof _step.tokenPercentages == "object" ? [] : _step.tokenPercentages);
    }
    /**
     * Convert the step into a JSON step
     */
    toJSON = () => {
        return {
            id: this.id,
            parentId: this.parent,
            action: this.action?.id || "",
            protocol: this.protocol?.id || "",
            inflows: this.inflows.map((token) => token.toJSON()),
            outflows: this.outflows.map((token) => token.toJSON()),
            function: this.function?.toJSON(),
            customArguments: this.customArguments,
            children: this.children.map((child) => child.toJSON()),
            data: this.data,
            tokenPercentages: Array.from(this.tokenPercentages.entries()),
            type: this.type,
        };
    };
}
export { YCStep };
//# sourceMappingURL=step.js.map