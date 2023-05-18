/**
 * Reguler swap action for lifi
 */
import { AbiCoder, JsonRpcProvider } from "ethers";
import { FunctionCallStruct, YcCommand, address } from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";

export const lifiSwapReverse = async (
  functionRequest: FunctionCallStruct,
  provider: JsonRpcProvider
): Promise<YcCommand> => {
  const toToken = AbiCoder.defaultAbiCoder().decode(
    ["address"],
    functionRequest.args[0]
  )[0] as address;

  const fromToken = AbiCoder.defaultAbiCoder().decode(
    ["address"],
    functionRequest.args[1]
  )[0] as address;

  const fromAmount = AbiCoder.defaultAbiCoder().decode(
    ["uint256"],
    functionRequest.args[2]
  )[0] as bigint;

  const fromChain: number = Number((await provider.getNetwork()).chainId);

  const toChain: number = fromChain;

  const request = await lifiQuote(
    fromToken,
    toToken,
    fromAmount.toString() as `${number}`,
    fromChain,
    toChain
  );

  if (!request.transactionRequest?.data)
    throw "Cannot Complete lifiSwapReverse - Transaction Request Data Undefined";

  const swapCommand: YcCommand = buildSwapCommand(request);

  return swapCommand;
};
