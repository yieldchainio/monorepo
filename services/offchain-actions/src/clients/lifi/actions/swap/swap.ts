/**
 * Reguler swap action for lifi
 */
import { AbiCoder, JsonRpcProvider, Contract } from "ethers";
import {
  FunctionCallStruct,
  YcCommand,
  abiDecodeYCCommand,
  address,
  bytes,
  interpretYCCommand,
} from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import VaultAbi from "@yc/yc-models/src/ABIs/strategy.json" assert { type: "json" };

export const lifiSwap = async (
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

  console.log("Function Request ARgs", functionRequest.args);

  const fromAmountCommand = functionRequest.args[2];

  const contract = new Contract(strategyAddress, VaultAbi, provider);

  const fromAmount = await interpretYCCommand<bigint>(
    functionRequest.args[2],
    "uint256",
    contract 
  );

  console.log("From Amount COmmand", fromAmountCommand);
  console.log("From AMount,", fromAmount);

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
    throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";

  const swapCommand: YcCommand = buildSwapCommand(request);

  return swapCommand;
};
