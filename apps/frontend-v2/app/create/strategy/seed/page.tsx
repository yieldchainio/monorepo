"use client";

/**
 * Base steps config for the strategy
 */
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { StepsModal } from "components/steps-modal";
import { ConfigTitle } from "components/strategy-config-title";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";
import WrappedText from "components/wrappers/text";

const BaseStepsConfig = () => {
  // Get the current base step (Should be the root Deposit trigger)
  const rootStep = useStrategyStore((state) => state.seedStep);

  // Rehydration function
  const rehydrateSteps = useStrategyStore((state) => state.rehydrateSteps);

  // Set the colors
  useBackdropColorChange("#c44", "#4ea");

  // Return the JSX
  return (
    <div className="flex flex-col items-center  w-[100vw] h-[100vh] bg-red-500">
      <ConfigTitle>
        {"Create Initial Allocations 🌱"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          The initial positions that a deposit is routed into
        </WrappedText>{" "}
      </ConfigTitle>

      <StepsModal
        writeable
        root={rootStep}
        parentStyle={{
          height: "42vh",
        }}
        wrapperProps={{
          style: {
            width: "90%",
          },
        }}
        comparisonCallback={() => {
          rehydrateSteps();
        }}
        canvasID="SEED_ALLOCATION_BUILDER"
      />
    </div>
  );
};

export default BaseStepsConfig;
