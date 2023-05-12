import { DBContract, DBAction, DBFunction, DBToken, DBArgument, DBStrategy, DBProtocol, DBNetwork, DBUser, DBStatistic } from "./db";
import { bytes } from "./global";
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
export interface FunctionCall {
    target_address: string;
    args: bytes[];
    signature: string;
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
    SEED = 0,
    TREE = 1,
    UPROOT = 2
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
export {};
