/**
 * Constants for the offchain clients
 */
import { FunctionCallStruct, YcCommand } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
export declare const OffchainActions: Record<string, (requestedCommand: FunctionCallStruct, provider: JsonRpcProvider) => Promise<YcCommand>>;
