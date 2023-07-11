/**
 * Reguler swap action for lifi
 */
import { AbiCoder, JsonRpcProvider, Contract } from "ethers";
import {
  NULLISH_COMMAND,
  YcCommand,
  abiDecodeBatch,
  address,
} from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import { OffchainRequest } from "../../../../types.js";
import { LIFI_MAX_RETRIES } from "../../constants.js";

export const lifiSwap = async (
  actionRequest: OffchainRequest,
  provider: JsonRpcProvider,
  attempt: number = 0
): Promise<YcCommand> => {
  const [fromToken, toToken, fromAmount] = abiDecodeBatch(actionRequest.args, [
    "address",
    "address",
    "uint256",
  ]) as unknown as [address, address, bigint];

  const fromChain: number = Number((await provider.getNetwork()).chainId);

  const toChain: number = fromChain;

  if (fromAmount == 0n) return NULLISH_COMMAND;

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
    if (attempt > LIFI_MAX_RETRIES) return NULLISH_COMMAND;
    return lifiSwap(actionRequest, provider, attempt + 1);
  }
};
