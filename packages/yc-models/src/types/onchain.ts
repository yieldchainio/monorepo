/**
 * Onchain YC types
 */

import { address, bytes } from "./global.js";

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
}

export interface VaultFactoryInputs {
  seedSteps: bytes[];
  treeSteps: bytes[];
  uprootSteps: bytes[];
  approvalPairs: address[][];
  depositToken: address;
  isPublic: boolean;
}

export const VAULT_CREATED_EVENT_SIGNATURE = "VaultCreated(address,address,address)"


export interface VaultCreatedEvent {
  strategyAddress: address,

}