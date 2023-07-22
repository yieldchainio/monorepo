import { IFullFunction } from "./App";

export interface DropdownOptions<T> {
  label: string;
  image?: string;
  data?: T;
}

/**
 * @DB Types
 */
export interface DBFunction {
  function_identifier: number;
  function_name: string;
  number_of_parameters: number;
  flows: number[];
  arguments: number[];
  is_callback: boolean;
  counter_function_identifier?: number | null;
  unlocked_by?: number | null;
  index?: number | null;
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
  address: string;
  symbol: string;
  logo: string;
  decimals: number;
  coinkey: string;
  priceusd: number;
  chain_id: number;
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

export interface DBContract {
  address_identifier: number;
  contract_address: string;
  abi: JSON;
  functions: number[];
}

export interface JSONStrategy {
  strategy_identifier: number;
  address: string;
  name: string;
  upkeep_id: number;
  apy: number;
  tvl: number;
  main_protocol_identifier: number;
  creator_user_identifier: number;
  chain_id: number;
  main_token_identifier: number;
  final_token_identifier: number;
  is_verified: boolean;
  is_trending: boolean;
  execution_interval: number;
  strategy_object: JSON;
}

export interface DBNetwork {
  chain_id: number;
  name: string;
  logo: string;
  json_rpc: string | null;
  block_explorer: string | null;
  automation_address: string | null;
  block_explorer_api_key: string | null;
}

export interface DBAction {
  action_identifier: number;
  name: string;
  single_function: boolean;
  popularity: number;
  hidden: boolean;
}

export interface TransposeTxn {
  transaction_hash: string;
  timestamp: string;
  block_number: number;
  base_fee_per_gas: number;
  max_priority_fee_per_gas: number;
  max_fee_per_gas: number;
  gas_limit: number;
  gas_used: number;
  gas_price: number;
  transaction_fee: number;
  fees_burned: number;
  fees_rewarded: number;
  fees_saved: number;
  nonce: number;
  position: number;
  type: number;
  from_address: string;
  to_address: string;
  value: number;
  contract_address: string;
  internal_transaction_count: number;
  log_count: number;
  input: string;
  output: string;
  __confirmed: boolean;
}

export interface TransposeTxnWithLogs extends TransposeTxn {
  log_index: number | null;
  address: string | null;
  topic_0: string | null;
  topic_1: string | null;
  topic_2: string | null;
  topic_3: string | null;
  data: string;
  transaction_position: number;
  txns_type: "transpose" | "covalent";
}

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export type IntegrateAbleFunction = WithRequiredProperty<
  IFullFunction,
  "actionId"
>;
