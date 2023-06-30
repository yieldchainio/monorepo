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
import { OffchainRequest } from "../types.js";
export declare function execOffchainAction(action: OffchainRequest, provider: JsonRpcProvider): Promise<YcCommand | null>;
