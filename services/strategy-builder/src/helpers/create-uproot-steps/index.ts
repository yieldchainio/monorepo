/**
 * @notice Creates the "uproot" steps for a strategy (used in withdrawals)
 * @param seedSteps - The seed steps of the strategy
 * @param treeSteps - The tree steps of the strategy
 * @param depositToken - The deposit token of the strategy
 * @return uprootSteps - The uproot steps of the strategy
 */

import { StepType, YCClassifications, YCStep, YCToken } from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import lodash from "lodash";
import { DUPLICATEABLE_FUNCTION_IDS } from "./constants.js";
import { reversifyTreeFunctions } from "./helpers/reversify-step-function.js";
import { hydrateAndFlipTree } from "./helpers/flip-tree.js";
import { addScrapeSwaps } from "./helpers/add-scrape-swaps.js";
import { removeUnnecessarySwaps } from "./helpers/remove-unneccsery-swaps.js";

export function createUprootSteps(
  seedSteps: YCStep,
  treeSteps: YCStep,
  depositToken: YCToken
): YCStep {
  // The root step of the uproot (A withdrawal trigger)
  const root: YCStep = new YCStep(
    {
      id: uuid(),
      tokenPercentages: [],
      inflows: [],
      outflows: [],
      triggerName: "Withdrawal",
      triggerDescription: "When Someone Withdraws Shares",
      triggerIcon: {
        dark: "/icons/withdrawal-light.svg",
        light: "/icons/withdrawal-dark.svg",
      },
      function: null,
      customArguments: [],
      children: [],
      type: StepType.TRIGGER,
      data: null,
      parentId: null,
    },
    YCClassifications.getInstance()
  );

  const usedFunctions = new Set();

  const shouldAddStep = (step: YCStep): boolean => {
    if (!step.function) return false;

    if (
      usedFunctions.has(step.function.id) &&
      !DUPLICATEABLE_FUNCTION_IDS[step.function.id]
    )
      return false;

    usedFunctions.add(step.function.id);

    // Only allow functions which have a counter function, or that have 0 outflows (net neutral for the vault)
    if (!step.function.counterFunction)
      if (step.function.outflows.length > 0) return false;

    return true;
  };

  hydrateAndFlipTree(
    // @notice
    // Tree steps are first b4 seed steps - We need the latest steps to be seen first
    [treeSteps, seedSteps],
    root,
    shouldAddStep
  );

  reversifyTreeFunctions(root);

  removeUnnecessarySwaps(root);

  addScrapeSwaps(root, depositToken);

  return root;
}
