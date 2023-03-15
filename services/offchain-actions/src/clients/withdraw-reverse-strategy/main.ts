import "dotenv/config.js";
import { ethers, BytesLike } from "ethers";
import {
  EthersJsonRpcProvider,
  EthersContract,
  EthersExecutor,
  EthersTransactionResponse,
  EthersReceipt,
  address,
  SimplifiedFunction,
  TokenBalancesMapping,
  SendRawTransaction,
  CallbackTransaction,
  ExtendedStepDetails,
  SharesCalculatedMapping,
  DBFunction,
  DBToken,
  ExtendedReceipt,
} from "../../offchain-types.js";
import erc20abi from "../../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
import { callCallbackFunction } from "../../offchain-utils/transaction-utils/CallbackFunction.js";
import { sendRawTransaction } from "../../offchain-utils/transaction-utils/RawTransaction.js";
import { manyToOneSwap } from "../lifi/blender-swap.js";
import { manualWithdraw } from "../../offchain-utils/transaction-utils/manualWithdraw.js";
import { getFullFunc } from "../../offchain-utils/strategy-utils/id-to-dbfunc.js";
import { getBalancesChanges } from "../../offchain-utils/token-utils/GetTokenBalanceChanges.js";
import createFork from "../../offchain-utils/fork-utils/Create-Fork.js";
import GenericOrchestrator from "../../sqs-class.js";
import simulateFunction from "./binary-search/simulate-amounts.js";
import toBigInt from "../../offchain-utils/generic-utils/ToBigInt.js";
import getABI from "../../offchain-utils/ABIs/getStrategyABI.js";
import stepIDsToSteps from "../../offchain-utils/strategy-utils/map-raw-steps.js";
import dbFuncsToSimplifiedFuncs from "../../offchain-utils/strategy-utils/db-to-simplified-func.js";
import getStrategyTokens from "../../offchain-utils/strategy-utils/get-strategy-tokens.js";
import getTokenAmountToTransfer from "../../offchain-utils/strategy-utils/get-token-amt-to-transfer.js";
const abi = await getABI();

