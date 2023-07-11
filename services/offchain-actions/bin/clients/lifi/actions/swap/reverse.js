import { NULLISH_COMMAND, abiDecode } from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
export const lifiSwapReverse = async (actionRequest, provider) => {
    const fromToken = abiDecode(actionRequest.args[0], "address");
    const toToken = abiDecode(actionRequest.args[1], "address");
    const fromAmount = abiDecode(actionRequest.args[2], "uint256");
    const fromChain = Number((await provider.getNetwork()).chainId);
    const toChain = fromChain;
    if (fromAmount == 0n)
        return NULLISH_COMMAND;
    try {
        const request = await lifiQuote(fromToken, toToken, fromAmount.toString(), actionRequest.initiator, fromChain, toChain);
        if (!request.transactionRequest?.data)
            throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";
        const swapCommand = buildSwapCommand(request);
        return swapCommand;
    }
    catch (e) {
        console.error("Lifiswap Error:", e);
        return NULLISH_COMMAND;
    }
};
//# sourceMappingURL=reverse.js.map