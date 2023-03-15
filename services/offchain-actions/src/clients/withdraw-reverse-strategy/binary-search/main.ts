import { ethers } from "ethers";
import {
  CallbackTransaction,
  ExtendedReceipt,
  SendRawTransaction,
  SimplifiedFunction,
  BinarySearchSimulationAttempt,
  BaseTokensList,
  address,
  EthersExecutor,
  EthersJsonRpcProvider,
  EthersReceipt,
  EthersLog,
  ExtendedArgument,
} from "../../../offchain-types.js";
import { encoding } from "../../../offchain-utils/generic-utils/Encoding.js";
import { getTokenBalances } from "../../../offchain-utils/token-utils/GetTokenBalances.js";
import getABI from "../../../offchain-utils/ABIs/getStrategyABI.js";
import searchTxidShortcut from "./txn-shortcut.js";
import toBigInt from "../../../offchain-utils/generic-utils/ToBigInt.js";

const abi = await getABI();

export const MainBinarySearch = async (
  _provider: EthersJsonRpcProvider,
  _executor: EthersExecutor,
  _transactionFunction: SendRawTransaction | CallbackTransaction,
  _contractAddress: address,
  _func: SimplifiedFunction,
  _args: any[],
  _key: any, // Key being iterated over / simulated right now
  isCallback: boolean,
  _upperBound: bigint,
  _lowerBound: bigint,
  _tokensList: BaseTokensList,
  _divideBy: number
) => {
  /**************************************************************** */
  let transactionFunction: SendRawTransaction | CallbackTransaction =
    _transactionFunction;
  let key: string | number = _key;
  let upperBound: bigint = _upperBound;
  let lowerBound: bigint = _lowerBound;
  let attempts: BinarySearchSimulationAttempt[] = []; // Array of all the attempts made
  let divideBy: number = _divideBy;
  let hasAmountArg: boolean = _args.some(
    (arg: ExtendedArgument) => arg.parameter_identifier == key
  );
  /*****************************************************************/

  // The amount that will be attempted in the binary search iterations
  let midPoint: bigint;

  /**
   * @notice the binary search loop, attempts a certain number argument, if it succeeds, sets lowerbound to midpoint, if it fails, sets upperbound to midpoint,
   * that way we can keep narrowing down the range of the argument that will succeed until we find an accurate value
   * @dev the number of iterations is set to 1000, but this can be changed to any number we find efficient.
   */
  for (let i = 0; i < 1000; i++) {
    // Taking a checkpoint before the simulation
    let preCheckpoint: any = await _provider.send("evm_snapshot", []);

    // Setting the midpoint
    midPoint = (upperBound + lowerBound) / 2n;

    // Mapping the arguments, if the argument is the one we are trying to simulate, we replace it with the midpoint
    let args: ExtendedArgument[] =
      _args.length <= 0
        ? []
        : _args.map((arg: ExtendedArgument) => {
            return {
              ...arg,
              value: Array.isArray(arg.value)
                ? arg.value.map((_arg: any) => {
                    if (typeof _arg == "string" && _arg.includes("_BALANCE"))
                      return midPoint.toString();
                    else return _arg;
                  })
                : typeof arg.value == "string" && arg.value.includes("_BALANCE")
                ? midPoint.toString()
                : arg.value,
            };
          });
    // Transaction's result, initially set to null
    let result: EthersReceipt | ExtendedReceipt | null | { logs: EthersLog[] } =
      null;

    /**
     * Attempting the simulation, assigning the result (Should be An extended Ethers Receipt) to the result variable
     */
    try {
      // Calling the searchTxidShortcut function, which will attempt the simulation
      result = await searchTxidShortcut(
        _provider,
        _contractAddress,
        _func,
        "callback_post",
        args,
        abi,
        _executor,
        transactionFunction
      );
      let poo = 5;
    } catch (e: any) {
      // Catching potential errors. This may happen if transactions go through and there are call exceptions
      console.error(
        "Simulation Failed In Main Binary Search Search, On Func:",
        _func.name,
        e.message
      );
    }

    // Checking if the simulation succeeded
    let didSucceed: boolean =
      result && result.logs && result.logs.length > 0 ? true : false;

    // Pushing the attempt into the attempts array, to later iterate over
    attempts.push({
      amount: midPoint,
      result: result,
      tokens: await getTokenBalances(_provider, _contractAddress, _tokensList),
      success: didSucceed,
      reproductionArgs: [
        _provider,
        _contractAddress,
        _func,
        [
          "callback_post",
          [
            ...(await Promise.all(
              args.map(
                async (arg) =>
                  await encoding(
                    _provider,
                    _contractAddress,
                    arg.value,
                    arg.solidity_type,
                    abi
                  )
              )
            )),
          ],
        ],
        _executor,
      ],
    });

    // Reverting back to the checkpoint
    await _provider.send("evm_revert", [preCheckpoint]); // Reverting to the checkpoint

    // Past succcesses (For Checking)
    let pastSuccesses: BinarySearchSimulationAttempt[] = attempts.filter(
      (attempt) => attempt.success
    );

    // Break the loop if we found a close enough upper limit (i.e the range reduced enough
    // for the difference to be unnoticable)
    // @dev 0.000001 can be interchanged if found necessary
    if (
      Number(upperBound - lowerBound) < 1000000000000n &&
      pastSuccesses.length > 2
    ) {
      console.log(
        `Difference is minor in func ${_func.name}, breaking Main Binary Search loop}`
      );
      break;
    }

    // Breaking the loop if the function is callback (Should not need to do binary search in that case)
    if (isCallback) {
      console.log(
        `Func ${_func.name} is callback, breaking Main Binary Search loop`
      );
      break;
    }

    // If it did not succeed, we lower the upperbound to the midpoint (in the process of narrowing down the range)
    if (!didSucceed) {
      console.log(
        `Failure in Main Binary Search On Func ${_func.name}, Amount: ${midPoint}, Iteration: ${i}, Arguments:`,
        `Logs In Current Receipt: ${result?.logs?.length}`
      );

      // Lowering the upper bound
      upperBound = midPoint;

      // Breaking the loop if the upper bound is equal to the lower bound, to avoid infinite loop
      if (upperBound === lowerBound || upperBound === 0n) {
        break;
      }

      // If it did suceed, though - we raise the lowerbound to the midpoint (in the process of narrowing down the range)
    } else {
      console.log(
        `Success in Main Binary Search On Func ${_func.name}, Amount: ${midPoint}, Iteration: ${i}, Arguments:`,

        `Logs In Current Receipt: ${result?.logs?.length}`
      );
      lowerBound = midPoint;

      // If there are no arguments, and the transaction went through - there is no need to simulate further. (Assuming we have atleast 2 successes)
      if (_args.length <= 0 && pastSuccesses.length > 2) {
        break;
      }
    }

    // Break if we reached absolute zero
    if (midPoint === 0n) {
      break;
    }

    // If there is no amount argument (e.g just static arguments), then we break the loop, as there is no need to simulate any further
    if (!hasAmountArg) {
      break;
    }
  }

  // The amount that will be set
  let amountToSet: bigint = 0n;

  // Only successes
  let successes = attempts.filter(
    (attempt: BinarySearchSimulationAttempt) => attempt.success === true
  );

  // The largest success from all of the attempts
  let largestSuccess: BinarySearchSimulationAttempt | null = null;
  let smallerSuccessForTest: BinarySearchSimulationAttempt | null = null;

  try {
    largestSuccess = successes.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );
    // A successfull attempt that is smaller by it's amount input than the largest one

    smallerSuccessForTest =
      successes.find(
        (attempt) => attempt.amount < (largestSuccess?.amount || -1)
      ) || null;
  } catch (e: any) {
    console.error(
      "No Successes Found In Main Binary Search For Function:",
      _func.name
    );
  }

  /**
   * @notice if there is no successful attempts with any amount,
   * we retry one more time with 0 as the argument. If it succeeds, we return 0 as the argument.
   * If it fails, we return an identifier that will be used to pop the function from the current operation.
   */
  if (!largestSuccess) {
    console.log(
      "No Successes Found In Main Binary Search For Function:",
      _func.name
    );

    // Mapping the arguments, if we got no large sucess, we will try to simulate with 0 one last time
    let args: ExtendedArgument[] =
      _args.length <= 0
        ? []
        : _args.map((arg: ExtendedArgument) => {
            return {
              ...arg,
              value: Array.isArray(arg.value)
                ? arg.value.map((_arg: any) => {
                    if (typeof _arg == "string" && _arg.includes("_BALANCE"))
                      return "0";
                    else return _arg;
                  })
                : typeof arg.value == "string" && arg.value.includes("_BALANCE")
                ? "0"
                : arg.value,
            };
          });

    // the result of the last simulation, initially null
    let result: EthersReceipt | ExtendedReceipt | null | { logs: EthersLog[] } =
      null;

    // Trying to simulate with 0 one last time
    try {
      // Calling the searchTxidShortcut function
      result = await searchTxidShortcut(
        _provider,
        _contractAddress,
        _func,
        "callback_post",
        args,
        abi,
        _executor,
        transactionFunction
      );
    } catch (e: any) {
      console.error("Last Simulation Failed With 0", e.message);
    }
    // Checking if the last retry went through
    let didSucceed: boolean =
      result && result.logs && result.logs.length > 0 ? true : false;

    // If the attempt with 0 succeeded, we set the argument amount to 0.
    if (didSucceed) {
      amountToSet = 0n;
      largestSuccess = {
        amount: 0n,
        result: result,
        tokens: await getTokenBalances(
          _provider,
          _contractAddress,
          _tokensList
        ),
        success: didSucceed,
        reproductionArgs: [
          _provider,
          _contractAddress,
          _func,
          [
            "callback_post",
            [
              ...(await Promise.all(
                args.map(
                  async (arg) =>
                    await encoding(
                      _provider,
                      _contractAddress,
                      arg.value,
                      arg.solidity_type,
                      abi
                    )
                )
              )),
            ],
          ],
          _executor,
        ],
      };
    } else {
      amountToSet = toBigInt(-1);
    }
  }

  // The amount that will be set to the strategy
  // * only if we found a success
  if (amountToSet !== toBigInt(-1) && largestSuccess) {
    amountToSet = toBigInt(
      parseInt((Number(largestSuccess.amount) / (100 / divideBy)).toString())
    );
  }

  // The mapping of token addresses to whether or not they belong to the entire vault, or are already calculated
  // By the user's share
  let sharesCalculatedMapping = new Map<address, boolean>();
  // If did not find a success, all of the token mappings would be false
  if (!largestSuccess) {
    for (const tokenAddress of _tokensList) {
      sharesCalculatedMapping.set(tokenAddress.address, false);
    }
  }

  // If there is inddeed a success, we are going to calculate the user's share of the tokens (A true/false mapping)
  if (largestSuccess) {
    for (const [tokenAddress, largestTokenBalance] of largestSuccess.tokens) {
      // The current token balance of the smaller success example attempt
      let smallerSuccessTokenBalance;

      // If there is a smaller success, we get the token balance of the smaller success
      if (smallerSuccessForTest)
        smallerSuccessTokenBalance =
          smallerSuccessForTest.tokens.get(tokenAddress);

      /**
       * @notice
       * @dev
       * If we do not have a smaller success, but we do have a single large success - and the function is a Callback (i.e offchain action),
       * we assume that the off-chain action knows to calculate the share for us already.
       */
      if (!smallerSuccessTokenBalance) {
        if (isCallback) {
          // TODO: Currently setting to false, since i want to add more logic to the offchain actions to calculate (by using some variable mby?),
          // TODO: but this should be set to true eventually
          sharesCalculatedMapping.set(tokenAddress, true);
          continue;
        } else {
          // If it is not a callback, a success was found but no smaller success was found, we assume that the token inflows belong to the entire vault,
          // Since the amount does not interchange with other retries which are inputted supposdely other amounts.
          sharesCalculatedMapping.set(tokenAddress, false);
          continue;
        }
      }

      // If it is undefined, we are assuming the balance is either all or nothing - so we are assuming the it belongs to the entire vault
      if (
        largestTokenBalance === undefined ||
        smallerSuccessTokenBalance === undefined
      ) {
        sharesCalculatedMapping.set(tokenAddress, false);
        continue;
      }

      // The difference between the large success' balance of the token, and the smaller example success
      let difference: bigint =
        toBigInt(largestTokenBalance) - toBigInt(smallerSuccessTokenBalance);

      // If the there is a (meaningful, to account for very nuanced potential rounding errors / accumlated rewards) difference,
      // We are assuming that the token inflow of this function already has the share calculation done, so it belongs to the withdrawing user only.
      let isCalculatedByShare: boolean =
        Number(difference) > 10000000n ? true : false;

      // Setting the boolean to the mapping (Whether it is pre-calculated or should be calculated after the inflow)
      sharesCalculatedMapping.set(tokenAddress, isCalculatedByShare);
    }
  }

  // The amount to set
  // Making sure it is no less than 0 (Which could break it)
  amountToSet = amountToSet < 0n ? 0n : amountToSet;

  // Determines whether we pop the function out or not (Is it executable?)
  let keepFunction: boolean = amountToSet === toBigInt(-1) ? false : true;
  return { amountToSet, sharesCalculatedMapping, keepFunction };
};
