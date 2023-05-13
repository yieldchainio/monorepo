import { EthersJsonRpcProvider } from "../../offchain-types.js";
import { ForkResponse } from "./fork-types.js";
export declare const forkSnapshot: (_provider: EthersJsonRpcProvider) => Promise<ForkResponse>;
