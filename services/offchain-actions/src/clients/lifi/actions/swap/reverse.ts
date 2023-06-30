/**
 * Reguler swap action for lifi
 */
import { AbiCoder, JsonRpcProvider } from "ethers";
import {
  FunctionCallStruct,
  YcCommand,
  abiDecode,
  abiDecodeYCCommand,
  address,
} from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import { SELF_COMMAND } from "../../../../constants.js";
import { OffchainRequest } from "../../../../types.js";

export const lifiSwapReverse = async (
  actionRequest: OffchainRequest,
  provider: JsonRpcProvider
): Promise<YcCommand> => {
  const fromToken = abiDecode<address>(actionRequest.args[0], "address");
  const toToken = abiDecode<address>(actionRequest.args[1], "address");
  const fromAmount = abiDecode<bigint>(actionRequest.args[2], "uint256");

  const fromChain: number = Number((await provider.getNetwork()).chainId);

  const toChain: number = fromChain;

  if (fromAmount == 0n) return SELF_COMMAND;

  try {
    const request = await lifiQuote(
      fromToken,
      toToken,
      fromAmount.toString() as `${number}`,
      actionRequest.initiator,
      fromChain,
      toChain
    );

    if (!request.transactionRequest?.data)
      throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";

    const swapCommand: YcCommand = buildSwapCommand(request);
    return swapCommand;
  } catch (e: any) {
    console.error("Lifiswap Error:", e);
    return SELF_COMMAND;
  }
};
