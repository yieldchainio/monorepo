/**
 * @notice
 * We make custom typing for ethers' types.
 * This is for two reasons:
 * 1) More explicit naming - Using these types, we know they belong to ethers
 * 2) Extending them - Extending the functionality of some of the types.
 */
// Importing reguler ethers types
import { Wallet, } from "ethers";
/**
 * @notice
 * EthersExecutor
 * @extends Wallet
 */
export class EthersExecutor extends Wallet {
    // Super to Wallet
    constructor(_key, provider) {
        super(_key, provider);
    }
    /**
     * @notice
     * @method getTransactionHistory
     * When called - Indexes the transaction history for the parent EthersExecutor
     * @param oldestBlock - The oldest block to go to (Optional)
     * @returns Transaction History
     */
    getTransactionHistory = async (oldestBlock) => {
        if (!this.provider) {
            throw new Error("Provider not set In Ethers Executor");
        }
        let provider = this.provider;
        let address = this.address;
        let transactionsArray = [];
        let currentBlockNumber = await this.provider.getBlockNumber();
        if (!oldestBlock)
            oldestBlock = currentBlockNumber - 10;
        for (let i = 0; i < currentBlockNumber - oldestBlock; i++) {
            let block = await this.provider.getBlock(currentBlockNumber - i, true);
            if (!block || !block.transactions)
                continue;
            for (let transaction of block.transactions) {
                let currentTxn;
                // If the transaction is null, continue
                if (transaction === null)
                    continue;
                if (typeof transaction == "string")
                    currentTxn = await provider.getTransaction(transaction);
                else
                    currentTxn = transaction;
                if (currentTxn === null)
                    continue;
                if (currentTxn.from === address || currentTxn.to === address)
                    transactionsArray.unshift(currentTxn);
            }
        }
        return transactionsArray;
    };
}
//# sourceMappingURL=ethers.js.map