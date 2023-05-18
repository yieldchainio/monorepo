import { ethers } from "ethers";
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
//# sourceMappingURL=encoding-utils.js.map