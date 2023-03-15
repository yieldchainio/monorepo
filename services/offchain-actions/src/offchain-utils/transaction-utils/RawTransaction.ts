import { ethers, BytesLike } from "ethers";
import GenericOrchestrator from "../../sqs-class.js";
import {
  SimplifiedFunction,
  ExtendedReceipt,
  SendRawTransaction,
  EthersProvider,
  EthersJsonRpcProvider,
  EthersExecutor,
  address,
  EthersContract,
  EthersReceipt,
  EthersPopulatedTransaction,
  EthersTransactionResponse,
} from "../../offchain-types.js";
import getABI from "../ABIs/getStrategyABI.js";
const abi = await getABI();

// TODO: Add a global receipt variable and only recruse on catch if it's status is 0
export const sendRawTransaction: SendRawTransaction = async (
  _provider: EthersJsonRpcProvider, // Ethers Provider Class
  _contractAddress: address, // A checksum address (e.g, 0x73112...94FaJK12)
  _func: SimplifiedFunction | string, // A Simplified function object, or a string
  _args: any[], // Arguments of any type to spread into the function call
  _executor: EthersExecutor, // Ethers Wallet Class
  _try: number = 0,
  _optionalNonce?: number, // An optional nonce incase there are issues with nonce managemnt/some errors are caught
  _ignoreTxns?: GenericOrchestrator // An optional GenericOrchestrator to ignore transactions
) => {
  // If there r no args, use an empty array instead.
  if (!_args) _args = [];

  // Receipt variable, only recruse on catch if it's status is 0 or it is null

  // The contract instance
  let contract: EthersContract = new ethers.Contract(
    _contractAddress,
    abi,
    _executor
  );

  // The function name - we may get a raw function name or a "SimplfiedFunction" type object,
  // With a name proprety on it.
  let functionName: string = typeof _func === "object" ? _func.name : _func;

  // An unsigned transaction data populated using the arguments
  let unsignedtx: EthersPopulatedTransaction = await contract[
    functionName
  ].populateTransaction(..._args); // An Unsigned Transaction Populated

  let nonceUsed =
    _optionalNonce ||
    (await _provider.getTransactionCount(_executor.address, "pending"));
  try {
    // The arguments for the txn
    const txnArguments: any = {
      from: _executor.address,
      to: _contractAddress,
      data: unsignedtx.data,
      nonce: nonceUsed,

      gasLimit: 10000000,
    };

    // Sending the transaction
    const tx: EthersTransactionResponse = await _executor.sendTransaction(
      txnArguments
    );

    // If we have a GenericOrchestrator to ignore transactions, add the transaction to the ignore list
    // This will make it so that if an event was emitted from this transaction,
    // to be handled in some way by the SQS orchestrator - it will be ignored.
    if (_ignoreTxns) {
      _ignoreTxns.addTxnToIgnore(tx.hash);
    }

    // If we are not on a local network, wait for the transaction to be mined
    if (!_provider._getConnection().url.includes("localhost")) {
      await tx.wait();
    }

    // Getting the receipt
    let receipt: ExtendedReceipt | EthersReceipt | null =
      await _provider.getTransactionReceipt(tx.hash);

    // Extend the receipt with the contract address, function name & arguments
    receipt = {
      ...receipt?.toJSON(),
      args: _args,
      function_name: functionName,
      contract_address: _contractAddress,
    };

    /**
     * @notice
     * If we are on a fork, it is best practice to mine a block after each transaction.
     * On a real network for instance, there would be some block movement between txns,
     * so we need to simulate that on a fork. Moreover, protocols (such as GMX) may rely
     * on some block movement to trigger certain events/unlock token movement.
     */
    if (_provider._getConnection().url.includes("localhost")) {
      await _provider.send("evm_mine", []);
      await _provider.send("evm_mine", []);
    }

    // Return the receipt
    return receipt;
  } catch (e: any) {
    // Checking if im not catching the correct error
    if (
      (e.message.includes("nonce") || e.message.includes("Nonce")) &&
      e.message.includes("high")
    ) {
      return await sendRawTransaction(
        _provider,
        _contractAddress,
        _func,
        _args,
        _executor,
        _try + 1,
        _try < 10 ? nonceUsed : nonceUsed - 1
      );
    }

    // If the error is a nonce too low error, we can try to send the transaction again with a higher nonce
    if (e?.error?.code === -32000) {
      console.log("RawTransaction ERR Caught With Code -32000: " + e);
      return await sendRawTransaction(
        _provider,
        _contractAddress,
        _func,
        _args,
        _executor,
        _try + 1,
        _try < 10
          ? nonceUsed
          : (await _provider.getTransactionCount(
              _executor.address,
              "pending"
            )) + 1
      );
    }
    // If the error is a nonce too low error, we can try to send the transaction again with a higher nonce
    if (e.code.includes("NONCE_EXPIRED")) {
      console.log("NONCE EXPIRED");
      return await sendRawTransaction(
        _provider,
        _contractAddress,
        _func,
        _args,
        _executor
      );
    }
    // console.log("Error IN Raw TX", e.message);
    return null;
  }
};