/*---------------------------------------------------------------
    // @ReverseStrategy, main function - Handles everything
----------------------------------------------------------------*/
export const reverseStrategy = async (
  _inputtedProvider: string,
  _contractAddress: address,
  _funcToCall: string,
  _args_bytes_arr: BytesLike[]
) => {
  /**
   * @Network JSON RPC
   */
  let networkJsonRpc: string = _inputtedProvider;

  /**
   * @Ethers Provider - Origin Chain
   */
  let originalProvider: EthersJsonRpcProvider = new ethers.JsonRpcProvider(
    networkJsonRpc
  );

  // The chain ID
  let _chainId: number = Number((await originalProvider.getNetwork()).chainId);

  // The transaction hash of the transaction that WILL be called after the reverse-strategy is done.
  let withdrawPostTxid: any = null; // TODO: Change the type

  // TODO: Add SQS Support for requsting forks
  /**b
   * @Ganache - *Forked* Chain
   * @Ethers Provider - *Forked* Chain
   */

  // Our ganache options for the fork
  let ganacheOptions = {
    chain: {
      chainId: _chainId,
    },
    fork: {
      url: networkJsonRpc,
      blockNumber: await originalProvider.getBlockNumber(),
    },
  };

  // Ganache server
  let fork = await createFork(ganacheOptions);

  // @createFork function type guards us from null values
  let forkJsonRpc = fork.json_rpc_url;
  let forkProvider: EthersJsonRpcProvider = new ethers.JsonRpcProvider(
    forkJsonRpc as string,
    undefined,
    {
      polling: true,
    }
  );

  // Executor signer (Fork)
  let forkExecutor: EthersExecutor = new EthersExecutor(
    "0x" + process.env.PRIVATE_KEY,
    forkProvider
  );

  // Executor signer (Origin)
  let executor: EthersExecutor = new EthersExecutor(
    "0x" + process.env.PRIVATE_KEY,
    originalProvider
  );

  // Strategy's contract instance
  let contract: EthersContract = new ethers.Contract(
    _contractAddress,
    abi,
    executor
  );

  console.log("Before calling deposit token");

  // Vault deposit token
  let depositToken: address = await contract.vault_deposit_token();

  // The withdrawing user's address
  let userAddress: address = ethers.AbiCoder.defaultAbiCoder().decode(
    ["address"],
    _args_bytes_arr[0]
  )[0];

  // The amount that the user wants to withdraw (Already validated they have enough on-chain)
  let withdrawAmount: bigint = ethers.AbiCoder.defaultAbiCoder().decode(
    ["uint256"],
    _args_bytes_arr[1]
  )[0];

  // Total shares of the vault
  let totalShares: bigint =
    (await contract.totalVaultShares()) + withdrawAmount;

  console.log("Before Creating Deposit Token Contract");

  // Token contract for the deposit token (Mainly used for decimals on next line)
  let depositTokenContract = new ethers.Contract(
    depositToken,
    erc20abi,
    originalProvider
  );

  // TODO: Calculation is potentially a bit off? If the user inputs a super small amount, the calculation may* be off

  // @notice The end share % that we need to withdraw (The share of the user in % of the vault, including the share that he wants to withdraw out of his share (e.g 50% of his share))

  // the share of the user formatted by the decimals, for non-bigint calculation
  let formattedWithdrawAmount = Number(
    ethers.formatUnits(withdrawAmount, await depositTokenContract.decimals())
  );

  // the total shares formatted by the decimals, for non-bigint calculation
  let formattedTotalShares = Number(
    ethers.formatUnits(totalShares, await depositTokenContract.decimals())
  );

  // The share of the user in % of the vault, including the share that he wants to withdraw out of his share (e.g 50% of his share)
  let withdrawShare: number =
    ((formattedWithdrawAmount * 100) / (formattedTotalShares * 100)) * 100;

  // The array of the function identifiers of the reverse strategy
  let reverseFunctionsArray: DBFunction[] | SimplifiedFunction[] =
    await Promise.all(
      ethers.AbiCoder.defaultAbiCoder()
        .decode(["uint256[]"], _args_bytes_arr[2])[0]
        .map(async (funcId: bigint) => {
          return await getFullFunc(Number(funcId));
        })
    );

  // The array of step IDs of the strategy, reversed
  let reverseStepsArray: ExtendedStepDetails[] = await stepIDsToSteps(
    ethers.AbiCoder.defaultAbiCoder().decode(
      ["uint256[]"],
      _args_bytes_arr[3]
    )[0],
    originalProvider,
    _contractAddress
  );

  console.log("AFter mapping reverse arrays");

  // User's shares prior to invoking the withdraw function (Will be used to revert the shares changes if the operation fails)
  let userPreShares: number[] = ethers.AbiCoder.defaultAbiCoder().decode(
    ["uint256"],
    _args_bytes_arr[4]
  )[0];

  console.log("After getting user preshares");

  // Wrap it all in a try-catch, to call withdraw_post with a "false" argument if the operation fails,
  // Which will revert the user's shares to what they were prior to invoking the operation
  try {
    // Transforming the array of function IDs into an array of full functions, using both DB Info & On-chain information, if custom arguments are present
    reverseFunctionsArray = await dbFuncsToSimplifiedFuncs(
      reverseFunctionsArray as DBFunction[], // @Typeguard - must be DBFunction here (Converted to simplified function in the next line)
      reverseStepsArray,
      _contractAddress
    );

    console.log("After doing do funcs to simplefied funcs");

    // @notice Mapping of token names to the amount that needs to be transferred
    let tokensToTransferAmount = new Map<address, string>();

    // Array of all token addresses relating to the vault's strategy.
    let allTokens: DBToken[] = await getStrategyTokens(
      _contractAddress,
      originalProvider
    );

    // @notice An array, the length of the steps array, that clarifies (for each inflow of it) whether it already calculates the shares, or not (Whether the outputted tokens
    // belong to the entire vault or are already calculated per the user's share)

    // @notice filling it up w empty mappings, to be
    let sharesCalculated: SharesCalculatedMapping[] = [];
    // @notice An array that holds the arguments to use for each function call
    const argumentsArray: any[] = [];

    console.log("Before iteration");

    // Iterating over the reversed functions array, in order to determine the arguments, as well as whether or not the arguments calculate the share for us (or whether token inflows from a certain
    // function actually belong to the entire vault)
    for (let i = 0; i < reverseFunctionsArray.length; i++) {
      // The details object of the current function
      const func = reverseFunctionsArray[i];

      // @notice calling the @Simulation function, that determines the max inputs in amount-related arguments and returns them, as well as "example arguments" which are
      // The same args but with the amount args being slightly lower (10%)
      let { argsForCall, sharesCalculatedMapping, shouldKeepFunction } =
        await simulateFunction(
          forkProvider,
          _contractAddress,
          func as SimplifiedFunction,
          func.arguments,
          allTokens,
          withdrawShare,
          forkExecutor
        );

      /**
       * @notice if the function should not be kept (based on return value of @simulateMaxAmount), we emit it out of all of our arrays.
       */
      if (!shouldKeepFunction) {
        reverseFunctionsArray.splice(i, 1); // removing the function from the array
        i--; // decrementing i, to make sure we don't skip a function
        continue; // break current iteration
      }

      // The transaction's correct function (Either a raw one or one that handles a callback log)
      let transactionFunction: SendRawTransaction | CallbackTransaction =
        func.is_callback ? callCallbackFunction : sendRawTransaction;

      /**
       * @notice Once we get the args for the call, we execute it before moving onto the next iteration (to make sure it accounts for the state changes
       * caused by the previous calls, like it would on mainnent when reversing the strategy)
       */
      await transactionFunction(
        forkProvider,
        _contractAddress,
        func as SimplifiedFunction,
        argsForCall,
        forkExecutor
      );

      await forkProvider.send("evm_mine", []); // Mine a block

      console.log(
        `Simulation Iteration On Function ${func.name} Completed, True-False Mapping Size: ${sharesCalculatedMapping.size}`
      );
      argumentsArray.push(argsForCall); // Pushing args to array at the index of the function
      sharesCalculated.push(sharesCalculatedMapping); // Pushing the sharesCalculatedMapping to the array at the index of the function
    }

    // Killng the fork
    // await KillForks([forkId as string]);

    // Add the "Static"/"Local" balances to the mapping (before executing functions)
    for await (const token of allTokens) {
      // The contract of the token
      let tokenContract: EthersContract = new ethers.Contract(
        token.address,
        erc20abi,
        originalProvider
      );

      // The balance of the vault (of that certain token)
      let tokenBalance: bigint = await tokenContract.balanceOf(
        _contractAddress
      );

      // If we have some tokens (Prior to executing any mainnet transactions), we calculate how much of that belongs to the user,
      // and add it to the mapping
      console.log(
        `Balance of ${await tokenContract.symbol()} is ${tokenBalance} in initial Local balance iteration`
      );
      // The share of the user
      let userShareOfBalance =
        toBigInt(tokenBalance) / toBigInt(100 / withdrawShare);

      // To not deduct using negative numbers (User can not be in debt before executing any transactions)
      if (userShareOfBalance < 0n) userShareOfBalance = 0n;

      // Set the amount to transfer to the user
      tokensToTransferAmount.set(
        ethers.getAddress(token.address),
        userShareOfBalance.toString()
      );
    }

    /**
     * @notice getting the SQS Orchestrator's singleton, to append the TXNs we will be executing on mainnet to it's list of TXNs to ignore,
     * Since we will be handling them manually, we do not want double execution
     */
    let orchestrator: GenericOrchestrator = GenericOrchestrator.getSingleton();

    /**
     * @notice
     * Now that we have the arguments for each function, we can start iterating over the reversed functions array again, but this time we will be
     * Exeucting them directly on mainnet, while keeping track of the balance changes of all the related tokens
     */
    for (let i = 0; i < reverseFunctionsArray.length; i++) {
      const func = reverseFunctionsArray[i];
      /**
       * @dev
       * We need to access the singleton SQS orchestrator, to add our mainnet TXNs = So that if they have any callback events,
       * It will know to ignore them (since we need to process them directly)
       */

      // The index of the function in the reversed functions array
      let index: number = i;

      // The arguments to use for the function call
      let args: BytesLike[] = argumentsArray[index];

      // The mapping indicating ( for each token ) if it is already calculated by the share, or not.
      let trueFalseMapping: SharesCalculatedMapping = sharesCalculated[index];

      // Getting the balance changes of all the tokens.
      // (Records balances, executes the function, records difference from before => after)
      let preChangesMapping: TokenBalancesMapping = await getBalancesChanges(
        originalProvider,
        _contractAddress,
        allTokens,
        {
          to: _contractAddress,
          function: func as SimplifiedFunction,
          args: args,
        },
        executor,
        orchestrator
      );

      /**
       * @notice Here we are iterating over the mapping of token addresses to a boolean indicating whether or not the token inflow from the function
       * is already calculated by the share, or not.
       * If the token inflow is not already calculated by the share, we calculate how much of that inflow belongs to the user, and add it to the mapping
       * of tokens to transfer to the user.
       */
      console.log("Function Name", func.name);
      console.log("Tokens To Transfer Amount", tokensToTransferAmount);
      tokensToTransferAmount = await getTokenAmountToTransfer(
        trueFalseMapping,
        preChangesMapping,
        tokensToTransferAmount,
        func as SimplifiedFunction,
        originalProvider,
        withdrawShare
      );

      console.log(
        "tokensToTransferAmount After Calling Get Token Amount To Transfer",
        tokensToTransferAmount
      );
    }

    // @notice Here we are after the functions execution, transferring each one of the tokens to the user.

    // The array of tokens to transfer to the user, with the amount to transfer
    let transferTokensBiggerThanZero: [address, string][] = [];

    // Iterating over the mapping of tokens to transfer to the user, and adding the tokens with a balance > 0 to the array
    for await (const [tokenAddress, amount] of tokensToTransferAmount) {
      // If the amount is bigger than 0, and the token is not the deposit token, we add it to the array - So that we swap it for the deposit token afterwards
      if (
        amount &&
        toBigInt(amount) > 100n &&
        ethers.getAddress(tokenAddress) !== ethers.getAddress(depositToken)
      ) {
        // Push an array specifying the token address, and the amount to transfer
        transferTokensBiggerThanZero.push([
          ethers.getAddress(tokenAddress),
          amount,
        ]);
      }
    }

    // Deposit token balance prior to swaps
    let preSwapDepositTokenBalance: string = (
      await depositTokenContract.balanceOf(_contractAddress)
    ).toString();

    console.log("Deposit Token Balance BEFORE", preSwapDepositTokenBalance);

    // The array of addresses to transfer to
    let transferAddressesArr: address[] = transferTokensBiggerThanZero.map(
      (t) => t[0]
    );

    // The array of amounts to transfer
    let transferAmountsArr: string[] = transferTokensBiggerThanZero.map(
      (t) => t[1]
    );

    /**
     * @notice Sending the callback_post transaction to the contract for swapping all allocated token balances to deposit token
     */
    let postTxidReceipt: EthersReceipt | ExtendedReceipt | null =
      await manyToOneSwap(
        networkJsonRpc,
        await contract.getAddress(),
        transferAddressesArr,
        transferAmountsArr,
        depositToken,
        executor
      );

    console.log(
      "Sent Many-To-One Swap Transaction On Mainnet",
      postTxidReceipt?.hash
    );

    /**
     * @notice Sending the transfer transaction to the contract for transferring the deposit token to the user
     */

    // The current deposit token balance, after the swaps
    let currentDepositTokenBalance: string = (
      await depositTokenContract.balanceOf(_contractAddress)
    ).toString();

    console.log("Current Deposit Token Balance", currentDepositTokenBalance);

    // If had a local deposit token balance entitled to the user from before any runs, we add it to the current deposit token balance
    let doesHaveDepositTokenFromBefore: string =
      tokensToTransferAmount.get(depositToken) || "0";

    // Difference in deposit token balance after swaps (what the user is entitled for)
    let depositTokenAmount: string = (
      toBigInt(currentDepositTokenBalance) -
      toBigInt(preSwapDepositTokenBalance) +
      (doesHaveDepositTokenFromBefore
        ? toBigInt(doesHaveDepositTokenFromBefore[1] || "0")
        : 0n)
    ).toString();

    console.log("Deposit Token Amount To Send", depositTokenAmount);

    // Indicating whether we have transferred any tokens to the user. Will be used to determine whether the operation suceeded or not.
    let haveTransferred: boolean = false;

    // If the deposit token amount is bigger than 0, we transfer it to the user
    if (toBigInt(depositTokenAmount) > 0n) {
      console.log(
        "Deposit Token Amount To Send Is Bigger Than 0, Amount: ",
        depositTokenAmount
      );
      // Withdrawing these amount of tokens to the user
      let transferTxid: EthersTransactionResponse = await manualWithdraw(
        depositToken,
        await contract.getAddress(),
        userAddress,
        depositTokenAmount,
        originalProvider._getConnection().url
      );

      // This is the receipt for the transfer
      let transferTxidReceipt: EthersReceipt | null =
        await originalProvider.getTransactionReceipt(transferTxid.hash);

      // If the receipt exists, and the logs array is bigger than 0, we set haveTransferred to true
      // TODO: Make this more sophisticated, check for Transfer event just in case.
      haveTransferred =
        transferTxidReceipt && transferTxidReceipt.logs.length > 0
          ? true
          : false;
    }

    // Checking if tokens were transferred, if it somwhow didnt (Failed?), we send false to the withdraw_post function (Which will in turn know to
    // Re-add the user's shares & The total shares to what they were prior to the operation)
    console.log("Got Transfer Receipt");

    // Sending the withdraw_post function
    console.log("Sending WIthdraw Post");

    // Calling withdraw_post on the contract
    withdrawPostTxid = await contract.withdraw_post(
      haveTransferred,
      userPreShares.toString(),
      userAddress.toString()
    );
    const receipt = await originalProvider.waitForTransaction(
      withdrawPostTxid.hash
    );
    console.log(
      "Sent Withdraw Post Transaction On Mainnet",
      withdrawPostTxid.hash
    );

    return receipt;
  } catch (e: any) {
    if (e.message !== "debug") {
      console.log(`Caught error on line ${e.lineNumber}`, e);
      let postTxidReceipt = withdrawPostTxid
        ? await originalProvider.getTransactionReceipt(withdrawPostTxid.hash)
        : null;
      if (!postTxidReceipt || postTxidReceipt.status) {
        await contract.withdraw_post(
          false,
          userPreShares.toString(),
          userAddress.toString()
        );
        console.log(
          "Caught error, sent withdraw post on mainnet to revert withdrawl changes"
        );
      }
    }
  }
};
