import { encoding } from "../../../offchain-utils/generic-utils/Encoding.js";
import getABI from "../../../offchain-utils/ABIs/getStrategyABI.js";
import toBigInt from "../../../offchain-utils/generic-utils/ToBigInt.js";
const abi = await getABI();
export const SearchCoarseLowerbound = async (_provider, _executor, _transactionFunction, _contractAddress, _func, _args, _key, // Key being iterated over / simulated right now
_upperBound, _lowerBound) => {
    // The function that will be used to send the transaction
    let transactionFunction = _transactionFunction;
    // The key being iterated over / simulated right now
    let key = _key;
    // The upper and lower bounds of the amount being simulated
    let upperBound = _upperBound;
    // The lower bound of the amount being simulated
    let lowerBound = _lowerBound;
    // Doing the simulation Iteration
    for (let i = 0; i < 100; i++) {
        // Taking a checkpoint before the simulation
        let preCheckpoint = await _provider.send("evm_snapshot", []);
        // The amount being attempted in the current iteration, always the lowerbound
        let amtAttempt = lowerBound;
        // Mapping the args - if an arg's identifier is equal ot the current key, we set its value as the current amount attempt
        let args = _args.length <= 0
            ? []
            : _args.map((arg) => {
                return {
                    ...arg,
                    value: Array.isArray(arg.value)
                        ? arg.value.map((_arg) => {
                            if (typeof _arg == "string" && _arg.includes("_BALANCE"))
                                return amtAttempt.toString();
                            else
                                return _arg;
                        })
                        : typeof arg.value == "string" && arg.value.includes("_BALANCE")
                            ? amtAttempt.toString()
                            : arg.value,
                };
            });
        // TODO: Figure out how a simulation w 2 parameters work. because whilst simulating 1 parameter, the other has to be another. And they may be directly correlated (e.g liq prov)
        // The result of the simulation, initially null
        let result = null;
        // Wrapped in a try-catch, since the simulation may fail (and it should as a part of the process)
        try {
            // Call the transaction function with the current args
            result = await transactionFunction(_provider, _contractAddress, _func, [
                "callback_post",
                [
                    ...(await Promise.all(args.map(async (argument) => await encoding(_provider, _contractAddress, argument.value, argument.solidity_type, abi)))),
                ],
            ], _executor);
        }
        catch (e) {
            console.error("Simulation Failed In Lowerbound Corase Search, On Func:", _func.name, e);
        }
        // Reverting to the checkpoint
        await _provider.send("evm_revert", [preCheckpoint]);
        // If The transaction went through, it means we found a sufficient lowerbound and do not need to search further down.
        if (result && result.logs && result.logs.length > 0) {
            console.log(`Success in Lowerbound On Func ${_func.name}, Amount: ${amtAttempt}, Iteration: ${i}`, `Logs In Current Receipt: ${result.logs.length}`);
            break;
            // Else, we want to set the upperbound to the current lowerbound (since we know it does not work, anyway), and split the lowerbound to retry again
        }
        else {
            console.log(`Failure in Lowerbound On Func ${_func.name}, Amount: ${amtAttempt}, Iteration: ${i}, Arguments: `, `Logs In Current Receipt: ${result?.logs?.length}`);
            upperBound = lowerBound;
            lowerBound = toBigInt(Number(lowerBound) / 2); // Incase the number goes below 1
            if (amtAttempt == 0n) {
                console.log("Lowerbound is 0, returning");
                break;
            }
        }
        // If there are no arguments, and the transaction went through - there is no need to simulate furhter
        if (_args.length <= 0) {
            break;
        }
    }
    return {
        upperBound,
        lowerBound,
    };
};
//# sourceMappingURL=coarse-lowerbound.js.map