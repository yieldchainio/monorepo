/**
 * Head config component, switch-case for different configs based on triggerConfig enum proprety on the step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { TriggerConfigs } from "utilities/classes/step/types";
import { AutomationConfig } from "./automation";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const TriggerConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Switch case to return corresponding action config component based on the enum proprety actionConfigs
     */
    switch (step.triggerConfig) {
      case TriggerConfigs.AUTOMATION:
        return <AutomationConfig ref={ref} {...props} />;
      default:
        return <div>{step.triggerConfig}</div>;
    }
  }
);
