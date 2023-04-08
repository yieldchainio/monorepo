/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing } from "utilities/classes/step/types";
import { CompleteStepProps } from "./types";
import { SmallCompleteStep } from "./small";
import { MediumCompleteStep } from "./medium";
import { forwardRef } from "react";

export const CompleteStep = forwardRef<HTMLDivElement, CompleteStepProps>(
  ({ step, size, ...props }: CompleteStepProps, ref) => {
    /**
     * Switch case to return corresponding step depending on size
     */
    switch (size) {
      case StepSizing.SMALL:
        return <SmallCompleteStep step={step} ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumCompleteStep step={step} ref={ref} {...props} />;
    }
  }
);
