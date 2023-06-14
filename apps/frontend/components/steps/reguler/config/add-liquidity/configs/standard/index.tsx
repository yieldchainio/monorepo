/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallStandardAddLiquidityConfig } from "./small";
import { MediumStandardAddLiquidityConfig } from "./medium";

/* eslint-disable react/display-name */
export const AddLiquidityStandardConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallStandardAddLiquidityConfig
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
          <MediumStandardAddLiquidityConfig
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
