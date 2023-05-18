/**
 * Create a fork
 */
import { SupportedYCNetwork } from "@yc/yc-models";
import { JsonRpcProvider } from "ethers";
export declare function createFork(network: SupportedYCNetwork): Promise<JsonRpcProvider>;
