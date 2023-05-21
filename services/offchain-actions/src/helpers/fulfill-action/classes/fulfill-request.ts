/**
 * A class representing a fullfill request
 * @param fullfillRequestEvent - An onchain RequestFulfill event
 */

import { FunctionCallStruct, YCFunc, YcCommand, address } from "@yc/yc-models";
import { RequestFullfillEvent } from "../../../types.js";
import { executeAction } from "../utils/exec-offchain-action.js";
import { AbiCoder, JsonRpcProvider, ZeroAddress } from "ethers";
import { decodeFunctionCallStruct } from "../../../utils/decode-function-call-struct.js";

export class FulfillRequest {
  #event: RequestFullfillEvent;
  #forkProvider: JsonRpcProvider;

  constructor(
    fulfillRequestEvent: RequestFullfillEvent,
    fork: JsonRpcProvider
  ) {
    this.#event = fulfillRequestEvent;
    this.#forkProvider = fork;
  }

  async fulfill(): Promise<YcCommand | null> {
    const requestedFunctionCall: FunctionCallStruct = decodeFunctionCallStruct(
      this.#event.args[1]
    );

    if (
      !requestedFunctionCall ||
      requestedFunctionCall.target_address == ZeroAddress
    ) {
      console.error(
        "Error Fulfilling Action Request - Decoded Function Call From Event Is Incorrect. Requested:",
        requestedFunctionCall
      );
      return null;
    }

    return await executeAction(
      requestedFunctionCall,
      this.#event.address as address,
      this.#forkProvider
    );
  }

  get stepIndex(): bigint | null {
    return this.#event.args[0];
  }
}
