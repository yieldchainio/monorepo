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
export declare enum TriggerTypes {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    AUTOMATION = "automation"
}
export interface Trigger {
    triggerType: TriggerTypes;
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
export declare const VAULT_CREATED_EVENT_SIGNATURE = "VaultCreated(address,address,address)";
export interface VaultCreatedEvent {
    strategyAddress: address;
}
