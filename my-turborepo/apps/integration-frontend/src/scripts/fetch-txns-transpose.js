"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTxns = void 0;
const axios_1 = __importDefault(require("axios"));
// import dotenv from "dotenv";
const ethers_1 = require("ethers");
const indexer_1 = require("@0xsequence/indexer");
const ethereumIndexer = new indexer_1.SequenceIndexerClient("https://mainnet-indexer.sequence.app");
const indexers = {
    ethereum: ethereumIndexer,
};
const chainIdsToNetworkNames = {
    1: "mainnet",
    42161: "arbitrum",
    137: "polygon",
    250: "fantom",
    56: "binance",
    100: "xdai",
    128: "heco",
    43114: "avalanche",
};
// dotenv.config();
const fetchTxns = async (_address, _network, _txnAmounts) => {
    let txns = null;
    _txnAmounts !== null && _txnAmounts !== void 0 ? _txnAmounts : (_txnAmounts = 100000);
    let _network_name = _network.name.toLowerCase();
    let apiKey = "kGfU2o8szQnJtWhEckRJhHhEYuA7HrQt";
    let sql = `SELECT * FROM ${_network_name}.transactions t JOIN ${_network_name}.logs USING (transaction_hash) WHERE t.to_address = '${ethers_1.ethers.getAddress(_address)}' ORDER BY t.block_number DESC LIMIT ${_txnAmounts};`;
    let postData = JSON.stringify({
        sql: sql,
    });
    let headers = {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
    };
    let res = await axios_1.default.post("https://api.transpose.io/sql", postData, {
        headers: headers,
    });
    // let sequencerResult = await indexers.ethereum.getTransactionHistory({
    //   filter: { accountAddress: ethers.getAddress(_address) },
    // });
    // console.log("Sequencer Result", sequencerResult);
    txns = res.data.results;
    return txns;
};
exports.fetchTxns = fetchTxns;
//# sourceMappingURL=fetch-txns-transpose.js.map