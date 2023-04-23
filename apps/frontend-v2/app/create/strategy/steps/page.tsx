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
import { Step } from "utilities/classes/step";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { YCFunc } from "@yc/yc-models";

const StepsConfig = () => {
  // Get the current root step (Should be the root automation trigger on config state)
  const rootStep = useStrategyStore((state) => state.step);

  // Get the current base root step (to show as container)
  const baseRootStep = useStrategyStore((state) => state.seedStep);

  // Rehydration function
  const rehydrateSteps = useStrategyStore((state) => state.rehydrateSteps);

  // Global store context
  const context = useYCStore((state) => state.context);

  // Set the colors
  useBackdropColorChange("var(--yc-llb)", "var(--yc-ly)");

  /**
   * We run a useEffect on mount of this page,
   * we clear our root's unlocked functions, and add to it all of the unlocked
   * dependents from the seed steps.
   *
   * This is done because we want the user to be able to access the functions they unlocked
   * during the seeding stage. For instance, a user may seed their strategy w/ multiple
   * staking, lending positions, when a deposit into the strategy happens.
   * All of which unlock some claiming/harvest functions.
   *
   * In this case, they would want to use them on the tree strategy, harvesting the rewards,
   * compounding them, longing shiba cum inu, or doing whatever else with these positions.
   */

  useEffect(() => {
    // Clear the existing unlocked functions (no multiples!)
    rootStep.unlockedFunctions = [];

    // Iterate over each of the seed steps, search for unlocked function in the global context,
    // and add them to the tree's root if found
    baseRootStep.each((step: Step) => {
      // If this step has no function, it's not relevent to us
      if (!step.function) return;

      // Find all functions from global context which are unlocked by this step's function,
      // And also filter them based on whether it was used within the seed already or not
      const dependants = context.functions.filter(
        (func) =>
          // All the ones that are dependant on it,
          func?.dependencyFunction?.id === step.function?.id &&
          // And are also not used within the seed
          !baseRootStep.find((_step) => _step.function?.id == func.id)
      );

      // If no dependants, continue
      if (!dependants.length) return;

      // Push each one of this step's unlocked dependants to the tree's root's unlockedFunctions,
      // determine if they are already used within the tree by whether or not we can find it used
      // within the tree's root's children
      for (const func of dependants) {
        const used = rootStep.children.some(
          (child) => child.function?.id === func.id
        );
        rootStep.unlockedFunctions.push({ func, used });
      }
    });
  }, [rootStep.children?.length]);

  // Return the JSX
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
