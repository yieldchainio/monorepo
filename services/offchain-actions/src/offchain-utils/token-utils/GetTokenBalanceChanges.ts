import { ethers } from "ethers";
import { getTokenBalances } from "./GetTokenBalances.js";
import { callCallbackFunction } from "../transaction-utils/CallbackFunction.js";
import { sendRawTransaction } from "../transaction-utils/RawTransaction.js";
import {
  SimplifiedFunction,
  BaseTokensList,
  TokenBalancesMapping,
  EthersJsonRpcProvider,
  address,
  EthersExecutor,
} from "../../offchain-types.js";
import GenericOrchestrator from "../../sqs-class.js";
import toBigInt from "../generic-utils/ToBigInt.js";
import erc20abi from "../ABIs/ERC20.json" assert { type: "json" };

/*---------------------------------------------------------------
    // @GetBalancesChanges 
    // @returns a mapping of the difference between the balances before and after the transaction 
----------------------------------------------------------------*/
export const getBalancesChanges = async (
  _provider: EthersJsonRpcProvider,
  _contractAddress: address,
  _tokensList: BaseTokensList,
  _transactionToExecute: {
    to: address;
    function: SimplifiedFunction;
    args: any[];
  },
  _executor: EthersExecutor,
  _ignoreTxns?: GenericOrchestrator
) => {
  // Mapping of all the token balances before the transaction
  let preTokensMapping: TokenBalancesMapping = await getTokenBalances(
    _provider,
    _contractAddress,
    _tokensList
  );

  /**
   * @notice executing the inputted function call after getting the token balances, in order to find out the differences it makes in the balances
   */
  if (_transactionToExecute.function.is_callback) {
    // Execute the callback function
    await callCallbackFunction(
      _provider,
      _transactionToExecute.to,
      _transactionToExecute.function,
      _transactionToExecute.args,
      _executor,
      _ignoreTxns
    );
  } else {
    // Otherwise if a regular function, execute it
    await sendRawTransaction(
      _provider,
      _transactionToExecute.to,
      _transactionToExecute.function,
      _transactionToExecute.args,
      _executor
    );
  }

  // Mapping of token balances post the function call
  let postTokensMapping: TokenBalancesMapping = await getTokenBalances(
    _provider,
    _contractAddress,
    _tokensList
  );

  // A mapping of the differences between the balances before and after the function call
  let tokenBalancesChanges: TokenBalancesMapping = new Map();

  // Iterating over each token and finding the difference between the balances before and after the function call
  for await (const token of _tokensList) {
    // The balance of the token before the function call
    let preBalance = preTokensMapping.get(ethers.getAddress(token.address));

    // The balance of the token after the function call
    let postBalance = postTokensMapping.get(ethers.getAddress(token.address));

    // @Typeguard
    if (preBalance === undefined || postBalance === undefined) continue;

    // The difference between the balances before and after the function call
    let change: bigint =
      toBigInt(postBalance.toString()) - toBigInt(preBalance.toString());

    /**
     * @notice
     * If the change is negative, it means that the function call has decreased the balance of the token
     * in which case, we want to make the change "0" - It may have had some outflow into a certain position,
     * yet we do not want to deduct that from the user's owed balance.
     * for instance, if we swap 1 ETH (Deposit Token) for 1000 DAI, the change here would be -1ETH, and then we swap back to ETH (end of operation),
     * The change would be +1ETH, which would cancel out the -1ETH, and the user would have 0ETH owed to them.
     * Instead of getting the entire 1ETH back, which would be incorrect
     */
    let tokenContract = new ethers.Contract(
      ethers.getAddress(token.address),
      erc20abi,
      _provider
    );
    if (_transactionToExecute.function.name === "func_17") {
      console.log(
        `Inside iteration in Lifi Func_17, getBalancesChanges, over token ${await tokenContract.symbol()}, change is ${change.toString()}`
      );
    }
    tokenBalancesChanges.set(
      ethers.getAddress(token.address),
      change.toString()
    );
  }
  return tokenBalancesChanges;
};
