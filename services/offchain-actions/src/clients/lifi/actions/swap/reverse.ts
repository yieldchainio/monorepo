/**
 * Reguler swap action for lifi
 */
import { AbiCoder, JsonRpcProvider } from "ethers";
import {
  FunctionCallStruct,
  YcCommand,
  abiDecodeYCCommand,
  address,
} from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";

export const lifiSwapReverse = async (
  functionRequest: FunctionCallStruct,
  strategyAddress: address,
  provider: JsonRpcProvider
): Promise<YcCommand> => {
  const fromToken = abiDecodeYCCommand<address>(
    functionRequest.args[0],
    "address"
  );

  const toToken = abiDecodeYCCommand<address>(
    functionRequest.args[1],
    "address"
  );

  const fromAmount = abiDecodeYCCommand<bigint>(
    functionRequest.args[2],
    "uint256"
  );

  const fromChain: number = Number((await provider.getNetwork()).chainId);

  const toChain: number = fromChain;

  const request = await lifiQuote(
    fromToken,
    toToken,
    fromAmount.toString() as `${number}`,
    strategyAddress,
    fromChain,
    toChain
  );

  if (!request.transactionRequest?.data)
    throw "Cannot Complete lifiSwapReverse - Transaction Request Data Undefined";

  const swapCommand: YcCommand = buildSwapCommand(request);

  return swapCommand;
};
