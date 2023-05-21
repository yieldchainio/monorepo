/**
 * Build a YC command from a swap quote
 * @param quote - Lifi quote object
 * @returns swapCommand - A YC command representing the swap
 */

import { LifiQuote, SWAP_DATA_TUPLE, SwapDataStruct } from "../../types.js";
import { Interface, ethers } from "ethers";
import LifiDiamondABI from "../../ABI.json" assert { type: "json" };
import {
  FunctionCallStruct,
  TypeflagValues,
  YCFunc,
  YcCommand,
  address,
  bytes32,
  encodeFixedYCCommand,
  encodeRefYCCommand,
  remove0xPrefix,
} from "@yc/yc-models";
import { Typeflags } from "@prisma/client";

export function buildSwapCommand(quote: LifiQuote): YcCommand {
  const lifiIface = new Interface(LifiDiamondABI);

  const calldata = quote.transactionRequest?.data;

  if (!calldata) throw "Cannot Build Lifi Swap Command - Quote Data Undefined";

  const parsedTransaction = lifiIface.parseTransaction({ data: calldata });

  if (!parsedTransaction)
    throw "Cannot Build Lifiswap Command - Parsing Quote Data Failed";

  const funcName = parsedTransaction.name;
  const args = parsedTransaction.args;
  const address = quote.transactionRequest?.to;
  if (!address)
    throw "Cannot Build Lifiswap - Transaction Request 'to' field undefined";

  if (args.length < 7)
    throw "Cannot Build Lifiswap Command - Received Less Than 7 Args.";

  const transactionID: YcCommand = encodeFixedYCCommand(args[0], "bytes32");
  const integrator: YcCommand = encodeRefYCCommand(args[1], "string");
  const referrer: YcCommand = encodeRefYCCommand(args[2], "string");
  const receiver: YcCommand = encodeFixedYCCommand(args[3], "address");
  const minAmount: YcCommand = encodeFixedYCCommand(args[4], "uint256");
  const swapData: YcCommand = encodeRefYCCommand(
    args[5] as SwapDataStruct[],
    SWAP_DATA_TUPLE
  );
  const requiresDeposit: YcCommand = encodeFixedYCCommand(args[6], "bool");

  const SwapFunctionCall: FunctionCallStruct = {
    target_address: address as address,
    args: [
      transactionID,
      integrator,
      referrer,
      receiver,
      minAmount,
      swapData,
      requiresDeposit,
    ],
    signature: funcName,
  };

  return (
    "0x" +
    TypeflagValues[Typeflags.CALL_COMMAND_FLAG] +
    TypeflagValues[Typeflags.VALUE_VAR_FLAG] +
    remove0xPrefix(
      ethers.AbiCoder.defaultAbiCoder().encode(
        [YCFunc.FunctionCallTuple],
        [SwapFunctionCall]
      )
    )
  );
}