import { Typeflags } from "@prisma/client";
import { typeflag } from "./types";
/**
 * Constants
 */
export const VALUE_VAR_FLAG = 0x00;
export const REF_VAR_FLAG = 0x01;
export const COMMANDS_LIST_FLAG = 0x02;
export const COMMANDS_REF_ARR_FLAG = 0x03;
export const RAW_REF_VAR_FLAG = 0x04;
export const STATICCALL_COMMAND_FLAG = 0x05;
export const CALL_COMMAND_FLAG = 0x06;
export const DELEGATECALL_COMMAND_FLAG = 0x07;
export const INTERNAL_LOAD_FLAG = 0x08;

/**
 * Map typeflag enum from prisma to actual byte flags as strings
 */
export const TypeflagValues: Record<Typeflags, typeflag> = {
  [Typeflags.VALUE_VAR_FLAG]: "00" as typeflag,
  [Typeflags.REF_VAR_FLAG]: "01" as typeflag,
  [Typeflags.COMMANDS_LIST_FLAG]: "02" as typeflag,
  [Typeflags.COMMANDS_REF_ARR_FLAG]: "03" as typeflag,
  [Typeflags.RAW_REF_VAR_FLAG]: "04" as typeflag,
  [Typeflags.STATICCALL_COMMAND_FLAG]: "05" as typeflag,
  [Typeflags.CALL_COMMAND_FLAG]: "06" as typeflag,
  [Typeflags.DELEGATECALL_COMMAND_FLAG]: "07" as typeflag,
  [Typeflags.INTERNAL_LOAD_FLAG]: "08" as typeflag,
};

