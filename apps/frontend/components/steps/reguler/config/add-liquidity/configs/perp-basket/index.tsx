/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallPerpBasketAddLiquidityConfig } from "./small";
import { MediumPerpBasketAddLiquidityConfig } from "./medium";

/* eslint-disable react/display-name */
export const AddLiquidityPerpBasketConfig = forwardRef<
  HTMLDivElement,
  StepProps
>(({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
  switch (step.size) {
    case StepSizing.SMALL:
      return (
        <SmallPerpBasketAddLiquidityConfig
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
        <MediumPerpBasketAddLiquidityConfig
          step={step}
          style={style}
          triggerComparison={triggerComparison}
          ref={ref}
          {...props}
          canvasID={canvasID}
        />
      );
  }
});
