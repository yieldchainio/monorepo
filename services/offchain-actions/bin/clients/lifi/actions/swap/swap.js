/**
 * Reguler swap action for lifi
 */
import { Contract } from "ethers";
import { abiDecodeYCCommand, interpretYCCommand, } from "@yc/yc-models";
import { lifiQuote } from "../../utils/quote.js";
import { buildSwapCommand } from "../../utils/command-builders/build-swap.js";
import VaultAbi from "@yc/yc-models/src/ABIs/strategy.json" assert { type: "json" };
export const lifiSwap = async (functionRequest, strategyAddress, provider) => {
    const fromToken = abiDecodeYCCommand(functionRequest.args[0], "address");
    const toToken = abiDecodeYCCommand(functionRequest.args[1], "address");
    console.log("Function Request ARgs", functionRequest.args);
    const fromAmountCommand = functionRequest.args[2];
    const contract = new Contract(strategyAddress, VaultAbi, provider);
    const fromAmount = await interpretYCCommand(functionRequest.args[2], "uint256", contract);
    console.log("From Amount COmmand", fromAmountCommand);
    console.log("From AMount,", fromAmount);
    const fromChain = Number((await provider.getNetwork()).chainId);
    const toChain = fromChain;
    const request = await lifiQuote(fromToken, toToken, fromAmount.toString(), strategyAddress, fromChain, toChain);
    if (!request.transactionRequest?.data)
        throw "Cannot Complete Lifiswap - Transaction Request Data Undefined";
    const swapCommand = buildSwapCommand(request);
    return swapCommand;
};
//# sourceMappingURL=swap.js.map