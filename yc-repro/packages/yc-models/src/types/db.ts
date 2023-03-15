/**
 * @notice
 * Yieldchain's Database Models / Interfaces
 */
import { address, ChainID } from "./global";
import { BaseVariableTypes, CallTypes } from "./yc";
// A DB Model representing an action
export interface DBAction {
  action_identifier: number;
  name: string;
  popularity: number;
  hidden: boolean;
}

// A DB Model representing a strategy
export interface DBStrategy {
  id: string;
  address: address;
  title: string;
  chain_id: ChainID;
  deposit_token_id: string;
  creator_id: string;
  verified: boolean;
  execution_interval: number;
  steps: JSON[];
}

// A DB Model representing a network
export interface DBNetwork {
  id: number;
  name: string;
  logo: string;
  color: string | null;
  json_rpc: string;
  diamond_address: string | null;
  block_explorer: string | null;
}

export interface DBFunction {
  function_identifier: number;
  function_name: string;
  number_of_parameters: number;
  flows: number[];
  arguments: number[];
  is_callback: boolean;
  callType: CallTypes;
  return_type: string;
  return_base_type: BaseVariableTypes;
  counter_function_identifier?: number;
  unlocked_by?: number;
  index?: number;
}
export interface DBArgument {
  parameter_identifier: number;
  index: number;
  solidity_type: string;
  value: string;
  name: string;
}

export interface DBFlow {
  id: number;
  token_id: string;
  outflow0_or_inflow1: number;
}

export interface DBToken {
  id: string;
  name: string;
  address: address;
  symbol: string;
  logo: string;
  decimals: number;
  chain_id: ChainID;
}

export interface DBProtocol {
  id: string;
  name: string;
  website: string;
  logo: string;
  available: boolean;
  color: string | null;
  chain_ids: number[];
  address_ids: string[];
  twitter: string | null;
  telegram: string | null;
  discord: string | null;
}

export interface DBAddress {
  address_identifier: number;
  contract_address: address;
  chain_id: number;
  abi: JSON;
  functions: number[];
}

export interface DBUser {
  id: string;
  address: string;
  username: string;
  description: string;
  profile_picture: string | null;
  twitter: string | null;
  telegram: string | null;
  discord: string | null;
  whitelisted: boolean;
  verified: boolean;
}

export interface Step {}
