/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallUniV2AddLiquidityConfig } from "./small";
import { MediumUniV2AddLiquidityConfig } from "./medium";

export const AddLiquidityUniV2CompatibleConfig = forwardRef<
  HTMLDivElement,
  StepProps
>(({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
  switch (step.size) {
    case StepSizing.SMALL:
      return (
        <SmallUniV2AddLiquidityConfig
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
        <MediumUniV2AddLiquidityConfig
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
