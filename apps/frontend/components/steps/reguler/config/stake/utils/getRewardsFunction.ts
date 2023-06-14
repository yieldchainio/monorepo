/**
 * getRewardsFunction,
 * Finds the rewards function of a staking function.
 *
 * @param stakeFunction - YCFunc, the staking function
 * @param context - YCClassifications, context to find them
 */

import { YCClassifications, YCFunc } from "@yc/yc-models";
import { HARVEST_ID } from "components/steps/reguler/constants";

export const getRewardsFunction = (
  stakeFunction: YCFunc,
  context: YCClassifications
) => {
  /**
   * We get the dependents of this function, and then sort them based on our conditions
   */
  const dependants = context.functions
    .filter((func) => func.dependencyFunction?.id === stakeFunction?.id)
    .sort((funcA: YCFunc, funcB: YCFunc) => {
      if (funcA.actions.some((action) => action.id === HARVEST_ID)) return -1;
      if (funcB.actions.some((action) => action.id === HARVEST_ID)) return 1;
      return 0;
    });

  // The Harvesting Function
  return dependants[0];
};
