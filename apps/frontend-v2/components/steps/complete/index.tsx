/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing } from "utilities/classes/step/types";
import { CompleteStepProps } from "./types";
import { SmallCompleteStep } from "./reguler/small";
import { MediumCompleteStep } from "./reguler/medium";
import { forwardRef } from "react";

export const CompleteStep = forwardRef<HTMLDivElement, CompleteStepProps>(
  ({ step, triggerComparison, ...props }: CompleteStepProps, ref) => {
    /**
     * Switch case to return corresponding step depending on size
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallCompleteStep step={step} ref={ref} {...props} triggerComparison={triggerComparison} />;

      case StepSizing.MEDIUM:
        return <MediumCompleteStep step={step} ref={ref} {...props} triggerComparison={triggerComparison} />;
    }
  }
);
