/**
 * A Head component for the reguler step's "Choose Action", renders out different components
 * based on size
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallChooseAction } from "./small";
import { MediumChooseAction } from "./medium";

export const RegulerChooseAction = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallChooseAction
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <MediumChooseAction
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
          />
        );
    }
  }
);
