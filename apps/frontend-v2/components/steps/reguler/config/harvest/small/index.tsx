/**
 * A Small Add Liquidity Config component
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useEffect, useMemo } from "react";
import { BaseActionConfig } from "../../base";

import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { useHarvest } from "../hooks/useHarvest";
import WrappedText from "components/wrappers/text";
import { PositionsDropdown } from "../components/positions-dropdown";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import { completeHarvest } from "../utils/complete-harvest";

export const SmallHarvestConfig = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Get the harvestable functions
     */
    const { choosePosition, harvestFunctions, harvestFunction } = useHarvest(
      step,
      triggerComparison
    );

    useEffect(() => {
      step.setFunction(harvestFunction);
    }, [harvestFunction]);

    /**
     * Get portal to canvas (for tooltips)
     */
    const canvasPortal = useElementPortal(canvasID);

    // Return the JSX
    return (
      <BaseActionConfig
        className="flex-col px-0 py-2.5 gap-4 items-start"
        style={style}
        ref={ref}
        {...props}
        canvasID={canvasID}
        width="246px"
        height="220.5px"
        step={step}
        triggerComparison={triggerComparison}
        handleComplete={() => completeHarvest(step)}
      >
        <InfoProvider
          contents="Choose Position"
          portal={canvasPortal}
          direction={ToolTipDirection.LEFT}
        >
          <div className="w-full flex flex-col">
            <PositionsDropdown
              functions={harvestFunctions}
              setChoice={choosePosition}
              choice={harvestFunction}
            />
          </div>
        </InfoProvider>
      </BaseActionConfig>
    );
  }
);
