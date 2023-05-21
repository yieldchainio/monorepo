/**
 * Constants for the offchain clients
 */
import { FunctionCallStruct, YcCommand, address } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
export declare const OffchainActions: Record<string, (requestedCommand: FunctionCallStruct, strategyAddress: address, provider: JsonRpcProvider) => Promise<YcCommand>>;
