import { ethers } from "ethers";
import erc20abi from "../../../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
import { encoding } from "../../../offchain-utils/generic-utils/Encoding.js";
import { sendRawTransaction } from "../../../offchain-utils/transaction-utils/RawTransaction.js";
import { callCallbackFunction } from "../../../offchain-utils/transaction-utils/CallbackFunction.js";
import { SearchCoarseLowerbound } from "./coarse-lowerbound.js";
import { SearchCoarseUpperbound } from "./coarse-upperbound.js";
import { MainBinarySearch } from "./main.js";
import getABI from "../../../offchain-utils/ABIs/getStrategyABI.js";
const abi = await getABI();
/*---------------------------------------------------------------
    // @Simulation binary-searcher of an upper limit for amount parameters
----------------------------------------------------------------*/
const simulateFunction = async (_provider, _contractAddress, _func, _args, _tokensList, divideBy, _executor) => {
    // @notice checking if the function is a callback one (i.e requires offchain waiting)
    let isCallback = _func.is_callback;
    // A mapping of tokens to their balances before anything happpens
    let preTokensMapping = new Map();
    // Pushing balances to the mapping
    for await (const token of _tokensList) {
        preTokensMapping.set(token.address, await new ethers.Contract(token.address, erc20abi, _executor).balanceOf(_contractAddress));
    }
    // A variable to check if callback should be simulated.
    let shouldSimulateCallback = false;
    // Run this block of code if the function is a callback function
    if (isCallback) {
        // If one of the args is an amount arg (i.e it include "_BALANCE" in it's value), then we need to simulate. Otherwise, it's just fixed hardcoded arguments
        for (const arg of _args) {
            if (arg.value.includes("_BALANCE")) {
                shouldSimulateCallback = true;
                break;
            }
        }
        // If we do not need to simulate the callback function, we simply return the arguments as-is to call with
        if (!shouldSimulateCallback) {
            let balanceBooleanMapping = new Map();
            for (const tokenAddress of _tokensList) {
                balanceBooleanMapping.set(tokenAddress.address, false);
            }
            return {
                argsForCall: await Promise.all(_args.map(async (arg) => await encoding(_provider, _contractAddress, arg.value, arg.solidity_type, abi))),
                sharesCalculatedMapping: balanceBooleanMapping,
                shouldKeepFunction: true,
            };
        }
    }
    // Mapping args that are supposed to receive a token amount into them
    let amountArgMapping = new Map();
    // The mapping that specifies for each token, whether the inflows of it are already calculated by the withdrawing user's shares,
    // Or whether they belong to the entire vault (Determines by looking at the differences between different attempts)
    let sharesCalculatedTokensMapping = new Map();
    // Pushing the amount-related arguments to the mapping
    // TODO: Integrate the new formatting where it bundles them into groups, so that multiple arguments can be simulated
    // TODO: simultaneously (e.g, when you need to add liquidity to a pool, you need to simulate both the tokenA and tokenB amounts)
    for await (const arg of _args) {
        try {
            // We check if the argument is considered a "token amount" argument by checking if it's value includes "_BALANCE",
            // If it does, we push it to the mapping so we can simulate a binary search on it
            if (typeof arg.value === "string" && arg.value.includes("_BALANCE")) {
                amountArgMapping.set(arg.parameter_identifier, arg.value);
            }
            else if (Array.isArray(arg.value)) {
                if (arg.value.find((_arg) => _arg.includes("_BALANCE")))
                    amountArgMapping.set(arg.parameter_identifier, arg.value);
            }
        }
        catch (e) {
            console.log("Arg Failed!!!!", arg);
            throw e;
        }
    }
    // Which function to call the simulations with (RawTransaction VS CallbackFunction)
    let transactionFunction = shouldSimulateCallback ? callCallbackFunction : sendRawTransaction;
    // A variable to check if the function should be kept in the final transaction list, if it fails completely with no successes, this will be false,
    // And it will not be executed on mainnet
    let shouldKeepFunction = true;
    // Running the binary bruteforce loop on each one of the arguments requiring amount-finding simulation
    let mappingIterator = [...amountArgMapping.entries()];
    // Iteration times - Either the lenght of the mapping or 1, if there are no amount arguments (we still want to know if it should be used or not)
    let iterationTimes;
    if (mappingIterator.length > 0)
        iterationTimes = mappingIterator.length;
    else
        iterationTimes = 1;
    // Starting the iteration on each amount argument
    for (let i = 0; i < iterationTimes; i++) {
        // The key of the argument in the mapping
        let key = mappingIterator[i] ? mappingIterator[i][0] : -1;
        // Starting Upperbound & Lowerbounds
        let upperBound = 1000000000000000000000000n;
        let lowerBound = 10000000000000000n;
        /**
         * @notice doing an initial coarse search to find a general upperbound
         */
        // We do not want to simulate upperbounds for callback
        if (!isCallback) {
            ({ upperBound, lowerBound } = await SearchCoarseUpperbound(_provider, _executor, transactionFunction, _contractAddress, _func, _args, key, upperBound, lowerBound));
        }
        /**
         * @notice doing an initial coarse search to find a general LOWERbound
         */
        // We do not want to simulate upperbounds for callback
        if (!isCallback) {
            ({ upperBound, lowerBound } = await SearchCoarseLowerbound(_provider, _executor, transactionFunction, _contractAddress, _func, _args, key, upperBound, lowerBound));
        }
        /**
         * @notice doing the main binary search
         * @return amountToSet: the amount to set in the argument
         * @return sharesCalculatedMapping: a mapping of tokens to whether their inflows are calculated by the user's shares or not.
         * This will only be used for the last key iteration, and will determine whether each token inflow belongs to the specfic user / to the entire vault
         */
        let { amountToSet, sharesCalculatedMapping, keepFunction } = await MainBinarySearch(_provider, _executor, transactionFunction, _contractAddress, _func, _args, key, isCallback, upperBound, lowerBound, _tokensList, divideBy);
        /**
         * @notice
         * if the main binary search function returned false for the 'keepFunction' variable,
         * it means that the function is not executable and therefore should be emitted out of our operation
         */
        if (!keepFunction) {
            shouldKeepFunction = false;
            break;
        }
        // Setting the amount in the arg mapping
        amountArgMapping.set(key, amountToSet);
        // If the current iteration is the last one, we set the sharesCalculatedMapping to the global variable (Will be used later on when transferring tokens to the user)
        if (i == mappingIterator.length - 1) {
            sharesCalculatedTokensMapping = sharesCalculatedMapping;
        }
    }
    let newArgs = [
        "callback_post",
        await Promise.all(_args.map(async (arg) => {
            if (amountArgMapping.has(arg.parameter_identifier)) {
                const setAmount = amountArgMapping
                    .get(arg.parameter_identifier)
                    .toString();
                const value = !Array.isArray(arg.value)
                    ? setAmount
                    : arg.value.map((arg) => typeof arg == "string" && arg.includes("_BALANCE")
                        ? setAmount
                        : arg);
                return ethers.AbiCoder.defaultAbiCoder().encode([arg.solidity_type], [value]);
            }
            else {
                return await encoding(_provider, _contractAddress, arg.value, arg.solidity_type, abi);
            }
        })),
    ];
    return {
        argsForCall: newArgs,
        sharesCalculatedMapping: sharesCalculatedTokensMapping,
        shouldKeepFunction: shouldKeepFunction,
    };
};
export default simulateFunction;
//# sourceMappingURL=simulate-amounts.js.map