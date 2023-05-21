/**
 * Create a fork
 */
import { SupportedYCNetwork } from "@yc/yc-models";
import { Fork } from "@yc/anvil-ts";
export declare function createFork(network: SupportedYCNetwork): Promise<Fork>;
