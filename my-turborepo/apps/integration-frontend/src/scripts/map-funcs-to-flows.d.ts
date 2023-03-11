import { DBToken, TransposeTxnWithLogs } from "src/types";
export interface IFlow {
    token_details: DBToken;
    outflow0_or_inflow1: 0 | 1;
    percentageOfFuncTxns: number;
    chosen?: boolean;
}
export interface IFlowWithAmount extends IFlow {
    amount: bigint;
}
/**
 * Maps Function IDs to ERC20 Flows - Using a FuntionID => Transactions Mapping
 * @param _funcsToTxns
 * @returns
 */
export declare const mapFuncsToFlows: (_funcsToTxns: Map<number, TransposeTxnWithLogs[]>, _network: DBNetwork) => Promise<Map<number, IFlow[]>>;
