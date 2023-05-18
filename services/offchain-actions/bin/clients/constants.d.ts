/**
 * Constants for the offchain clients
 */
import { FunctionCallStruct, YcCommand } from "@yc/yc-models";
export declare const OffchainActions: Record<string, (requestedCommand: FunctionCallStruct) => Promise<YcCommand>>;
