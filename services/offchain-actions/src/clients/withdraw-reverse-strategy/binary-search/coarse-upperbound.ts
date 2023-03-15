import { ethers } from "ethers";
import {
  CallbackTransaction,
  ExtendedReceipt,
  SendRawTransaction,
  SimplifiedFunction,
  address,
  EthersExecutor,
  EthersJsonRpcProvider,
  EthersReceipt,
  EthersLog,
  ExtendedArgument,
} from "../../../offchain-types.js";
import { encoding } from "../../../offchain-utils/generic-utils/Encoding.js";
import getABI from "../../../offchain-utils/ABIs/getStrategyABI.js";
const abi = await getABI();

export const SearchCoarseUpperbound = async (
  _provider: EthersJsonRpcProvider,
  _executor: EthersExecutor,
  _transactionFunction: SendRawTransaction | CallbackTransaction,
  _contractAddress: address,
  _func: SimplifiedFunction,
  _args: any[],
  _key: any, // Key being iterated over / simulated right now
  _upperBound: bigint,
  _lowerBound: bigint
) => {
  // The function that will be used to send the transaction
  let transactionFunction: SendRawTransaction | CallbackTransaction =
    _transactionFunction;

  // The key being iterated over / simulated right now
  let key: string | number = _key;

  // The upper and lower bounds of the amount being simulated
  let upperBound: bigint = _upperBound;

  // The lower bound of the amount being simulated
  let lowerBound: bigint = _lowerBound;

  // The amount being simulated
  let hasAmountArg: boolean = _args.some(
    (arg: ExtendedArgument) => arg.parameter_identifier == key
  );

  // Iterating over it 100 times, attemtping to find an absolute upperbound (i.e a number that when inputted, the transaction fails - so we know
  // there is no higher amount that can go through)
  for (let i = 0; i < 100; i++) {
    // Taking a checkpoint before the simulation
    let preCheckpoint: any = await _provider.send("evm_snapshot", []);

    // The amount being attempted in the current iteration, always the upperbound
    let amtAttempt: bigint = upperBound;

    // Mapping the args - if an arg's identifier is equal ot the current key, we set its value as the current amount attempt
    let args: ExtendedArgument[] =
      _args.length <= 0
        ? []
        : _args.map((arg: ExtendedArgument) => {
            return {
              ...arg,
              value: Array.isArray(arg.value)
                ? arg.value.map((_arg: any) => {
                    if (typeof _arg == "string" && _arg.includes("_BALANCE"))
                      return amtAttempt.toString();
                    else return _arg;
                  })
                : typeof arg.value == "string" && arg.value.includes("_BALANCE")
                ? amtAttempt.toString()
                : arg.value,
            };
          });

    // TODO: Figure out how a simulation w 2 parameters work. because whilst simulating 1 parameter, the other has to be another. And they may be directly correlated (e.g liq prov)

    // The result of the transaction, initially null
    let result: EthersReceipt | ExtendedReceipt | null | { logs: EthersLog[] } =
      null;

    // Wrapping in a try catch to not break on fail
    try {
      // Sending the transaction
      result = await transactionFunction(
        _provider,
        _contractAddress,
        _func,
        [
          "callback_post",
          [
            ...(await Promise.all(
              args.map(
                async (argument) =>
                  await encoding(
                    _provider,
                    _contractAddress,
                    argument.value,
                    argument.solidity_type,
                    abi
                  )
              )
            )),
          ],
        ],
        _executor
      );
    } catch (e) {
      console.error(
        "Simulation Failed In Upperbound Corase Search, On Func:",
        _func.name,
        e
      );
    }

    // Reverting to the checkpoint
    await _provider.send("evm_revert", [preCheckpoint]);

    // If The transaction went through, then we are yet to hit an upperbound
    if (result && result.logs && result.logs.length > 0) {
      console.log(
        `Success in Upperbound On Func ${_func.name}, Amount: ${amtAttempt}, Iteration: ${i}, Arguments:`,
        `Logs In Current Receipt: ${result.logs.length}`
      );

      // Otherwise, lowerbound == upperbound (since we know it goes through, there is no need to set it to anything lower than that),
      // And Upperbound *= 2, since we want to find an upperbound where the transaction does not go through
      lowerBound = upperBound;
      upperBound *= 2n;

      // If the amount being attempted is 0, we break the loop
      if (amtAttempt == 0n) {
        console.log("UpperBound is 0, returning");
        break;
      }
    } else {
      // if it fails then we found a generic, coarse upperbound to make sure we are not searching within too small of a range,
      // Whilst still remaining efficient
      console.log(
        `Failure in Upperbound On Func ${_func.name}, Amount: ${amtAttempt}, Iteration: ${i}, Arguments:`,
        `Logs In Current Receipt: ${result?.logs?.length}`
      );
      break;
    }

    // If there are no arguments, and the transaction went through - there is no need to simulate furhter
    if (_args.length <= 0) {
      break;
    }

    // If there is no amount argument (e.g just static arguments), then we break the loop, as there is no need to simulate any further
    if (!hasAmountArg) {
      break;
    }
  }
  return {
    upperBound,
    lowerBound,
  };
};
