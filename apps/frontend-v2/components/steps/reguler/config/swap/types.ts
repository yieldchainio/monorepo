/**
 * Types for the swap configs
 */

import { DBToken, YCToken } from "@yc/yc-models";

/**
 * Data structure of a swap config (saved generically on step for persistnace)
 */

export type SwapData = {
  fromToken: DBToken | null;
  toToken: DBToken | null;
};
