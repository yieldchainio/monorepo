import { NULLISH_COMMAND, abiDecodeBatch, } from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import { LIFI_MAX_RETRIES } from "../../constants.js";
export const lifiSwap = async (actionRequest, provider, attempt = 0) => {
    const [fromToken, toToken, fromAmount] = abiDecodeBatch(actionRequest.args, [
        "address",
        "address",
        "uint256",
    ]);
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
        if (attempt > LIFI_MAX_RETRIES)
            return NULLISH_COMMAND;
        return lifiSwap(actionRequest, provider, attempt + 1);
    }
};
//# sourceMappingURL=swap.js.map