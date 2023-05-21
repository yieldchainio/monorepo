/**
 * Decode a full encoded FunctionCallStruct
 * @param encodedYcCommand - The encoded YC Command to decode from (with 0x prefix!)
 * @return callStruct - The FunctionCall struct
 */
import { YCFunc } from "@yc/yc-models";
import { AbiCoder } from "ethers";
export function decodeFunctionCallStruct(ycCommand, includesTypeflags = false) {
    const naked = "0x" + ycCommand.slice(2 + (includesTypeflags ? 4 : 0), ycCommand.length);
    return AbiCoder.defaultAbiCoder().decode([YCFunc.FunctionCallTuple], naked)[0];
}
//# sourceMappingURL=decode-function-call-struct.js.map