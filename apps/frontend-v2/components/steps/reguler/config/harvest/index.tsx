/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallHarvestConfig } from "./small";
import { MediumHarvestConfig } from "./medium";

export const SwapConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallHarvestConfig
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
          <MediumHarvestConfig
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
