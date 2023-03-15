/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
// Imports
import {
  DBAddress,
  DBAction,
  DBFunction,
  DBFlow,
  DBToken,
  DBArgument,
  DBStrategy,
  DBProtocol,
  DBNetwork,
  DBUser,
} from "./db";
export interface ClassificationContext {
  addresses: DBAddress[];
  funcs: DBFunction[];
  tokens: DBToken[];
  parameters: DBArgument[]; // TODO: Change name to arguments
  flows: DBFlow[];
  protocols: DBProtocol[];
  strategies: DBStrategy[];
  actions: DBAction[];
  networks: DBNetwork[];
  users: DBUser[];
}

// A step inputted from the frontend

export interface IFunction {
  target_address: string;
  signature: string;
  is_callback: boolean;
  type: CallTypes;
}

// Enum Types For Available Function Call Types
export enum CallTypes {
  STATICCALL = 2,
  DELEGATECALL = 3,
  CALL = 4,
}

export interface FunctionCall {
  target_address: string;
  args: string[];
  signature: string;
  is_callback: boolean;
}

export enum BaseVariableTypes {
  ARRAY,
  REGULER,
  STRUCT,
}
