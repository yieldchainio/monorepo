import { abiDecodeYCCommand, } from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
export const lifiSwap = async (functionRequest, strategyAddress, provider) => {
    const fromToken = abiDecodeYCCommand(functionRequest.args[0], "address");
    const toToken = abiDecodeYCCommand(functionRequest.args[1], "address");
    const fromAmount = abiDecodeYCCommand(functionRequest.args[2], "uint256");
    const fromChain = Number((await provider.getNetwork()).chainId);
    const toChain = fromChain;
    const request = await lifiQuote(fromToken, toToken, fromAmount.toString(), strategyAddress, fromChain, toChain);
    if (!request.transactionRequest?.data)
        throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";
    const swapCommand = buildSwapCommand(request);
    return swapCommand;
};
//# sourceMappingURL=swap.js.map