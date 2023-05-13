/**
 * A class representing a single statistic row
 * for a strategy
 */
export class YCStatistic {
    id;
    strategyId;
    timestamp;
    apy;
    gasFee;
    constructor(statistic) {
        this.id = statistic.id;
        this.strategyId = statistic.strategy_id;
        this.timestamp = statistic.timestamp;
        this.apy = statistic.apy;
        this.gasFee = BigInt(statistic.gasFee);
    }
}
//# sourceMappingURL=statistic.js.map