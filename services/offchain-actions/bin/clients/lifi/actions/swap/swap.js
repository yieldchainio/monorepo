import { abiDecode, } from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import { SELF_COMMAND } from "../../../../constants.js";
export const lifiSwap = async (functionRequest, strategyAddress, provider) => {
    console.log("Function Request ARgs", functionRequest.args);
    const fromToken = abiDecode(functionRequest.args[0], "address");
    const toToken = abiDecode(functionRequest.args[1], "address");
    const fromAmount = abiDecode(functionRequest.args[2], "uint256");
    console.log(fromToken);
    console.log(toToken);
    console.log("From Amount COmmand", fromAmount);
    const fromChain = Number((await provider.getNetwork()).chainId);
    const toChain = fromChain;
    if (fromAmount == 0n)
        return SELF_COMMAND;
    const request = await lifiQuote(fromToken, toToken, fromAmount.toString(), strategyAddress, fromChain, toChain);
    if (!request.transactionRequest?.data)
        throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";
    const swapCommand = buildSwapCommand(request);
    return swapCommand;
};
//# sourceMappingURL=swap.js.map