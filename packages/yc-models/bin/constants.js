import { Typeflags } from "@prisma/client";
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
export const NULLISH_COMMAND = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
/**
 * Map typeflag enum from prisma to actual byte flags as strings
 */
export const TypeflagValues = {
    [Typeflags.VALUE_VAR_FLAG]: "00",
    [Typeflags.REF_VAR_FLAG]: "01",
    [Typeflags.COMMANDS_LIST_FLAG]: "02",
    [Typeflags.COMMANDS_REF_ARR_FLAG]: "03",
    [Typeflags.RAW_REF_VAR_FLAG]: "04",
    [Typeflags.STATICCALL_COMMAND_FLAG]: "05",
    [Typeflags.CALL_COMMAND_FLAG]: "06",
    [Typeflags.DELEGATECALL_COMMAND_FLAG]: "07",
    [Typeflags.INTERNAL_LOAD_FLAG]: "08",
};
// The hash of the HydrateRun event
export const HYDRATE_RUN_ONCHAIN_EVENT_SIGNATURE = "HydrateRun(uint256)";
export const HYDRATE_RUN_ONCHAIN_EVENT_HASH = "0xf764a734f09c7d398fa52cbd72bf4b4d5223679ab9626437eb9013799c0842f8";
export const REQUEST_FULLFILL_ONCHAIN_EVENT_SIGNATURE = "RequestFullfill(uint256,bytes)";
export const REQUEST_FULLFILL_ONCHAIN_EVENT_HASH = "0x19d5ac81a19d99da1743c582714888c08391772346b4b0186542ffe3f2565710";
/**
 * Constants for SQS
 */
export const ONCHAIN_LOGS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/010073361729/onchain-logs.fifo";
export const OFFCHAIN_EXECUTION_REQUESTS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/010073361729/offchain-execution-requests.fifo";
//# sourceMappingURL=constants.js.map