export var ChainID;
(function (ChainID) {
    ChainID[ChainID["Ethereum"] = 1] = "Ethereum";
    ChainID[ChainID["BinanceSmartChain"] = 56] = "BinanceSmartChain";
    ChainID[ChainID["Polygon"] = 137] = "Polygon";
    ChainID[ChainID["Fantom"] = 250] = "Fantom";
    ChainID[ChainID["Avalanche"] = 43114] = "Avalanche";
    ChainID[ChainID["Arbitrum"] = 42161] = "Arbitrum";
})(ChainID || (ChainID = {}));
// Global Types
import { Wallet, } from "ethers";
export class EthersExecutor extends Wallet {
    constructor(_key, provider) {
        super(_key, provider);
    }
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
//# sourceMappingURL=generation-types.js.map