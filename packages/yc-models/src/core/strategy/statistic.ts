/**
 * A class representing a single statistic row
 * for a strategy
 */

import { DBStatistic } from "../../types";

export class YCStatistic {
  readonly id: string;
  readonly strategyId: string;
  readonly timestamp: string;
  readonly apy: number;
  readonly gasFee: bigint;
  constructor(statistic: DBStatistic) {
    this.id = statistic.id;
    this.strategyId = statistic.strategy_id;
    this.timestamp = statistic.timestamp as string;
    this.apy = statistic.apy;
    this.gasFee = BigInt(statistic.gasFee);
  }
}
