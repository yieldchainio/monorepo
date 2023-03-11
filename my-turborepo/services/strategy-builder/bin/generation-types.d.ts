/**
 * @DB Types
 */
export type functions = number[];
export type flows = number[];
export type arguments = number[];
export type address = string;
export declare enum ChainID {
    Ethereum = 1,
    BinanceSmartChain = 56,
    Polygon = 137,
    Fantom = 250,
    Avalanche = 43114,
    Arbitrum = 42161
}
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
import { Provider, Wallet, Contract, EventLog, Log, Transaction, TransactionReceipt, TransactionLike, TransactionResponse, Block, JsonRpcProvider, SigningKey, JsonFragment } from "ethers";
/************************************************* @Ethers ******************************************************/
export interface EthersProvider extends Provider {
}
export interface EthersInterface extends JsonFragment {
}
export declare class EthersExecutor extends Wallet {
    constructor(_key: string | SigningKey, provider?: null | EthersProvider);
    getTransactionHistory: (oldestBlock?: number) => Promise<Array<EthersTransactionResponse | null>>;
}
export interface EthersContract extends Contract {
}
export interface EthersEventLog extends EventLog {
}
export interface EthersTransaction extends Transaction {
}
export interface EthersReceipt extends TransactionReceipt {
}
export interface EthersPopulatedTransaction extends TransactionLike {
}
export interface EthersTransactionResponse extends TransactionResponse {
}
export interface EthersBlock extends Block {
}
export interface EthersLog extends Log {
}
export interface EthersJsonRpcProvider extends JsonRpcProvider {
}
/*******************************************************************************************************/
export type uint256 = number;
export type uint = number;
export type bytes = string;
export type bytes32 = string;
export type bytes4 = string;
export type bytes5 = string;
export type bytes6 = string;
export type ABI = JSON;
export interface IStrategy {
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
