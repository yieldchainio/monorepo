/**
 * Types for the add liquidity config
 */

import { DBProtocol, DBToken } from "@yc/yc-models";

export interface AddLiquidityData {
  tokenA: DBToken;
  tokenB: DBToken;
  protocol: DBProtocol;
}
