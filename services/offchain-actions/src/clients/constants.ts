/**
 * Constants for the offchain clients
 */

import { FunctionCallStruct, YcCommand, address } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
import { lifiSwap, lifiSwapReverse } from "./lifi/index.js";

// Map requested onchain functions => actual offchain functios
export const OffchainActions: Record<
  string,
  (
    requestedCommand: FunctionCallStruct,
    provider: JsonRpcProvider
  ) => Promise<YcCommand>
> = {
  lifiSwap: lifiSwap,
  lifiSwapReverse: lifiSwapReverse,
};
