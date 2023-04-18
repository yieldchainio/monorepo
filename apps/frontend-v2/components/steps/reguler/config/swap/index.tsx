/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallSwapConfig } from "./small";
import { MediumSwapConfig } from "./medium";

export const SwapConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallSwapConfig
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <MediumSwapConfig
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
