/**
 * @notice
 * We make custom typing for ethers' types.
 * This is for two reasons:
 * 1) More explicit naming - Using these types, we know they belong to ethers
 * 2) Extending them - Extending the functionality of some of the types.
 */

// Importing reguler ethers types
import {
  Provider,
  SigningKey,
  Wallet,
  JsonFragment,
  Block,
  Contract,
  JsonRpcProvider,
  EventLog,
  TransactionReceipt,
  TransactionResponse,
  TransactionLike,
  Transaction,
  Log,
} from "ethers";

// Starting by re-exporting the types we do not *currently* extend with more functionality
export interface EthersProvider extends Provider {}
export interface EthersInterface extends JsonFragment {}
export interface EthersContract extends Contract {}
export interface EthersEventLog extends EventLog {}
export interface EthersTransaction extends Transaction {}
export interface EthersReceipt extends TransactionReceipt {}
export interface EthersPopulatedTransaction extends TransactionLike {}
export interface EthersTransactionResponse extends TransactionResponse {}
export interface EthersBlock extends Block {}
export interface EthersLog extends Log {}
export interface EthersJsonRpcProvider extends JsonRpcProvider {}

/**
 * @notice
 * EthersExecutor
 * @extends Wallet
 */
export class EthersExecutor extends Wallet {
  // Super to Wallet
  constructor(_key: string | SigningKey, provider?: null | EthersProvider) {
    super(_key, provider);
  }

  /**
   * @notice
   * @method getTransactionHistory
   * When called - Indexes the transaction history for the parent EthersExecutor
   * @param oldestBlock - The oldest block to go to (Optional)
   * @returns Transaction History
   */
  getTransactionHistory = async (
    oldestBlock?: number
  ): Promise<Array<EthersTransactionResponse | null>> => {
    if (!this.provider) {
      throw new Error("Provider not set In Ethers Executor");
    }
    let provider = this.provider;
    let address = this.address;
    let transactionsArray: Array<EthersTransactionResponse | null> = [];
    let currentBlockNumber = await this.provider.getBlockNumber();
    if (!oldestBlock) oldestBlock = currentBlockNumber - 10;
    for (let i = 0; i < currentBlockNumber - oldestBlock; i++) {
      let block: EthersBlock | null = await this.provider.getBlock(
        currentBlockNumber - i,
        true
      );
      if (!block || !block.transactions) continue;
      for (let transaction of block.transactions) {
        let currentTxn: EthersTransactionResponse | null;

        // If the transaction is null, continue
        if (transaction === null) continue;
        if (typeof transaction == "string")
          currentTxn = await provider.getTransaction(transaction);
        else currentTxn = transaction;
        if (currentTxn === null) continue;

        if (currentTxn.from === address || currentTxn.to === address)
          transactionsArray.unshift(currentTxn);
      }
    }
    return transactionsArray;
  };
}
