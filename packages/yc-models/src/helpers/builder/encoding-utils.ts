import { AbiCoder, Contract, ethers } from "ethers";
import { Typeflags } from "@prisma/client";
import { TypeflagValues, address, bytes, remove0xPrefix } from "../../index.js";
import { doesNotMatch } from "assert";

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

export function abiDecodeYCCommand<T>(arg: bytes, type: string): T {
  const naked = "0x" + arg.slice(6, arg.length);
  return AbiCoder.defaultAbiCoder().decode([type], naked)[0];
}

export async function interpretYCCommand<T>(
  arg: bytes,
  type: string,
  contract: Contract
): Promise<T> {
  // runViewFunction() uses runFunction() under the hood, so the reuslt is double ABI encoded,
  // We slice the first 2 pointers
  const res: bytes = await contract.runViewFunction(arg);
  const sliced = "0x" + res.slice(130, res.length);

  console.log("Result From View Func", sliced);
  return AbiCoder.defaultAbiCoder().decode([type], sliced)[0] as T;
}
