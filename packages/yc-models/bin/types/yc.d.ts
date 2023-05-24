/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
import { DBContract, DBAction, DBFunction, DBToken, DBArgument, DBStrategy, DBProtocol, DBNetwork, DBUser, DBStatistic } from "./db.js";
export interface ClassificationContext {
    addresses: DBContract[];
    funcs: DBFunction[];
    tokens: DBToken[];
    parameters: DBArgument[];
    protocols: DBProtocol[];
    strategies: DBStrategy[];
    actions: DBAction[];
    networks: DBNetwork[];
    users: DBUser[];
    statistics: DBStatistic[];
}
export interface IFunction {
    target_address: string;
    signature: string;
    is_callback: boolean;
    type: CallTypes;
}
export declare enum CallTypes {
    STATICCALL = 2,
    DELEGATECALL = 3,
    CALL = 4
}
type HexNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type HexLetter = "A" | "B" | "C" | "D" | "E" | "F";
type HexChar = HexLetter | HexNumber;
export type typeflag = `${HexChar}${HexChar}`;
export type typeflags = `${typeflag}${typeflag}`;
/**
 * Type of context when encoding
 */
export declare enum EncodingContext {
    SEED = "seed",
    TREE = "tree",
    UPROOT = "uproot"
}
export type TokenPercentage = {
    percentage: number;
    dirty: boolean;
};
export interface CustomArgsTree {
    value: any;
    preConfigured: boolean;
    customArgs: CustomArgsTree[];
}
/**
 * A JSON step that the builder accepts, and the frontend should extend
 */
export interface DeployableStep {
    id: string;
    inflows: string[];
    outflows: string[];
    children: DeployableStep[];
    parent?: DeployableStep | null;
    tokenPercentages?: Array<[string, TokenPercentage]>;
    function?: DBFunction;
    customArguments?: Array<string | null>;
    data?: any | null;
}
export declare enum StepType {
    STEP = "step",
    TRIGGER = "trigger",
    CONDITION = "condition"
}
export type StepData = {
    automation?: AutomationData;
    lp?: AddLiquidityData;
    harvest?: HarvestData;
    stake?: StakeData;
    swap?: SwapData;
    trigger?: any;
};
export declare enum Timestamps {
    Minutes = "Minutes",
    Hours = "Hours",
    Days = "Days",
    Weeks = "Weeks",
    Months = "Months",
    Years = "Years"
}
export interface StakeData {
    protocol: DBProtocol;
    func: DBFunction | null;
}
export type SwapData = {
    fromToken: DBToken | null;
    toToken: DBToken | null;
};
export type HarvestData = {
    func?: DBFunction;
    externallyUnlocked?: boolean;
};
export interface AddLiquidityData {
    tokenA?: DBToken;
    tokenB?: DBToken;
    protocol: DBProtocol;
}
export type AutomationData = {
    input?: number;
    timestamp?: Timestamps;
    interval?: number;
};
export {};
