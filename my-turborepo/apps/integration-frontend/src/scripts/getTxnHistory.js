"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistory = void 0;
const ethers_1 = require("ethers");
const getTransactionHistory = async (provider, address, oldestBlock) => {
    let funcStarted = Date.now() / 1000;
    console.log("This is Current Seconds When Function Started", funcStarted);
    if (!provider) {
        throw new Error("Provider not set In Ethers Executor, Cannot Retreive Transaction History");
    }
    const loadMoreBlocks = async (_earliestBlock, _numberOfBlocks) => {
        let blockPromises = [];
        for (let i = 0; i < _numberOfBlocks; i++) {
            blockPromises.push(provider.getBlock(_earliestBlock - i));
        }
        return await Promise.all(blockPromises);
    };
    let currentBlockNumber = await provider.getBlockNumber();
    let blocks = await loadMoreBlocks(currentBlockNumber, 100);
    currentBlockNumber -= 100;
    let txns = [];
    for (let i = 0; i < blocks.length; i++) {
        if (txns.length >= 100)
            break;
        let block = blocks[i];
        if (!block || !block.transactions) {
            console.log("Contiuing BEcause Of Not Block OR Not Transactions", block);
            continue;
        }
        let txnReceipts = await Promise.all(block.transactions.map((txn) => {
            if (typeof txn == "string")
                return provider.getTransactionReceipt(txn);
            else
                return provider.getTransactionReceipt(txn.hash);
        }));
        console.log("Txn Receipts Ser", txnReceipts);
        for (let j = 0; j < txnReceipts.length; j++) {
            console.log(`Doing TXn Iteration number ${j} on Block Number ${i}`);
            if (txns.length > 100)
                break;
            let txnReceipt = txnReceipts[j];
            if (!txnReceipt)
                continue;
            if (ethers_1.ethers.getAddress(txnReceipt.from) === ethers_1.ethers.getAddress(address)) {
                console.log("Txns Arr Ser", txns);
                txns.push(txnReceipt);
                continue;
            }
            if (txnReceipt.to &&
                ethers_1.ethers.getAddress(txnReceipt.to) === ethers_1.ethers.getAddress(address)) {
                console.log("Txns Arr Ser", txns);
                txns.push(txnReceipt);
                continue;
            }
        }
        if (txns.length >= 100)
            break;
        if (i == blocks.length - 1) {
            blocks = await loadMoreBlocks(currentBlockNumber, 100);
            currentBlockNumber -= 100;
            i = 0;
        }
    }
    console.log("Function Took", Date.now() / 1000 - funcStarted, "Seconds");
    return txns;
};
exports.getTransactionHistory = getTransactionHistory;
//# sourceMappingURL=getTxnHistory.js.map