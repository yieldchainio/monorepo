/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing, StepType } from "utilities/classes/step/types";
import { StepProps } from "../../types";
import { forwardRef } from "react";
import { SmallCompleteTrigger } from "./small";
import { MediumCompleteTrigger } from "./medium";

export const TriggerCompleteStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, triggerComparison, style, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding step component depending on type & size
     */

    /**
     * Switch case to return corresponding complete component depending on size
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallCompleteTrigger
            step={step}
            ref={ref}
            style={style}
            triggerComparison={triggerComparison}
            {...props}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <MediumCompleteTrigger
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
