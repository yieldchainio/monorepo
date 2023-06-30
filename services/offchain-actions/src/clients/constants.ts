/**
 * Constants for the offchain clients
 */

import { FunctionCallStruct, YcCommand, address } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
import { lifiSwap, lifiSwapReverse } from "./lifi/index.js";
import { OffchainRequest } from "../types.js";

// Map requested onchain functions => actual offchain functios
export const OffchainActions: Record<
  string,
  (
    requestedAction: OffchainRequest,
    provider: JsonRpcProvider
  ) => Promise<YcCommand>
> = {
  lifiSwap: lifiSwap,
  lifiSwapReverse: lifiSwapReverse,
};
