import { Typeflags } from "@prisma/client";
import { typeflag } from "./types/index.js";
/**
 * Constants
 */
export declare const VALUE_VAR_FLAG = 0;
export declare const REF_VAR_FLAG = 1;
export declare const COMMANDS_LIST_FLAG = 2;
export declare const COMMANDS_REF_ARR_FLAG = 3;
export declare const RAW_REF_VAR_FLAG = 4;
export declare const STATICCALL_COMMAND_FLAG = 5;
export declare const CALL_COMMAND_FLAG = 6;
export declare const DELEGATECALL_COMMAND_FLAG = 7;
export declare const INTERNAL_LOAD_FLAG = 8;
/**
 * Map typeflag enum from prisma to actual byte flags as strings
 */
export declare const TypeflagValues: Record<Typeflags, typeflag>;
