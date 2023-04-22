/**
 * A Small Harvest Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { useHarvest } from "../hooks/useHarvest";

export const MediumHarvestConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Get the harvestable functions
     */
    const { choosePosition, harvestFunction, throwNoPositions } = useHarvest(
      step,
      triggerComparison
    );

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-8 items-start"
        style={style}
        ref={ref}
        {...props}
        canvasID={canvasID}
        width="327px"
        height="220.5px"
        step={step}
        triggerComparison={triggerComparison}
        handleComplete={() => null}
      ></BaseActionConfig>
    );
  }
);
