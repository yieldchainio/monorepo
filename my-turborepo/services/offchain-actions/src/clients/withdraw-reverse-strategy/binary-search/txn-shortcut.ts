import {
  address,
  EthersExecutor,
  EthersJsonRpcProvider,
  EthersProvider,
  EthersReceipt,
  ExtendedReceipt,
  SimplifiedFunction,
} from "../../../offchain-types";
import { encoding } from "../../../offchain-utils/generic-utils/Encoding.js";

const searchTxidShortcut = async (
  _provider: EthersJsonRpcProvider,
  _contractAddress: address,
  _func: SimplifiedFunction,
  _funcToCall: string,
  _args: any[],
  _abi: any,
  _executor: EthersExecutor,
  _transactionFunction: Function
): Promise<EthersReceipt | ExtendedReceipt | null> => {
  let result = await _transactionFunction(
    _provider,
    _contractAddress,
    _func,
    [
      "callback_post",
      [
        ...(await Promise.all(
          _args.map(
            async (arg) =>
              await encoding(
                _provider,
                _contractAddress,
                arg.value,
                arg.solidity_type,
                _abi
              )
          )
        )),
      ],
    ],
    _executor
  );

  return result;
};

export default searchTxidShortcut;
