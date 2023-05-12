/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
// Imports
import {
  DBContract,
  DBAction,
  DBFunction,
  DBToken,
  DBArgument,
  DBStrategy,
  DBProtocol,
  DBNetwork,
  DBUser,
  DBStatistic,
} from "./db.js";
export interface ClassificationContext {
  addresses: DBContract[];
  funcs: DBFunction[];
  tokens: DBToken[];
  parameters: DBArgument[]; // TODO: Change name to arguments
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

export enum StepType {
  STEP = "step",
  TRIGGER = "trigger",
  CONDITION = "condition",
}
