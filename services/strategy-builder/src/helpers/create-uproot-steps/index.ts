/**
 * @notice Creates the "uproot" steps for a strategy (used in withdrawals)
 * @param seedSteps - The seed steps of the strategy
 * @param treeSteps - The tree steps of the strategy
 * @param depositToken - The deposit token of the strategy
 * @return uprootSteps - The uproot steps of the strategy
 */

import { JSONStep, YCStep, YCToken } from "@yc/yc-models";

export function createUprootSteps(
  seedSteps: YCStep,
  treeSteps: YCStep,
  depositToken: YCToken
): YCStep {
  return seedSteps;
}
