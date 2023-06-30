/**
 * Main Offchain Action Handler, Routes To Client Actions
 * @param strategyAddress - The address of the requesting strategy
 * @param actionCommand - The FunctionCall struct that was emitted in the RequestFulfill event (decoded)
 * @param provider - The provider this action is on
 * @return ycCommand | null - Either the computed YC command that the client action returned, or null if none/an error
 * was caught
 */
import { OffchainActions } from "../clients/constants.js";
export async function execOffchainAction(action, provider) {
    const requestedAction = OffchainActions[action.signature];
    if (!requestedAction) {
        console.error("Could Not Get Action Fulfilled - Requested Action Is Not Classified. Action:" +
            action.signature);
        return null;
    }
    try {
        return await requestedAction(action, provider);
    }
    catch (e) {
        console.error("Caught Error Whilst Executing Offchain Action:", action.signature, "Error:", e);
        return null;
    }
}
//# sourceMappingURL=exec-offchain-action.js.map