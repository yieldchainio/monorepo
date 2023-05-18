/**
 * A class representing a fullfill request
 * @param fullfillRequestEvent - An onchain RequestFulfill event
 */

import { FunctionCallStruct, YCFunc, YcCommand } from "@yc/yc-models";
import { RequestFullfillEvent } from "../../../types.js";
import { executeAction } from "../utils/exec-offchain-action.js";
import { AbiCoder, JsonRpcProvider, ZeroAddress } from "ethers";

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
    const requestedFunctionCall: FunctionCallStruct =
      AbiCoder.defaultAbiCoder().decode(
        [YCFunc.FunctionCallTuple],
        this.#event.topics[2]
      )[0];

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

    return await executeAction(requestedFunctionCall, this.#forkProvider);
  }

  get stepIndex(): number | null {
    return AbiCoder.defaultAbiCoder().decode(
      ["uint256"],
      this.#event.topics[1]
    )[0];
  }
}
