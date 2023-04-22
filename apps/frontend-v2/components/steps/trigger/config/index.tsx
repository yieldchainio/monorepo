/**
 * Head config component, switch-case for different configs based on triggerConfig enum proprety on the step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { ActionConfigs } from "utilities/classes/step/types";

export const TriggerConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, triggerComparison, style, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding action config component based on the enum proprety actionConfigs
     */
    switch (step.triggerConfig) {
      default:
        return null;
    }
  }
);
