/**
 * Reguler Step Complete component.
 *
 * returns correct UI component based on sizing
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallCompleteStep } from "./small";
import { MediumCompleteStep } from "./medium";

export const RegulerCompleteStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, triggerComparison, style, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding complete component depending on size
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallCompleteStep
            step={step}
            ref={ref}
            style={style}
            triggerComparison={triggerComparison}
            {...props}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <MediumCompleteStep
            step={step}
            ref={ref}
            style={style}
            triggerComparison={triggerComparison}
            {...props}
          />
        );
    }
  }
);
