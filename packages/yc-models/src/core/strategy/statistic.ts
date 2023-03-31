/**
 * A class representing a single statistic row
 * for a strategy
 */

import { DBStatistic } from "../../types";

export class YCStatistic {
  readonly id: string;
  readonly strategyId: string;
  readonly timestamp: Date;
  readonly apy: number;
  readonly gasFee: bigint;
  constructor(statistic: DBStatistic) {
    this.id = statistic.id;
    this.strategyId = statistic.strategy_id;
    this.timestamp = statistic.timestamp;
    this.apy = statistic.apy;
    this.gasFee = statistic.gasFee;
  }
}
