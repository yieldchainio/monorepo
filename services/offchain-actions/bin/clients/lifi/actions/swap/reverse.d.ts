/**
 * Reguler swap action for lifi
 */
import { JsonRpcProvider } from "ethers";
import { YcCommand } from "@yc/yc-models";
import { OffchainRequest } from "../../../../types.js";
export declare const lifiSwapReverse: (actionRequest: OffchainRequest, provider: JsonRpcProvider) => Promise<YcCommand>;
