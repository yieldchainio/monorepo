/**
 * @notice
 * Yieldchain's Database Models / Interfaces
 */
import { address, ChainID } from "./global";
import { BaseVariableTypes, CallTypes } from "./yc";
export interface DBAction {
    action_identifier: number;
    name: string;
    popularity: number;
    hidden: boolean;
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
export interface DBNetwork {
    chain_id: number;
    name: string;
    logo: string;
    json_rpc: string | null;
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
    twitter?: string;
    telegram?: string;
    discord?: string;
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
    profile_picture: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    whitelisted: boolean;
    verified: boolean;
}
