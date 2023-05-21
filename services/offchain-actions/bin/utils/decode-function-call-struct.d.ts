/**
 * Decode a full encoded FunctionCallStruct
 * @param encodedYcCommand - The encoded YC Command to decode from (with 0x prefix!)
 * @return callStruct - The FunctionCall struct
 */
import { FunctionCallStruct, YcCommand } from "@yc/yc-models";
export declare function decodeFunctionCallStruct(ycCommand: YcCommand, includesTypeflags?: boolean): FunctionCallStruct;
