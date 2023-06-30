/**
 * Types for the offchain actions service
 */
import {
  HYDRATE_RUN_ONCHAIN_EVENT_HASH,
  SQSOnchainLog,
  bytes,
} from "@yc/yc-models";

import { YcCommand, address } from "@yc/yc-models";
import { Log, EventLog } from "ethers";

enum ExecutionTypes {
  SEED,
  TREE,
  UPROOT,
}

export interface OperationItem {
  action: ExecutionTypes;
  initiator: address;
  gas: bigint;
  arguments: YcCommand[];
  commandCalldatas: YcCommand[];
  executed: boolean;
}

type requestFullfillEventHash =
  "19d5ac81a19d99da1743c582714888c08391772346b4b0186542ffe3f2565710";
type stepIndexRawTopic = bytes;
type requestedActionRawTopic = bytes;

export type stepIndexTopic = bigint;
export type requestedActionTopic = YcCommand;

export type RequestFullfillEvent = EventLog & {
  topics: [
    requestFullfillEventHash,
    stepIndexRawTopic,
    requestedActionRawTopic
  ];
};

type hydrateRunEventHash =
  "0xf764a734f09c7d398fa52cbd72bf4b4d5223679ab9626437eb9013799c0842f8";
type operationIndexRawTopic = bytes;
export type HydrationRequestEvent = Log & {
  topics: [hydrateRunEventHash, operationIndexRawTopic];
};

export type operationIndexTopic = bigint;

export type SQSHydrationRequestEvent = SQSOnchainLog & {
  log: HydrationRequestEvent;
};

export interface OffchainRequest {
  initiator: address;
  chainId: number;
  stepIndex: number;
  cachedOffchainCommands: YcCommand[];
  callTargetAddress: address;
  signature: string;
  args: bytes;
}

export interface ValidCCIPRes {
  data: YcCommand;
  status: 200;
}

export interface InvalidCCIPRes {
  message: string;
  status: 404;
}

export type CCIPRes = ValidCCIPRes | InvalidCCIPRes;
