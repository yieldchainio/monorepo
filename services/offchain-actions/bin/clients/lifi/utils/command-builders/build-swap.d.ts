/**
 * Build a YC command from a swap quote
 * @param quote - Lifi quote object
 * @returns swapCommand - A YC command representing the swap
 */
import { LifiQuote } from "../../types.js";
import { YcCommand } from "@yc/yc-models";
export declare function buildSwapCommand(quote: LifiQuote): YcCommand;
