/**
 * A class representing a fullfill request
 * @param fullfillRequestEvent - An onchain RequestFulfill event
 */
import { YCFunc } from "@yc/yc-models";
import { executeAction } from "../utils/exec-offchain-action.js";
import { AbiCoder, ZeroAddress } from "ethers";
export class FulfillRequest {
    #event;
    #forkProvider;
    constructor(fulfillRequestEvent, fork) {
        this.#event = fulfillRequestEvent;
        this.#forkProvider = fork;
    }
    async fulfill() {
        const requestedFunctionCall = AbiCoder.defaultAbiCoder().decode([YCFunc.FunctionCallTuple], this.#event.topics[2])[0];
        if (!requestedFunctionCall ||
            requestedFunctionCall.target_address == ZeroAddress) {
            console.error("Error Fulfilling Action Request - Decoded Function Call From Event Is Incorrect. Requested:", requestedFunctionCall);
            return null;
        }
        return await executeAction(requestedFunctionCall, this.#forkProvider);
    }
    get stepIndex() {
        return AbiCoder.defaultAbiCoder().decode(["uint256"], this.#event.topics[1])[0];
    }
}
//# sourceMappingURL=fulfill-request.js.map