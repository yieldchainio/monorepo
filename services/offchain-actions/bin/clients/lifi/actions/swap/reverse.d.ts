/**
 * Reguler swap action for lifi
 */
import { JsonRpcProvider } from "ethers";
import { FunctionCallStruct, YcCommand } from "@yc/yc-models";
export declare const lifiSwapReverse: (functionRequest: FunctionCallStruct, provider: JsonRpcProvider) => Promise<YcCommand>;
