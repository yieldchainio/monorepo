"use client";
import WrappedText from "components/wrappers/text";
/**
 * Title config for the strategy
 */

import { ConfigTitle } from "../../../../components/strategy-config-title";
import WrappedInput from "components/wrappers/input";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { useEffect, useRef, useState } from "react";
import useDebounce from "utilities/hooks/general/useDebounce";
import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";
import { StrategyConfigVerticalWrapper } from "components/strategy-config-wrapper";
import { StepsModal } from "components/steps-modal";

const StepsConfig = () => {
  // Get the current root step (Should be the root automation trigger on config state)
  const rootStep = useStrategyStore((state) => state.step);

  // Get the current base root step (to show as container)
  const baseRootStep = useStrategyStore((state) => state.seedStep);

  // Rehydration function
  const rehydrateSteps = useStrategyStore((state) => state.rehydrateSteps);

  // Set the colors
  useBackdropColorChange("var(--yc-llb)", "var(--yc-ly)");

  const baseStepsRef = useRef<null | HTMLDivElement>(null);

  const baseStepsContainer = (
    <div
      ref={baseStepsRef}
      className="absolute border-[2px] border-custom-border border-dashed rounded-md "
      style={{
        width: "327px",
        height: "100px",
        marginLeft: "auto",
        marginRight: "auto",
        top: "0px",
        left: "0px",
        transform: "translateX(-50%)",
      }}
    >
      <WrappedText>Hello Ser</WrappedText>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between  w-[100%] h-[100%]">
      {baseStepsContainer}
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
          baseRootStep={baseRootStep}
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
