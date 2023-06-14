/**
 * A Head Config component for the Stake action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallStakeConfig } from "./small";
import { MediumStakeConfig } from "./medium";

/* eslint-disable react/display-name */
export const StakeConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallStakeConfig
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <MediumStakeConfig
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );
    }
  }
);
