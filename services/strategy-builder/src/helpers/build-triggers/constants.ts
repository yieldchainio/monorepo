/**
 * Map TriggerType enum => Builder
 */

import { Trigger, YCStep, TriggerTypes } from "@yc/yc-models";
import { buildAutomationTrigger } from "./builders/automation.js";

const unsupportedTrigger = (step: YCStep) => {
  throw "Unsupported Trigger" + step.triggerType;
};

export const TRIGGER_BUILDERS: Record<TriggerTypes, (root: YCStep) => Trigger> =
  {
    [TriggerTypes.AUTOMATION]: buildAutomationTrigger,
    [TriggerTypes.DEPOSIT]: unsupportedTrigger,
    [TriggerTypes.WITHDRAWAL]: unsupportedTrigger,
  };
