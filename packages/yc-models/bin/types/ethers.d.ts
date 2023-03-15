/**
 * @notice
 * We make custom typing for ethers' types.
 * This is for two reasons:
 * 1) More explicit naming - Using these types, we know they belong to ethers
 * 2) Extending them - Extending the functionality of some of the types.
 */
import { Provider, SigningKey, Wallet, JsonFragment, Block, Contract, JsonRpcProvider, EventLog, TransactionReceipt, TransactionResponse, TransactionLike, Transaction, Log } from "ethers";
export interface EthersProvider extends Provider {
}
export interface EthersInterface extends JsonFragment {
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
/**
 * @notice
 * EthersExecutor
 * @extends Wallet
 */
export declare class EthersExecutor extends Wallet {
    constructor(_key: string | SigningKey, provider?: null | EthersProvider);
    /**
     * @notice
     * @method getTransactionHistory
     * When called - Indexes the transaction history for the parent EthersExecutor
     * @param oldestBlock - The oldest block to go to (Optional)
     * @returns Transaction History
     */
    getTransactionHistory: (oldestBlock?: number) => Promise<Array<EthersTransactionResponse | null>>;
}
