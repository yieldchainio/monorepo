/**
 * A class representing a fullfill request
 * @param fullfillRequestEvent - An onchain RequestFulfill event
 */
import { executeAction } from "../utils/exec-offchain-action.js";
import { ZeroAddress } from "ethers";
import { decodeFunctionCallStruct } from "../../../utils/decode-function-call-struct.js";
export class FulfillRequest {
    #event;
    #forkProvider;
    constructor(fulfillRequestEvent, fork) {
        this.#event = fulfillRequestEvent;
        this.#forkProvider = fork;
    }
    async fulfill() {
        const requestedFunctionCall = decodeFunctionCallStruct(this.#event.args[1]);
        if (!requestedFunctionCall ||
            requestedFunctionCall.target_address == ZeroAddress) {
            console.error("Error Fulfilling Action Request - Decoded Function Call From Event Is Incorrect. Requested:", requestedFunctionCall);
            return null;
        }
        return await executeAction(requestedFunctionCall, this.#event.address, this.#forkProvider);
    }
    get stepIndex() {
        return this.#event.args[0];
    }
}
//# sourceMappingURL=fulfill-request.js.map