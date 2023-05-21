/**
 * Build a YC command from a swap quote
 * @param quote - Lifi quote object
 * @returns swapCommand - A YC command representing the swap
 */
import { SWAP_DATA_TUPLE } from "../../types.js";
import { Interface, ethers } from "ethers";
import LifiDiamondABI from "../../ABI.json" assert { type: "json" };
import { TypeflagValues, YCFunc, encodeFixedYCCommand, encodeRefYCCommand, remove0xPrefix, } from "@yc/yc-models";
import { Typeflags } from "@prisma/client";
export function buildSwapCommand(quote) {
    const lifiIface = new Interface(LifiDiamondABI);
    const calldata = quote.transactionRequest?.data;
    if (!calldata)
        throw "Cannot Build Lifi Swap Command - Quote Data Undefined";
    const parsedTransaction = lifiIface.parseTransaction({ data: calldata });
    if (!parsedTransaction)
        throw "Cannot Build Lifiswap Command - Parsing Quote Data Failed";
    const funcName = parsedTransaction.signature;
    const args = parsedTransaction.args;
    const address = quote.transactionRequest?.to;
    if (!address)
        throw "Cannot Build Lifiswap - Transaction Request 'to' field undefined";
    if (args.length < 6) {
        console.log("Args", args);
        throw "Cannot Build Lifiswap Command - Received Less Than 6 Args.";
    }
    const transactionID = encodeFixedYCCommand(args[0], "bytes32");
    const integrator = encodeRefYCCommand(args[1], "string");
    const referrer = encodeRefYCCommand(args[2], "string");
    const receiver = encodeFixedYCCommand(args[3], "address");
    const minAmount = encodeFixedYCCommand(args[4], "uint256");
    const swapData = encodeRefYCCommand(args[5], SWAP_DATA_TUPLE + "[]");
    const SwapFunctionCall = {
        target_address: address,
        args: [transactionID, integrator, referrer, receiver, minAmount, swapData],
        signature: funcName,
    };
    return ("0x" +
        TypeflagValues[Typeflags.CALL_COMMAND_FLAG] +
        TypeflagValues[Typeflags.VALUE_VAR_FLAG] +
        remove0xPrefix(ethers.AbiCoder.defaultAbiCoder().encode([YCFunc.FunctionCallTuple], [SwapFunctionCall])));
}
//# sourceMappingURL=build-swap.js.map