/**
 * Head config component, switch-case for different configs based on actionConfig enum proprety on the step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { ActionConfigs } from "utilities/classes/step/types";
import { SwapConfig } from "./swap";
import { AddLiquidityConfig } from "./add-liquidity";
import { StakeConfig } from "./stake";

export const ActionConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, triggerComparison, style, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding action config component based on the enum proprety actionConfigs
     */
    switch (step.actionConfig) {
      case ActionConfigs.SWAP:
        return (
          <SwapConfig
            step={step}
            triggerComparison={triggerComparison}
            style={style}
            ref={ref}
            {...props}
          />
        );

      case ActionConfigs.LP:
        return (
          <AddLiquidityConfig
            step={step}
            triggerComparison={triggerComparison}
            style={style}
            ref={ref}
            {...props}
          />
        );

      case ActionConfigs.STAKE:
        return (
          <StakeConfig
            step={step}
            triggerComparison={triggerComparison}
            style={style}
            ref={ref}
            {...props}
          />
        );
      default:
        return null;
    }
  }
);
