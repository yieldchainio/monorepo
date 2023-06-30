/**
 * Constants for the offchain clients
 */
import { YcCommand } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
import { OffchainRequest } from "../types.js";
export declare const OffchainActions: Record<string, (requestedAction: OffchainRequest, provider: JsonRpcProvider) => Promise<YcCommand>>;
