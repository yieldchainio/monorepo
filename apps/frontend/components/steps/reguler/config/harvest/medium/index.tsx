/**
 * A Small Harvest Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useHarvest } from "../hooks/useHarvest";
import WrappedText from "components/wrappers/text";
import { PositionsDropdown } from "../components/positions-dropdown";
import { completeHarvest } from "../utils/complete-harvest";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const MediumHarvestConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Get the harvestable functions
     */
    const { choosePosition, harvestFunctions, harvestFunction } = useHarvest();

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-8 items-start"
        ref={ref}
        {...props}
        width="327px"
        height="265.5px"
        handleComplete={() => completeHarvest(step)}
        canContinue={
          harvestFunction !== undefined || "Choose Position To Harvest"
        }
      >
        <div className="w-full flex flex-col gap-1">
          <WrappedText>Position To Harvest</WrappedText>
          <PositionsDropdown
            functions={harvestFunctions}
            setChoice={choosePosition}
            choice={harvestFunction}
          />
        </div>
      </BaseActionConfig>
    );
  }
);
