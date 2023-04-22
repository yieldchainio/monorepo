/**
 * useAutomation hook,
 * used by Automation configs
 */

import { useEffect, useState } from "react";
import { AutomationData, Timestamps } from "../../types";
import { StepProps } from "components/steps/types";
import { makeInterval } from "../../utils/make-interval";

export const useAutomation = ({ step, triggerComparison }: StepProps) => {
  /**
   * States to keep track of the input
   */
  const [intervalInput, setIntervalInput] = useState<number>(1);
  const [timestamp, setTimestamp] = useState<Timestamps>(Timestamps.DAYS);

  /**
   * Function to choose the interval input
   */
  const chooseInterval = (interval: number) => {
    if (!interval) return;

    (step.data.automation as AutomationData | undefined) = {
      ...(step.data?.automation || {}),
      input: interval,
      interval: makeInterval(interval, timestamp),
    };

    triggerComparison();
  };

  /**
   * Function to choose the timestamp
   */
  const chooseTimestamp = (timestamp: Timestamps) => {
    if (!timestamp) return;

    (step.data.automation as AutomationData | undefined) = {
      ...(step.data?.automation || {}),
      timestamp,
      interval: makeInterval(intervalInput, timestamp),
    };

    triggerComparison();
  };

  /**
   * useEffect running on data change, setting our states
   */
  useEffect(() => {
    // Shorthand of the data w/ typing
    const data = step.data?.automation as AutomationData | undefined;
    if (!data) return;

    if (data.input) setIntervalInput(data.input);
    if (data.timestamp) setTimestamp(data.timestamp);
  }, [
    step.data,
    step.data?.automation,
    step.data?.automation?.input,
    step.data?.automation?.timestamp,
  ]);

  return { chooseInterval, chooseTimestamp, timestamp, intervalInput };
};
