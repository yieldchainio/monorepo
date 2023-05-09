/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
// Imports
import {
  DBContract,
  DBAction,
  DBFunction,
  DBFlow,
  DBToken,
  DBArgument,
  DBStrategy,
  DBProtocol,
  DBNetwork,
  DBUser,
  DBStatistic,
} from "./db";
export interface ClassificationContext {
  addresses: DBContract[];
  funcs: DBFunction[];
  tokens: DBToken[];
  parameters: DBArgument[]; // TODO: Change name to arguments
  flows: DBFlow[];
  protocols: DBProtocol[];
  strategies: DBStrategy[];
  actions: DBAction[];
  networks: DBNetwork[];
  users: DBUser[];
  statistics: DBStatistic[];
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
}

type HexNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type HexLetter = "A" | "B" | "C" | "D" | "E" | "F";
type HexChar = HexLetter | HexNumber;

// How a single typeflag looks like
export type typeflag = `${HexChar}${HexChar}`;
export type typeflags = `${typeflag}${typeflag}`;

/**
 * Type of context when encoding
 */

export enum EncodingContext {
  SEED,
  TREE,
  UPROOT,
}
