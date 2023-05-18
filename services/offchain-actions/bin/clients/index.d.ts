/**
 * Main Handler, Routes To Client Actions
 * @param actionRequest - The RequestFullfill log received from the vault contract
 * @param provider - The provider this action is on
 * @return ycCommand | null - Either the computed YC command that the client action returned, or null if none/an error
 * was caught
 */
import { YcCommand } from "@yc/yc-models";
import { RequestFullfillEvent } from "../types.js";
import { JsonRpcProvider } from "ethers";
export declare function executeAction(actionRequest: RequestFullfillEvent, provider: JsonRpcProvider): Promise<YcCommand | null>;
