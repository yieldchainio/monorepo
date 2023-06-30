/**
 * Quote from the Li.Fi API
 */

import { address } from "@yc/yc-models";
import { LifiQuote, LifiQuoteRequest, lifiQuoteRequestURL } from "../types.js";
import { LIFI_BASE_QUOTE_URL } from "../constants.js";
import axios from "axios";

export async function lifiQuote(
  fromToken: address,
  toToken: address,
  fromAmount: `${number}`,
  fromAddress: address,
  fromChain: number,
  toChain: number = fromChain
): Promise<LifiQuote> {
  const requestURL: lifiQuoteRequestURL = `${LIFI_BASE_QUOTE_URL}?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=${fromAddress}&integrator=${"yieldchain.io"}`;
  console.log("About to get lifi res...");
  const res = (await axios.get<LifiQuote>(requestURL)).data;
  console.log("Got lifi res", res);
  return res;
}
