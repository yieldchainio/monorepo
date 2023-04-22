"use client";
import WrappedText from "components/wrappers/text";
/**
 * Title config for the strategy
 */

import { ConfigTitle } from "../../../../components/strategy-config-title";
import WrappedInput from "components/wrappers/input";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useEffect, useState } from "react";
import useDebounce from "utilities/hooks/general/useDebounce";
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";
import { StepsModal } from "components/steps-modal";

const StepsConfig = () => {
  // Get the current base step (Should be the root Deposit trigger)
  const rootStep = useStrategyStore((state) => state.step);

  // Rehydration function
  const rehydrateSteps = useStrategyStore((state) => state.rehydrateSteps);

  // Set the colors
  useBackdropColorChange("var(--yc-llb)", "var(--yc-ly)");

  return (
    <div className="flex flex-col items-center justify-between  w-[100%] h-[100%]">
      <ConfigTitle>
        {"Build Your Strategy ⚡"}{" "}
        <WrappedText fontSize={16} className="text-opacity-50">
          Choose some triggers, and build the strategy's flow 🚀
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
          canvasID="SEED_ALLOCATION_BUILDER"
        />
      </StrategyConfigVerticalWrapper>
    </div>
  );
};

export default StepsConfig;
