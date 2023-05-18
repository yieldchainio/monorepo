import { Log } from "ethers";
import { YCNetwork } from "../core/index.js";
import { EthersJsonRpcProvider } from "./ethers.js";
import { address } from "./global.js";

export interface SQSOnchainLog {
  log: Log;
  rpc_url: string;
}

export type SupportedYCNetwork = YCNetwork & {
  provider: EthersJsonRpcProvider;
  diamondAddress: address;
};
