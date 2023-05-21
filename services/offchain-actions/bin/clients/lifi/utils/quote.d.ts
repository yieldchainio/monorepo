/**
 * Quote from the Li.Fi API
 */
import { address } from "@yc/yc-models";
import { LifiQuote } from "../types.js";
export declare function lifiQuote(fromToken: address, toToken: address, fromAmount: `${number}`, fromAddress: address, fromChain: number, toChain?: number): Promise<LifiQuote>;
