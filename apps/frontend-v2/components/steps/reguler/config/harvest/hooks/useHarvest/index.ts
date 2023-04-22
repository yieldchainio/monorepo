/**
 * useHarvest,
 * used by harvest configs, provides data about current harvestable positions depending on the step
 * @param step - the Step instance of the current step.
 */

import { Step } from "utilities/classes/step";
import { useConfigContext } from "../../../hooks/useConfigContext";
import { useEffect, useMemo, useRef } from "react";
import { HARVEST_ID } from "components/steps/reguler/constants";
import { useLogs } from "utilities/hooks/stores/logger";

export const useHarvest = (step: Step, triggerComparison: () => void) => {
  /**
   * Get global logs store for logging errors/info
   */
  const logs = useLogs();

  /**
   * Get some base variables that we need (context, network & our available tokens)
   */
  const { context, network, availableTokens } = useConfigContext({
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
   * Harvestable function - all functions under harvest that either do not have any dependencies
   * (probably wont happen lol), or that have our unlocking function as their dependency
   */
  const harvestFunction = useMemo(() => {
    const func = allFunctions.find((func) => {
      // It must be harvest-related
      if (!func.actions.some((action) => action.id === HARVEST_ID))
        return false;

      // It must either have no dependencies (unlikely), or have our function as it's dependency
      if (
        !func.dependencyFunction ||
        func.dependencyFunction?.id !== unlockingFunction?.id
      )
        return false;

      return true;
    });

    if (!func && allFunctions.length) throwNoPositions();

    return func;
  }, [unlockingFunction?.id, allFunctions.length]);

  useEffect(() => {
    if (harvestFunction) choosePosition();
  }, [harvestFunction]);

  /**
   * Set the step's data for the harvest function
   */
  const choosePosition = () => {
    // Assert that we must have a harvestable position
    if (!harvestFunction) {
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
    if (!step.parent?.protocol)
      throw logs.lazyPush({
        message: "Cannot Harvest Position - Parent's Protocol Is Not Defined.",
        type: "error",
      });
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
    for (const token of harvestFunction.outflows) step.addOutflow(token);
    for (const token of harvestFunction.inflows) step.addInflow(token);

    /**
     * Then set the function
     */
    step.function = harvestFunction;

    /**
     * Set the action also
     */
    step.action = harvestAction;

    /**
     * Set the statre to complete
     */
    step.state = "complete";

    return;
  };

  // Return the harvestable functions
  return { harvestFunction, choosePosition, throwNoPositions };
};
