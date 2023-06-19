/**
 * useAutomation hook,
 * used by Automation configs
 */

import { useEffect, useState } from "react";
import { StepProps } from "components/steps/types";
import { makeInterval } from "../../utils/make-interval";
import { AutomationData, Timestamps } from "@yc/yc-models";
import { useStepContext } from "utilities/hooks/contexts/step-context";

export function useAutomation() {
  const { step, triggerComparison } = useStepContext();

  /**
   * States to keep track of the input
   */
  const [intervalInput, setIntervalInput] = useState<number>(
    step.data?.automation?.input || 1
  );
  const [timestamp, setTimestamp] = useState<Timestamps>(Timestamps.Days);

  /**
   * Function to choose the interval input
   */
  function chooseInterval(interval: number) {
    if (!interval) return;

    step.data.automation = {
      ...(step.data?.automation || {}),
      input: interval,
      interval: makeInterval(interval, timestamp),
    };

    triggerComparison();
  }

  /**
   * Function to choose the timestamp
   */
  function chooseTimestamp(timestamp: Timestamps) {
    if (!timestamp) return;

    step.data.automation = {
      ...(step.data?.automation || {}),
      timestamp,
      interval: makeInterval(intervalInput, timestamp),
    };

    triggerComparison();
  }

  /**
   * useEffect running on data change, setting our states
   */
  useEffect(() => {
    // Shorthand of the data w/ typing
    const data = step.data?.automation as AutomationData | undefined;
    if (!data) {
      setIntervalInput(1);
      setTimestamp(Timestamps.Days);
      return;
    }

    if (data.input) setIntervalInput(data.input);
    if (data.timestamp) setTimestamp(data.timestamp);
  }, [
    step.data,
    step.data?.automation,
    step.data?.automation?.input,
    step.data?.automation?.timestamp,
  ]);

  /**
   * useEffect running on our state change, changing the state's triggerDescription
   */
  useEffect(() => {
    // @ts-ignore
    // This works fine but screaming. Ignoring.
    const description = `Every ${intervalInput} ${Timestamps[timestamp]}`;
    step.triggerDescription = description;
  }, [intervalInput, timestamp]);

  // The initial choice

  return { chooseInterval, chooseTimestamp, timestamp, intervalInput };
}
