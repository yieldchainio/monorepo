import { EthersLog } from "../../offchain-types.js";
type JsonRpcUrl = string;
export declare const handleCallbackEvent: (log: EthersLog, provider: JsonRpcUrl) => Promise<void>;
export {};
