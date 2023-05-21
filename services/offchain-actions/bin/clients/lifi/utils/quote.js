/**
 * Quote from the Li.Fi API
 */
import { LIFI_BASE_QUOTE_URL } from "../constants.js";
import axios from "axios";
export async function lifiQuote(fromToken, toToken, fromAmount, fromAddress, fromChain, toChain = fromChain) {
    const requestURL = `${LIFI_BASE_QUOTE_URL}?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=${fromAddress}&integrator=${"yieldchain.io"}`;
    const res = (await axios.get(requestURL)).data;
    return res;
}
//# sourceMappingURL=quote.js.map