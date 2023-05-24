/**
 * Types for the automation config
 */

import { Timestamps } from "@yc/yc-models";

export const TIMESTAMPS_TO_VALUE_IN_SECONDS: { [key in Timestamps]: number } = {
  [Timestamps.Minutes]: 60,
  [Timestamps.Hours]: 3600,
  [Timestamps.Days]: 86400,
  [Timestamps.Weeks]: 604800,
  [Timestamps.Months]: 2630000,
  [Timestamps.Years]: 31536000,
};
