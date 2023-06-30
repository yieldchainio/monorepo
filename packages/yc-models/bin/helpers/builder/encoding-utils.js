import { AbiCoder, ethers } from "ethers";
import { Typeflags } from "@prisma/client";
import { TypeflagValues, remove0xPrefix } from "../../index.js";
export function encodeFixedYCCommand(arg, type) {
    return ("0x" +
        TypeflagValues[Typeflags.VALUE_VAR_FLAG] +
        TypeflagValues[Typeflags.VALUE_VAR_FLAG] +
        remove0xPrefix(ethers.AbiCoder.defaultAbiCoder().encode([type], [arg])));
}
export function encodeRefYCCommand(arg, type) {
    return ("0x" +
        TypeflagValues[Typeflags.REF_VAR_FLAG] +
        TypeflagValues[Typeflags.REF_VAR_FLAG] +
        remove0xPrefix(ethers.AbiCoder.defaultAbiCoder().encode([type], [arg])));
}
export function abiDecodeYCCommand(arg, type) {
    const naked = "0x" + arg.slice(6, arg.length);
    return AbiCoder.defaultAbiCoder().decode([type], naked)[0];
}
export function abiDecode(arg, type) {
    return AbiCoder.defaultAbiCoder().decode([type], arg)[0];
}
export function abiDecodeBatch(args, types) {
    return AbiCoder.defaultAbiCoder().decode(types, args);
}
export async function interpretYCCommand(arg, type, contract) {
    // runViewFunction() uses runFunction() under the hood, so the reuslt is double ABI encoded,
    // We slice the first 2 pointers
    const res = await contract.runViewFunction(arg);
    const sliced = "0x" + res.slice(130, res.length);
    return AbiCoder.defaultAbiCoder().decode([type], sliced)[0];
}
//# sourceMappingURL=encoding-utils.js.map