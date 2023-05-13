import { EthersReceipt } from "./offchain-types.js";
export declare const handleCallbackEvent: (_log: string | object, shouldWait?: number) => Promise<EthersReceipt | null>;
