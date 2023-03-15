import { JsonRpcProvider, TransactionReceipt } from "ethers";
export declare const getTransactionHistory: (provider: JsonRpcProvider, address: string, oldestBlock?: number) => Promise<Array<TransactionReceipt>>;
