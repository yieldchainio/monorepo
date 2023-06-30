/**
 * Reguler swap action for lifi
 */
import { AbiCoder, JsonRpcProvider, Contract } from "ethers";
import {
  FunctionCallStruct,
  YcCommand,
  abiDecode,
  abiDecodeBatch,
  abiDecodeYCCommand,
  address,
  bytes,
  interpretYCCommand,
} from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import VaultAbi from "@yc/yc-models/src/ABIs/strategy.json" assert { type: "json" };
import { SELF_COMMAND } from "../../../../constants.js";
import { OffchainRequest } from "../../../../types.js";

export const lifiSwap = async (
  actionRequest: OffchainRequest,
  provider: JsonRpcProvider
): Promise<YcCommand> => {
  const [fromToken, toToken, fromAmount] = abiDecodeBatch(actionRequest.args, [
    "address",
    "address",
    "uint256",
  ]) as unknown as [address, address, bigint];

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
