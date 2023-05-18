import { ethers } from "ethers";
import { Typeflags } from "@prisma/client";
import { TypeflagValues, address, bytes, remove0xPrefix } from "../../index.js";

export function encodeFixedYCCommand(
  arg: boolean | bigint | address,
  type: string
) {
  return (
    "0x" +
    TypeflagValues[Typeflags.VALUE_VAR_FLAG] +
    TypeflagValues[Typeflags.VALUE_VAR_FLAG] +
    remove0xPrefix(ethers.AbiCoder.defaultAbiCoder().encode([type], [arg]))
  );
}

export function encodeRefYCCommand<T = string>(arg: T | bytes, type: string) {
  return (
    "0x" +
    TypeflagValues[Typeflags.REF_VAR_FLAG] +
    TypeflagValues[Typeflags.REF_VAR_FLAG] +
    remove0xPrefix(ethers.AbiCoder.defaultAbiCoder().encode([type], [arg]))
  );
}
