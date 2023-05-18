/**
 * Main Offchain Action Handler, Routes To Client Actions
 * @param actionCommand - The FunctionCall struct that was emitted in the RequestFulfill event (decoded)
 * @param provider - The provider this action is on
 * @return ycCommand | null - Either the computed YC command that the client action returned, or null if none/an error
 * was caught
 */

import { FunctionCallStruct, YcCommand } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
import { OffchainActions } from "../../../clients/constants.js";

export async function executeAction(
  actionCommand: FunctionCallStruct,
  provider: JsonRpcProvider
): Promise<YcCommand | null> {
  const requestedAction = OffchainActions[actionCommand.signature];
  if (!requestedAction) {
    console.error(
      "Could Not Get Action Fulfilled - Requested Action Is Not Classified"
    );
    return null;
  }

  try {
    return await requestedAction(actionCommand);
  } catch (e: any) {
    console.error(
      "Caught Error Whilst Executing Offchain Action:",
      actionCommand.signature,
      "Error:",
      e
    );
    return null;
  }
}
