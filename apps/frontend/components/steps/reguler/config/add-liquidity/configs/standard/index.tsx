/**
 * A Head Config component for the Add Liquidity action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallStandardAddLiquidityConfig } from "./small";
import { MediumStandardAddLiquidityConfig } from "./medium";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const AddLiquidityStandardConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallStandardAddLiquidityConfig ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumStandardAddLiquidityConfig ref={ref} {...props} />;
    }
  }
);
