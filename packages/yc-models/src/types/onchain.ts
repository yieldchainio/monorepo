/**
 * Onchain YC types
 */

import { YcCommand, address, bytes, bytes4 } from "./global.js";

export interface FunctionCallStruct {
  target_address: string;
  args: bytes[];
  signature: string;
}

export interface YCStepStruct {
  func: bytes;
  childrenIndices: number[];
  conditions: bytes[];
  isCallback: boolean;
  mvc: YcCommand | bytes
}

export enum TriggerTypes {
  AUTOMATION = "Automation",
  DEPOSIT = "Deposit",
  WITHDRAWAL = "Withdrawal",
}

export interface Trigger {
  triggerType: bigint;
  extraData: bytes;
}

export interface RegisteredTrigger {
  triggerType: TriggerTypes;
  lastStrategyRun: bigint;
  requiredDelay: bigint;
}

export interface VaultFactoryInputs {
  seedSteps: bytes[];
  treeSteps: bytes[];
  uprootSteps: bytes[];
  approvalPairs: address[][];
  triggers: Trigger[];
  depositToken: address;
  isPublic: boolean;
}

export const VAULT_CREATED_EVENT_SIGNATURE =
  "VaultCreated(address,address,address,bytes)";

export interface VaultCreatedEvent {
  strategyAddress: address;
}

export interface LPClient {
  addSelector: bytes4;
  removeSelector: bytes4;
  harvestSelector: bytes4;
  balanceOfLpSelector: bytes4;
  clientAddress: address;
  extraData: bytes;
}

export const LPCLIENT_TUPLE =
  "tuple(bytes4 addSelector,bytes4 removeSelector,bytes4 harvestSelector,bytes4 balanceOfLpSelector,address clientAddress,bytes extraData)";
