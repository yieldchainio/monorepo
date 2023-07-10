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
export declare const NULLISH_COMMAND = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
/**
 * Map typeflag enum from prisma to actual byte flags as strings
 */
export declare const TypeflagValues: Record<Typeflags, typeflag>;
export declare const HYDRATE_RUN_ONCHAIN_EVENT_SIGNATURE = "HydrateRun(uint256)";
export declare const HYDRATE_RUN_ONCHAIN_EVENT_HASH = "0xf764a734f09c7d398fa52cbd72bf4b4d5223679ab9626437eb9013799c0842f8";
export declare const REQUEST_FULLFILL_ONCHAIN_EVENT_SIGNATURE = "RequestFullfill(uint256,bytes)";
export declare const REQUEST_FULLFILL_ONCHAIN_EVENT_HASH = "0x19d5ac81a19d99da1743c582714888c08391772346b4b0186542ffe3f2565710";
/**
 * Constants for SQS
 */
export declare const ONCHAIN_LOGS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/010073361729/onchain-logs.fifo";
export declare const OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/010073361729/offchain-execution-requests.fifo";
