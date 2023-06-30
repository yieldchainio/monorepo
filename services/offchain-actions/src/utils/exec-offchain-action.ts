/**
 * Main Offchain Action Handler, Routes To Client Actions
 * @param strategyAddress - The address of the requesting strategy
 * @param actionCommand - The FunctionCall struct that was emitted in the RequestFulfill event (decoded)
 * @param provider - The provider this action is on
 * @return ycCommand | null - Either the computed YC command that the client action returned, or null if none/an error
 * was caught
 */

import { YcCommand } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
import { OffchainActions } from "../clients/constants.js";
import { OffchainRequest } from "../types.js";

export async function execOffchainAction(
  action: OffchainRequest,
  provider: JsonRpcProvider
): Promise<YcCommand | null> {
  const requestedAction = OffchainActions[action.signature];
  if (!requestedAction) {
    console.error(
      "Could Not Get Action Fulfilled - Requested Action Is Not Classified. Action:" +
        action.signature
    );
    return null;
  }

  try {
    return await requestedAction(action, provider);
  } catch (e: any) {
    console.error(
      "Caught Error Whilst Executing Offchain Action:",
      action.signature,
      "Error:",
      e
    );
    return null;
  }
}
