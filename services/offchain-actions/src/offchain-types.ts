import { BytesLike } from "ethers";

export interface SimplifiedFunction {
  name: string;
  function_identifier: number;
  arguments: DBArgument[];
  is_callback: boolean;
  index: number;
}

export interface ExtendedReceipt extends Partial<EthersReceipt> {
  args: any[];
  function_name: string;
  contract_address: address;
}

export interface SendRawTransaction {
  (
    _provider: EthersJsonRpcProvider, // Ethers Provider Class
    _contractAddress: address, // A checksum address (e.g, 0x73112...94FaJK12)
    _func: SimplifiedFunction | string, // A Simplified function object, or a string (the function's name)
    _args: any[], // Arguments of any type to spread into the function call
    _executor: EthersExecutor, // Ethers Wallet Class
    _firstTry?: number,
    _optionalNonce?: number, // An optional nonce incase there are issues with nonce managemnt/some errors are caught
    _ignoreTxns?: GenericOrchestrator // An optional GenericOrchestrator to ignore transactions
  ): Promise<ExtendedReceipt | EthersReceipt | null>; // Returns an extended Ethers Provider Receipt
}

export interface CallbackTransaction {
  (
    _provider: EthersJsonRpcProvider, // Ethers Provider Class
    _contractAddress: address, // A checksum address (e.g, 0x73112...94FaJK12)
    _func: SimplifiedFunction, // A Simplified function object
    _args: any[], // Arguments of any type to spread into the function call
    _executor: EthersExecutor, // Ethers Wallet Class
    _ignoreTxns?: GenericOrchestrator // An optional GenericOrchestrator to ignore transactions
  ): Promise<ExtendedReceipt | EthersReceipt | null>; // Returns an extended Ethers Provider Receipt
}

export type BaseTokensList = { address: address }[];

export interface TransactionToExecute {
  contractAddress: address;
  func: SimplifiedFunction;
  args: any[];
  executor: EthersExecutor;
}

export interface TokenBalancesMapping extends Map<address, string> {}

export interface SharesCalculatedMapping extends Map<address, boolean> {}

export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiInput[];
  internalType?: string;
}

export type AbiType = "function" | "constructor" | "event" | "fallback";
export type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

export interface AbiOutput {
  name: string;
  type: string;
  components?: AbiOutput[];
  internalType?: string;
}

export type GenericAbi = {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: AbiInput[];
  name?: string;
  outputs?: AbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
}[];

export type ReproTransactionArguments = [string, any[]];

export type BinaryReproductionArgs = [
  EthersJsonRpcProvider,
  address,
  SimplifiedFunction,
  ReproTransactionArguments,
  EthersExecutor
];

export interface BinarySearchSimulationAttempt {
  amount: bigint;
  result: EthersReceipt | ExtendedReceipt | null | { logs: EthersLog[] };
  tokens: TokenBalancesMapping;
  success: boolean;
  reproductionArgs: BinaryReproductionArgs;
}

export interface ExtendedStepDetails {
  div: number;
  custom_arguments: BytesLike[];
  stepId: number;
}

export interface ExtendedArgument {
  parameter_identifier: number;
  value: any;
  solidity_type: string;
  name: string;
  index: number;
}

export interface ExtendedFunction {
  function_identifier: number;
  name: string;
  arguments: ExtendedArgument[] | number[];
  is_callback: boolean;
  index: number;
}

/**
 * @DB Types
 */
export type functions = number[];
export type flows = number[];
export type arguments = number[];
export type address = string;

export enum ChainID {
  Ethereum = 1,
  BinanceSmartChain = 56,
  Polygon = 137,
  Fantom = 250,
  Avalanche = 43114,
  Arbitrum = 42161,
}

export interface DBFunction {
  function_identifier: number;
  name: string;
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

// Global Types
import {
  Provider,
  Wallet,
  Contract,
  EventLog,
  Log,
  Transaction,
  TransactionReceipt,
  TransactionLike,
  TransactionResponse,
  Block,
  JsonRpcProvider,
  SigningKey,
  JsonFragment,
} from "ethers";
import GenericOrchestrator from "./sqs-class";

/************************************************* @Ethers ******************************************************/
export interface EthersProvider extends Provider {}
export interface EthersInterface extends JsonFragment {}
export class EthersExecutor extends Wallet {
  constructor(_key: string | SigningKey, provider?: null | EthersProvider) {
    super(_key, provider);
  }

  getTransactionHistory = async (
    oldestBlock?: number
  ): Promise<Array<EthersReceipt>> => {
    if (!this.provider) {
      throw new Error(
        "Provider not set In Ethers Executor, Cannot Retreive Transaction History"
      );
    }
    let provider = this.provider;
    let address = this.address;
    let transactionsArray: Array<EthersReceipt> = [];
    let currentBlockNumber = await this.provider.getBlockNumber();
    if (!oldestBlock) oldestBlock = currentBlockNumber - 10;
    let blockPromises: Array<Block | null> = [];
    for (let i = 0; i < currentBlockNumber - oldestBlock; i++) {
      blockPromises.push(await this.provider.getBlock(currentBlockNumber - i));
    }

    let blocks = await Promise.all(blockPromises);

    let txns: EthersReceipt[] = [];
    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      if (!block || !block.transactions) {
        continue;
      }
      let txnReceipts: Array<EthersReceipt | null> = await Promise.all(
        block.transactions.map((txn: string | EthersTransactionResponse) => {
          if (typeof txn == "string")
            return provider.getTransactionReceipt(txn);
          else return provider.getTransactionReceipt(txn.hash);
        })
      );

      for (let j = 0; j < txnReceipts.length; j++) {
        let txnReceipt = txnReceipts[j];
        if (!txnReceipt) continue;
        if (txnReceipt.from === address || txnReceipt.to === address) {
          txns.push(txnReceipt);
        }
      }
    }

    return txns;
  };
}
export interface EthersContract extends Contract {}
export interface EthersEventLog extends EventLog {}
export interface EthersTransaction extends Transaction {}
export interface EthersReceipt extends TransactionReceipt {}
export interface EthersPopulatedTransaction extends TransactionLike {}
export interface EthersTransactionResponse extends TransactionResponse {}
export interface EthersBlock extends Block {}
export interface EthersLog extends Log {}
export interface EthersJsonRpcProvider extends JsonRpcProvider {}
/*******************************************************************************************************/

// Custom Types
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

/**
 * EthersLog + JSON RPC URL
 */
export interface SQSOnchainLog extends EthersLog {
  json_rpc_url: string;
}

/**
 * Interface of the message structure from SQS
 */

export interface SQSMessage {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: string;
}
