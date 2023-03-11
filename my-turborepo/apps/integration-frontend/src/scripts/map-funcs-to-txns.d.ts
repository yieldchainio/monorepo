import { TransposeTxnWithLogs } from "src/types";
export declare const mapFuncsToTxns: (_txns: TransposeTxnWithLogs[], _abi: any, _idToFuncMapping: Map<number, Record<any, any>>) => Promise<Map<number, TransposeTxnWithLogs[]>>;
