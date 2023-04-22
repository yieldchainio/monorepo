/**
 * Make interval,
 * accepts a number and a timestamp and returns an interval in seconds
 */

import { TIMESTAMPS_TO_VALUE_IN_SECONDS, Timestamps } from "../types";

export const makeInterval = (input: number, timestamp: Timestamps) => {
  return input * TIMESTAMPS_TO_VALUE_IN_SECONDS[timestamp];
};
