/**
 * Called on the uproot tree after all iterations,
 * attempts to add swap functions for all unused inflows (scrapes)
 * @param uprootTree - The uproot tree
 * @param depositToken - The deposit token of the vault. We swap all tokens to it
 */
import { YCStep, YCToken } from "@yc/yc-models";
export declare function addScrapeSwaps(uprootTree: YCStep, depositToken: YCToken): void;
