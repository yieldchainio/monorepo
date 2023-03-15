export type functions = number[];
export type flows = number[];
export type address = string;
export type arguments = number[];
export interface DBFunction {
  function_identifier: number;
  function_name: string;
  number_of_parameters: number;
  flows: flows;
  arguments: arguments;
  is_callback: boolean;
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
  flow_identifier: number;
  token_identifier: number;
  outflow0_or_inflow1: number;
}

export interface DBToken {
  token_identifier: number;
  name: string;
  address: address;
  symbol: string;
  logo: string;
  decimals: number;
  coinkey: string;
  priceusd: number;
  chain_id: ChainID;
  markets: number[];
}

export interface DBProtocol {
  protocol_identifier: number;
  name: string;
  website: string;
  logo: string;
  is_verified: boolean;
  avg_apy: number;
  aggregated_tvl: number;
  yc_vaults_num: number;
  color: string;
  hidden: boolean;
}

export interface DBAddress {
  address_identifier: number;
  contract_address: address;
  abi: JSON;
  functions: number[];
}

export interface DBStrategy {
  strategy_identifier: number;
  address: address;
  name: string;
  upkeep_id: number;
  apy: number;
  tvl: number;
  main_protocol_identifier: number;
  creator_user_identifier: number;
  chain_id: ChainID;
  main_token_identifier: number;
  final_token_identifier: number;
  is_verified: boolean;
  is_trending: boolean;
  execution_interval: number;
  strategy_object: JSON;
}

export enum ChainID {
  Ethereum = 1,
  BinanceSmartChain = 56,
  Polygon = 137,
  Fantom = 250,
  Avalanche = 43114,
  Arbitrum = 42161,
}

export interface DBNetwork {
  chain_id: ChainID;
  name: string;
  logo: string;
  json_rpc: string;
  automation_address: address;
}

export interface DBUser {
  user_identifier: number;
  address: address;
  name?: string | null;
  profile_picture?: string | null;
  description?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  deployed_vaults: number;
}

export interface DBAction {
  action_identifier: number;
  name: string;
  single_function: boolean;
  popularity: number;
  hidden: boolean;
}
