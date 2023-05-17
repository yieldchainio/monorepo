/**
 * Types for the onchain listener
 */

import { EthersJsonRpcProvider, YCNetwork, address } from "@yc/yc-models";
import { Log } from "ethers";

export interface SQSOnchainLog {
  log: Log;
  rpc_url: string;
}

export type SupportedYCNetwork = YCNetwork & {
  provider: EthersJsonRpcProvider,
  diamondAddress: address
}