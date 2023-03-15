import axios from "axios";
// import dotenv from "dotenv";
import { ethers } from "ethers";
import { DBNetwork, TransposeTxnWithLogs } from "src/types";
import { SequenceIndexerClient } from "@0xsequence/indexer";
const ethereumIndexer = new SequenceIndexerClient(
  "https://mainnet-indexer.sequence.app"
);
const indexers: any = {
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

export const fetchTxns = async (
  _address: string,
  _network: DBNetwork,
  _txnAmounts?: number
) => {
  let txns: TransposeTxnWithLogs[] | null = null;
  _txnAmounts ??= 100000;

  let _network_name = _network.name.toLowerCase();

  let apiKey = "kGfU2o8szQnJtWhEckRJhHhEYuA7HrQt";

  let sql = `SELECT * FROM ${_network_name}.transactions t JOIN ${_network_name}.logs USING (transaction_hash) WHERE t.to_address = '${ethers.getAddress(
    _address
  )}' ORDER BY t.block_number DESC LIMIT ${_txnAmounts};`;

  let postData = JSON.stringify({
    sql: sql,
  });

  let headers = {
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
  };

  let res = await axios.post("https://api.transpose.io/sql", postData, {
    headers: headers,
  });

  // let sequencerResult = await indexers.ethereum.getTransactionHistory({
  //   filter: { accountAddress: ethers.getAddress(_address) },
  // });

  // console.log("Sequencer Result", sequencerResult);

  txns = res.data.results;

  return txns as TransposeTxnWithLogs[];
};

export {};
