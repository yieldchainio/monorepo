/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
import { DBAddress, DBAction, DBFunction, DBFlow, DBToken, DBArgument, DBStrategy, DBProtocol, DBNetwork, DBUser } from "./db";
export interface ClassificationContext {
    addresses: DBAddress[];
    functions: DBFunction[];
    tokens: DBToken[];
    parameters: DBArgument[];
    flows: DBFlow[];
    protocols: DBProtocol[];
    strategies: DBStrategy[];
    actions: DBAction[];
    networks: DBNetwork[];
    users: DBUser[];
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
    args: string[];
    signature: string;
    is_callback: boolean;
}
export declare enum BaseVariableTypes {
    ARRAY = 0,
    REGULER = 1,
    STRUCT = 2
}
