/**
 * Types for the automation config
 */

import { Timestamps } from "@yc/yc-models";


export const TIMESTAMPS_TO_VALUE_IN_SECONDS: Record<Timestamps, number> = {
  [Timestamps.MINUTES]: 60,
  [Timestamps.HOURS]: 3600,
  [Timestamps.DAYS]: 86400,
  [Timestamps.WEEKS]: 604800,
  [Timestamps.MONTHS]: 2630000,
  [Timestamps.YEARS]: 31536000,
};

