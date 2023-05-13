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
            throw new Error("Provider not set In Ethers Executor, Cannot Retreive Transaction History");
        }
        let provider = this.provider;
        let address = this.address;
        let transactionsArray = [];
        let currentBlockNumber = await this.provider.getBlockNumber();
        if (!oldestBlock)
            oldestBlock = currentBlockNumber - 10;
        let blockPromises = [];
        for (let i = 0; i < currentBlockNumber - oldestBlock; i++) {
            blockPromises.push(await this.provider.getBlock(currentBlockNumber - i));
        }
        let blocks = await Promise.all(blockPromises);
        let txns = [];
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (!block || !block.transactions) {
                continue;
            }
            let txnReceipts = await Promise.all(block.transactions.map((txn) => {
                if (typeof txn == "string")
                    return provider.getTransactionReceipt(txn);
                else
                    return provider.getTransactionReceipt(txn.hash);
            }));
            for (let j = 0; j < txnReceipts.length; j++) {
                let txnReceipt = txnReceipts[j];
                if (!txnReceipt)
                    continue;
                if (txnReceipt.from === address || txnReceipt.to === address) {
                    txns.push(txnReceipt);
                }
            }
        }
        return txns;
    };
}
//# sourceMappingURL=offchain-types.js.map