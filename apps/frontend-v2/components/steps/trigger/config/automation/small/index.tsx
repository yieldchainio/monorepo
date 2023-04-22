/**
 * Small-sized config for the automation trigger
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { BaseTriggerConfig } from "../../base";

export const SmallAutomationConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    return (
      <BaseTriggerConfig
        className="flex-col px-0 py-2.5 gap-4 items-start"
        style={style}
        ref={ref}
        {...props}
        canvasID={canvasID}
        width="246px"
        height="220.5px"
        step={step}
        triggerComparison={triggerComparison}
        handleComplete={() => {}}
      >
        Small Automation
      </BaseTriggerConfig>
    );
  }
);
