/**
 * Decode a full encoded FunctionCallStruct
 * @param encodedYcCommand - The encoded YC Command to decode from (with 0x prefix!)
 * @return callStruct - The FunctionCall struct
 */
import { YCFunc } from "@yc/yc-models";
import { AbiCoder } from "ethers";
export function decodeFunctionCallStruct(ycCommand) {
    const naked = "0x" + ycCommand.slice(6, ycCommand.length);
    return AbiCoder.defaultAbiCoder().decode([YCFunc.FunctionCallTuple], naked)[0];
}
//# sourceMappingURL=decode-function-call-struct.js.map