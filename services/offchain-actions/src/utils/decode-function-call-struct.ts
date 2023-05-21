/**
 * Decode a full encoded FunctionCallStruct
 * @param encodedYcCommand - The encoded YC Command to decode from (with 0x prefix!)
 * @return callStruct - The FunctionCall struct
 */

import { FunctionCallStruct, YCFunc, YcCommand } from "@yc/yc-models";
import { AbiCoder } from "ethers";

export function decodeFunctionCallStruct(
  ycCommand: YcCommand
): FunctionCallStruct {
  const naked = "0x" + ycCommand.slice(6, ycCommand.length);

  return AbiCoder.defaultAbiCoder().decode(
    [YCFunc.FunctionCallTuple],
    naked
  )[0];
}
