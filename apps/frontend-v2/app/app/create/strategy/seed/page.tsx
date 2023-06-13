"use client";

/**
 * Base steps config for the strategy
 */
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { StepsModal } from "components/modals/steps";
import { ConfigTitle } from "components/strategy-config-title";
import WrappedText from "components/wrappers/text";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";

const BaseStepsConfig = () => {
  // Get the current base step (Should be the root Deposit trigger)
  const rootStep = useStrategyStore((state) => state.seedStep);

  // Rehydration function
  const rehydrateSteps = useStrategyStore((state) => state.rehydrateSteps);

  // Set the colors
  useBackdropColorChange("#c44", "#4ea");

  // Return the JSX
  return (
    <div className="flex flex-col items-center  w-[100vw] h-[100vh] gap-6">
      <ConfigTitle>
        {"Create Initial Allocations 🌱"}{" "}
        <WrappedText
          fontSize={16}
          className="text-opacity-50 tablet:text-[4vw]"
        >
          The initial positions that a deposit is routed into
        </WrappedText>{" "}
      </ConfigTitle>

      <StrategyConfigVerticalWrapper
        style={{
          width: "90%",
          height: "90%",
          zIndex: 1000,
        }}
      >
        <StepsModal
          writeable
          root={rootStep}
          parentStyle={{
            height: "100%",
          }}
          wrapperProps={{
            style: {
              width: "100%",
              height: "100%",
              zIndex: 1000,
            },
          }}
          comparisonCallback={() => {
            rehydrateSteps();
          }}
          canvasID="SEED_ALLOCATION_BUILDER"
        />
      </StrategyConfigVerticalWrapper>
    </div>
  );
};

export default BaseStepsConfig;
