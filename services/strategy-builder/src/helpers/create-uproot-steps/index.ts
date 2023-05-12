/**
 * @notice Creates the "uproot" steps for a strategy (used in withdrawals)
 * @param seedSteps - The seed steps of the strategy
 * @param treeSteps - The tree steps of the strategy
 * @param depositToken - The deposit token of the strategy
 * @return uprootSteps - The uproot steps of the strategy
 */

import { JSONStep, YCClassifications, YCStep, YCToken } from "@yc/yc-models";
import { v4 as uuid } from "uuid";

export function createUprootSteps(
  seedSteps: YCStep,
  treeSteps: YCStep,
  depositToken: YCToken
): YCStep {
  // const root: YCStep = new YCStep(
  //   {
  //     id: uuid(),
  //     tokenPercentages: [],
  //     inflows: [],
  //     outflows: [],
      
  //   },
  //   YCClassifications.getInstance()
  // );
  return seedSteps;
}
