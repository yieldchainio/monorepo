// Imports
import { sendRawTransaction } from "./RawTransaction.js";
import { ethers } from "ethers";
import { handleCallbackEvent } from "../../handle-callback-event.js";
import {
  CallbackTransaction,
  SendRawTransaction,
  ExtendedReceipt,
  SimplifiedFunction,
  EthersProvider,
  EthersExecutor,
  address,
  EthersReceipt,
  EthersBlock,
  EthersTransaction,
  EthersTransactionResponse,
  EthersLog,
  EthersJsonRpcProvider,
} from "../../offchain-types.js";
import GenericOrchestrator from "../../sqs-class.js";

////////////////////////////////
// NewFunction-----------------
///////////////////////////////

export const callCallbackFunction: CallbackTransaction = async (
  _provider: EthersJsonRpcProvider,
  _contractAddress: address,
  _func: SimplifiedFunction,
  _args: any[],
  _executor: EthersExecutor,
  _ignoreTxns?: GenericOrchestrator
) => {
  // The nonce of the executor prior to any transactions being sent (e.g, '50')
  let preNonce: number = await _provider.getTransactionCount(
    _executor.address,
    "pending"
  );
  let preBlockNumber: number = await _provider.getBlockNumber();
  let targetNonce: number = preNonce + 2; // The nonce of the executor after the initial transaction is sent & After the callback post txid is sent (e.g, '52')

  // Send the initial transaction
  let InitialTxnReceipt: EthersReceipt | ExtendedReceipt | null =
    await sendRawTransaction(
      _provider,
      _contractAddress,
      _func,
      _args,
      _executor,
      undefined,
      undefined,
      _ignoreTxns
    );

  // Checking if the initial transaction went through
  let initialWentThrough =
    InitialTxnReceipt !== null && InitialTxnReceipt.status !== 0;

  // If the initial transaction went through, search for the callback post transaction
  if (initialWentThrough) {
    if (
      !InitialTxnReceipt ||
      !InitialTxnReceipt.logs ||
      InitialTxnReceipt.logs.length <= 0
    )
      return null; // Return at this point if no logs were emitted initially

    // Else, searching for the ("CallbackEvent") log emitted by the initial transaction
    let callbackLog: EthersLog | null =
      InitialTxnReceipt.logs.find(
        (log: EthersLog) =>
          log.topics[0] == ethers.id("CallbackEvent(string,string,bytes[])")
      ) || null;

    // Handle the CallbackEvent
    if (callbackLog === null) return null; // Return at this point if no callback log was found

    // Handle the callback event immediatly,
    // Should call the target Offchain-Action and return a receipt
    let postReceipt: EthersReceipt | null = await handleCallbackEvent(
      {
        ...callbackLog,
        json_rpc_url: _provider._getConnection().url,
      },
      1000 // waiting for 1 second before handling the callback event
    );

    // If the post callback receipt is null (Timeout resolved before it the receipt promise), we check the transaction history of our executor.
    // To make sure the listener did not miss a transaction
    // TODO: Seems like this part is reeeeeeeeeeeeealy slow. Maybe my getTransactionHistory method is clogging it somehow?
    if (postReceipt === null) {
      console.log("Post Receipt Is Equal to Null");
      // The Transaction history of the executor
      let transactionHistory = await _executor.getTransactionHistory(
        preBlockNumber
      );

      // Attempt to find the transaction manually
      let postTxnRetry: EthersReceipt | null = null;

      for (let i = 0; i < transactionHistory.length; i++) {
        let tx = transactionHistory[i];
        if (tx === null) continue;
        let _txn = await _provider.getTransaction(tx.hash);
        if (!_txn) continue;
        if (_txn.nonce === targetNonce) {
          postTxnRetry = tx;
          break;
        }
      }

      // If the transaction was not found, return null
      if (postTxnRetry == (undefined || null)) return null;

      // If the transaction was found, get the receipt
      // @JSON Formatted
      let postTxnRetryReceipt = postTxnRetry.toJSON();

      // If the receipt has no logs, return null
      if (
        postTxnRetryReceipt &&
        postTxnRetryReceipt.logs &&
        postTxnRetryReceipt.logs.length <= 0
      )
        return null;
      // Return the Receipt (JSONed)
      else return InitialTxnReceipt;
    } else {
      // If the post callback receipt is not null, return the receipt if logs are present
      if (!postReceipt || !postReceipt.logs) return null;
      if (postReceipt.logs.length <= 0) return null;
      return InitialTxnReceipt;
    }
  }
  return null;
};
