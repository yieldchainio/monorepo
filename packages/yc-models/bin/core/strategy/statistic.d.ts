/**
 * A class representing a single statistic row
 * for a strategy
 */
import { DBStatistic } from "../../types/index.js";
export declare class YCStatistic {
    readonly id: string;
    readonly strategyId: string;
    readonly timestamp: string;
    readonly apy: number;
    readonly gasFee: bigint;
    constructor(statistic: DBStatistic);
}
