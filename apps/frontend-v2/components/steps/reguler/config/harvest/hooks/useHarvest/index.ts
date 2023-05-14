/**
 * useHarvest,
 * used by harvest configs, provides data about current harvestable positions depending on the step
 * @param step - the Step instance of the current step.
 */

import { Step } from "utilities/classes/step";
import { useConfigContext } from "../../../hooks/useConfigContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { HARVEST_ID } from "components/steps/reguler/constants";
import { useLogs } from "utilities/hooks/stores/logger";
import { YCClassifications, YCFunc } from "@yc/yc-models";
import { completeHarvest } from "../../utils/complete-harvest";
import { HarvestData } from "../../types";
import { HarvestConfig } from "../../index.jsx";

export const useHarvest = (step: Step, triggerComparison: () => void) => {
  // ===========
  //   GLOBALS
  // ===========
  /**
   * Get global logs store for logging errors/info
   */
  const logs = useLogs();

  /**
   * Get some base variables that we need (context, network & our available tokens)
   */
  const { context } = useConfigContext({
    step,
    triggerComparison,
  });

  /**
   * Get the harvest action
   */
  const harvestAction = useMemo(() => context.getAction(HARVEST_ID), [context]);

  /**
   * Get all functions from context
   */
  const allFunctions = useMemo(
    () => context.functions,
    [context.YCfunctions.length]
  );

  /**
   * Memoize the parent's function (We use as the "key" (Just an analgoy) to unlocked dependant functions,
   * which will be our harvestable positions)
   */
  const unlockingFunction = useMemo(
    () => step.parent?.function || null,
    [step.parent?.function?.id, step?.function?.id]
  );

  // ===========
  //   STATES
  // ===========
  const [harvestFunction, setHarvestFunction] = useState<YCFunc | null>(null);

  /**
   * Harvestable functions - all functions under harvest that either do not have any dependencies
   * (probably wont happen lol), or that have our unlocking function as their dependency,
   * or are present within the parent's "unlockedFunctions"
   */
  const harvestFunctions = useMemo(() => {
    const funcs = allFunctions.filter((func) => {
      // It must be harvest-related
      if (!func.actions.some((action) => action.id === HARVEST_ID))
        return false;

      // If it has no dependency, return true (it's open to all - UNLIKELY)
      if (!func.dependencyFunction) return true;

      // It should potentially included in the parent's "unlockedFunctions" (Added externally,
      // e.g from seed steps to tree steps)
      if (
        step.parent?.unlockedFunctions.some(
          (_func) => _func.func.id == func.id && !_func.used
        )
      )
        return true;

      // At this point it must have our function as it's dependency
      if (func.dependencyFunction?.id == unlockingFunction?.id) return true;

      return false;
    });

    if (!funcs && allFunctions.length) throwNoPositions();

    return funcs;
  }, [unlockingFunction?.id, allFunctions.length]);

  // ===========
  //   METHODS
  // ===========

  /**
   * A function to use when throwing that there is no harvest function
   */
  const threw = useRef<boolean>(false);
  const throwNoPositions = () => {
    if (threw.current) return;
    threw.current = true;
    step.state = "initial";
    return logs.lazyPush({
      message:
        "You Do Not Have Any Harvestable Position At This Point. Are you sure you are in the correct step?",
      type: "warning",
    });
  };

  /**
   * Set the step's data for the harvest function
   * @param func - The function to choose as the harvest function
   * @param completeConfig - whether to complete this config (used if there is only)
   */
  const choosePosition = (func: YCFunc, completeConfig: boolean = false) => {
    // Assert that we must have a harvestable position
    if (!harvestFunctions.length) {
      console.warn(
        logs.lazyPush({
          message:
            "You Do Not Have Any Harvestable Position At This Point. Are you sure you are in the correct step?",
          type: "warning",
        })
      );
      step.state = "initial";
      return;
    }

    // Assert that the harvest action must be defined
    if (!harvestAction)
      throw logs.lazyPush({
        message:
          "Cannot Harvest - Harvest Action Is Undefined (Contact Team For Debugging)",
        type: "error",
      });

    // Assert that the parent step must have a protocol
    if (!func.dependencyFunction?.address?.protocol)
      throw logs.lazyPush({
        message: "Cannot Harvest Position - Parent's Protocol Is Not Defined.",
        type: "error",
      });

    /**
     * Whether it was externally unlocked (used for editing later on, so it's not ommited forever once complete)
     */
    const externallyUnlocked = step.parent?.unlockedFunctions?.some(
      (_func) => _func.func.id == func.id
    );

    /**
     * Set the data on the step (used by our useEffect to set the states)
     */
    (step.data.harvest as HarvestData | undefined) = {
      ...step.data?.harvest,
      func: func.toJSON(),
    };
    /**
     * First, set the protocol to the one from the parent (We are harvesting the smae position)
     */
    step.protocol = step.parent?.protocol || null;

    /**
     * Clear the flows of this step (sufficient)
     */
    step.clearFlows();

    /**
     *  Then, set the flows of this step
     */
    for (const token of func.outflows) step.addOutflow(token);
    for (const token of func.inflows) step.addInflow(token);

    // Complete the config if specified (called by useEffect if we only have 1 harvest)
    if (completeConfig) completeHarvest(step);

    triggerComparison();

    return;
  };

  /**
   * If we only have a single harvest function, we choose it immedaitly
   */
  useEffect(() => {
    if (harvestFunctions.length === 1 && !step.data?.harvest?.func?.id) {
      choosePosition(harvestFunctions[0], !harvestFunctions[0].requiresCustom);

      if (!harvestFunctions[0].requiresCustom)
        logs.lazyPush({
          message: `Added ${harvestFunctions[0].inflows.map(
            (token, i) => token.symbol
          )} Harvest Automatically`,
          type: "info",
        });
    }
  }, [harvestFunctions.length]);

  /**
   * useEffect running on the harvest data change, setting our states
   */
  useEffect(() => {
    // We watch the harvest function data, if it exists:
    const data = step.data?.harvest as HarvestData;
    if (data?.func) {
      // Set our harvest function state
      const func = new YCFunc(data.func, YCClassifications.getInstance());
      setHarvestFunction(func);

      if (step.function?.id !== func.id) step.setFunction(func);
    }
  }, [step.data?.harvest?.func]);

  // Return the harvestable functions
  return {
    harvestFunctions,
    choosePosition,
    throwNoPositions,
    harvestFunction,
  };
};
