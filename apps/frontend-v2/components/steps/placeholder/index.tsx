/**
 * A placeholder step used to add children to a parent step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { EmptySmallStep } from "./small";
import { EmptyMediumStep } from "./medium";

export const EmptyStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Switch case for the sizing
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <EmptySmallStep
            step={step}
            ref={ref}
            style={style}
            triggerComparison={triggerComparison}
            {...props}
            canvasID={canvasID}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <EmptyMediumStep
            step={step}
            ref={ref}
            style={style}
            triggerComparison={triggerComparison}
            {...props}
            canvasID={canvasID}
          />
        );
    }
  }
);
