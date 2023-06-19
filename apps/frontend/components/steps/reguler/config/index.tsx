/**
 * Head config component, switch-case for different configs based on actionConfig enum proprety on the step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { ActionConfigs } from "utilities/classes/step/types";
import { SwapConfig } from "./swap";
import { AddLiquidityConfig } from "./add-liquidity";
import { StakeConfig } from "./stake";
import { HarvestConfig } from "./harvest";
import { SupplyConfig } from "./supply";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const ActionConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ ...props }: StepProps, ref) => {
    const { step } = useStepContext();
    /**
     * Switch case to return corresponding action config component based on the enum proprety actionConfigs
     */
    switch (step.actionConfig) {
      case ActionConfigs.SWAP:
        return <SwapConfig ref={ref} {...props} />;

      case ActionConfigs.LP:
        return <AddLiquidityConfig ref={ref} {...props} />;

      case ActionConfigs.STAKE:
        return <StakeConfig ref={ref} {...props} />;

      case ActionConfigs.HARVEST:
        return <HarvestConfig ref={ref} {...props} />;

      case ActionConfigs.SUPPLY:
        return <SupplyConfig ref={ref} {...props} />;

      default:
        return null;
    }
  }
);
