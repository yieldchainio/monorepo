/**
 * Get corresponding LP config for a protocol, fallback to UNIV2
 */

import { YCProtocol } from "@yc/yc-models";
import { ProtocolType } from "@prisma/client";
import { AddLiquidityUniV2CompatibleConfig } from "../configs/index";
import { Step } from "utilities/classes/step/index";

export function getProtocolLpConfig(step: Step) {
  if (step.protocol?.types.includes(ProtocolType.UNIV2LP))
    return AddLiquidityUniV2CompatibleConfig;

  // Fallback
  return AddLiquidityUniV2CompatibleConfig;
}
