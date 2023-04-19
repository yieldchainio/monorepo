"use client";
import { StepsModal } from "components/steps-modal";
import { ConfigTitle } from "components/strategy-config-title";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";
import WrappedText from "components/wrappers/text";
/**
 * Base steps config for the strategy
 */

import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { useStrategyStore } from "utilities/hooks/stores/strategies";

const BaseStepsConfig = () => {
  // Get the current base step (Should be the root Deposit trigger)
  const rootStep = useStrategyStore((state) => state.step);

  // Rehydration function
  const rehydrateSteps = useStrategyStore((state) => state.rehydrateSteps);

  // Set the colors
  useBackdropColorChange("#c44", "#4ea");

  // Return the JSX
  return (
    <div className="flex flex-col items-center justify-between  w-[100%] h-[100%]">
      <ConfigTitle>
        {"Create Initial Allocations 🌱"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          The initial positions that a deposit is routed into
        </WrappedText>{" "}
      </ConfigTitle>
      <StrategyConfigVerticalWrapper
        style={{
          width: "80%",
          height: "80%",
          zIndex: 1000,
        }}
      >
        <StepsModal
          root={rootStep}
          wrapperProps={{
            style: {
              width: "100%",
              height: "100%",
              zIndex: 1000,
            },
          }}
          parentStyle={{
            height: "100%",
          }}
          comparisonCallback={() => {
            rehydrateSteps();
          }}
        />
      </StrategyConfigVerticalWrapper>
    </div>
  );
};

export default BaseStepsConfig;
