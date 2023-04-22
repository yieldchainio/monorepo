/**
 * Head config component, switch-case for different configs based on triggerConfig enum proprety on the step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { TriggerConfigs } from "utilities/classes/step/types";
import { AutomationConfig } from "./automation";

export const TriggerConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, triggerComparison, style, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding action config component based on the enum proprety actionConfigs
     */
    switch (step.triggerConfig) {
      case TriggerConfigs.AUTOMATION:
        return (
          <AutomationConfig
            step={step}
            triggerComparison={triggerComparison}
            style={style}
            ref={ref}
            {...props}
          />
        );
      default:
        return <div>{step.triggerConfig}</div>;
    }
  }
);
