/**
 * Reguler swap action for lifi
 */
import { JsonRpcProvider } from "ethers";
import { FunctionCallStruct, YcCommand, address } from "@yc/yc-models";
export declare const lifiSwapReverse: (functionRequest: FunctionCallStruct, strategyAddress: address, provider: JsonRpcProvider) => Promise<YcCommand>;
