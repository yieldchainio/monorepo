/**
 * Get corresponding LP config for a protocol, fallback to UNIV2
 */

import { ProtocolType } from "@prisma/client";
import {
  SupplyStandardConfig
} from "../configs/index";
import { Step } from "utilities/classes/step/index";

export function getProtocolSupplyConfig(step: Step) {
   // Standard config as fallback
  return SupplyStandardConfig;
}
