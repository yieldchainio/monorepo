/**
 * Reguler swap action for lifi
 */
import { AbiCoder } from "ethers";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
export const lifiSwap = async (functionRequest, provider) => {
    const fromToken = AbiCoder.defaultAbiCoder().decode(["address"], functionRequest.args[0])[0];
    const toToken = AbiCoder.defaultAbiCoder().decode(["address"], functionRequest.args[1])[0];
    const fromAmount = AbiCoder.defaultAbiCoder().decode(["uint256"], functionRequest.args[2])[0];
    const fromChain = Number((await provider.getNetwork()).chainId);
    const toChain = fromChain;
    const request = await lifiQuote(fromToken, toToken, fromAmount.toString(), fromChain, toChain);
    if (!request.transactionRequest?.data)
        throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";
    const swapCommand = buildSwapCommand(request);
    return swapCommand;
};
//# sourceMappingURL=swap.js.map