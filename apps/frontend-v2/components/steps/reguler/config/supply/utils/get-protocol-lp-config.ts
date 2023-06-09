/**
 * Get corresponding LP config for a protocol, fallback to UNIV2
 */

import { ProtocolType } from "@prisma/client";
import {
  AddLiquidityPerpBasketConfig,
  AddLiquidityStandardConfig,
} from "../configs/index";
import { Step } from "utilities/classes/step/index";

export function getProtocolLpConfig(step: Step) {
  // Perps/Futures DEXs which have a token as LP representing a basket of assets (e.g, GLP, MLP...)
  if (step.protocol?.types.includes(ProtocolType.PERPBASKETLP))
    return AddLiquidityPerpBasketConfig;

  // UniV2 Forks Are Pretty Standard
  if (step.protocol?.types.includes(ProtocolType.UNIV2LP))
    return AddLiquidityStandardConfig;

  // Standard config as fallback
  return AddLiquidityStandardConfig;
}
