/**
 * Config component for the automation trigger,
 * Switch
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallAutomationConfig } from "./small";
import { MediumAutomationConfig } from "./medium";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const AutomationConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ ...props }: StepProps, ref) => {
    const { step } = useStepContext();
    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallAutomationConfig ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumAutomationConfig ref={ref} {...props} />;
    }
  }
);
