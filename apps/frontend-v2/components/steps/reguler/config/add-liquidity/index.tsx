/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallAddLiquidityConfig } from "./small";
import { MediumAddLiquidityConfig } from "./medium";

export const AddLiquidityConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    switch (step.size) {
      case StepSizing.SMALL:
        return (
          <SmallAddLiquidityConfig
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
          />
        );

      case StepSizing.MEDIUM:
        return (
          <MediumAddLiquidityConfig
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
