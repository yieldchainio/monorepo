/**
 * @notice Creates the "uproot" steps for a strategy (used in withdrawals)
 * @param seedSteps - The seed steps of the strategy
 * @param treeSteps - The tree steps of the strategy
 * @param depositToken - The deposit token of the strategy
 * @return uprootSteps - The uproot steps of the strategy
 */

import {
  JSONStep,
  StepType,
  YCClassifications,
  YCFunc,
  YCStep,
  YCToken,
} from "@yc/yc-models";
import { v4 as uuid } from "uuid";
import * as _ from "lodash";
import { DUPLICATEABLE_FUNCTION_IDS } from "./constants.js";

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

    // Only allow functions which have a counter function, or that have 0 outflows (net neutral for the vault)
    if (!step.function.counterFunction)
      if (step.function.outflows.length == 0) return false;

    return true;
  };

  const reversifyStepFunction = (step: YCStep) => {
    const reverseFunction = step.function?.counterFunction;
    if (!reverseFunction) {
      if (step.outflows.length > 0)
        throw "Cannot Build Uproot Strategy - Got a step w/o counter function, nor empty outflows whilst reverisfying";

      // Left as is :)
      step.function = step.function;
    } else step.function = reverseFunction;
  };

  hydrateFlippedTree(
    [seedSteps, treeSteps],
    root,
    shouldAddStep,
    reversifyStepFunction
  );

  return root;
}

/**
 * Head function to create the flipped tree
 */
function hydrateFlippedTree(
  oldTrees: YCStep[],
  newTree: YCStep,
  shouldIncludeNode: (node: YCStep) => boolean,
  callback: (node: YCStep) => void
) {
  const allLeaves = [];
  for (const tree of oldTrees) allLeaves.push(...tree.leaves);

  const usedParents = new Set();

  for (const step of allLeaves) {
    const newStep = _.cloneDeep(step);
    newStep.id = uuid(); // We give it a new ID since it's a new step
    flipTree(newStep, shouldIncludeNode, usedParents, callback); // Recursively add it's parents as children
    callback(newStep);
    newTree.children.push(newStep);
  }
}

/**
 * Recursively add parents of children as their own children, (Flipping the tree upside down),
 * provide a condition whether to add or not - If shall not add a step, we propagate it's children (or, prev parent)
 * to now be children of it's own parent (the new one)
 */
function flipTree(
  tree: YCStep,
  condition: (node: YCStep) => boolean,
  usedParents: Set<any>,
  callback: (node: YCStep) => void
) {
  const oldParent: YCStep | null = getClosestParent(
    tree.parent as YCStep,
    condition
  );

  if (oldParent == null) return;

  if (usedParents.has(oldParent?.id as string)) return;

  usedParents.add(oldParent?.id as string);

  const newChild = _.cloneDeep(oldParent);

  newChild.id = uuid();
  tree?.children.push(newChild);

  callback(newChild);

  flipTree(newChild, condition, usedParents, callback);

  newChild.parent = tree;
}

/**
 * Get closest parent which answers a condition
 * @param parent - Parent to start searching in
 * @param condition - The condition to check
 * @return cloesest valid parent, or null if none
 */
function getClosestParent(
  parent: YCStep | null,
  condition: (node: YCStep) => boolean
): YCStep | null {
  if (parent == null) return null;
  if (condition(parent)) return parent;
  else return getClosestParent(parent.parent, condition);
}
