/**
 * Flip a tree upside down (after initial hydration),
 * recursively add the parents of a leaf node as it's children
 * @param tree - The tree to flip (recurisvely set)
 * @param condition - A condition to check on each parent node to see if shall be included, or propagated to the next one
 * @param usedParents - A hash set of used parents that we shall not use anymore
 */

import { YCStep } from "@yc/yc-models";
import { v4 as uuid } from "uuid";

export function flipTree(
  tree: YCStep,
  condition: (node: YCStep) => boolean,
  usedParents: Set<any>
) {
  tree.children = [];

  const oldParent: YCStep | null = getClosestParent(
    tree.parent as YCStep,
    condition
  );

  if (oldParent == null) return;

  if (usedParents.has(oldParent?.id as string)) return;

  usedParents.add(oldParent?.id as string);

  const newChild = oldParent.clone();

  newChild.id = uuid();
  tree?.children.push(newChild);

  flipTree(newChild, condition, usedParents);

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

/**
 * Head function to create the flipped tree,
 */
export function hydrateAndFlipTree(
  oldTrees: YCStep[],
  newTree: YCStep,
  shouldIncludeNode: (node: YCStep) => boolean
) {
  const allLeaves = [];
  for (const tree of oldTrees) allLeaves.push(...tree.leaves);

  const usedParents = new Set();

  for (const step of allLeaves) {
    if (!shouldIncludeNode(step)) continue;

    const newStep = step.clone();
    newStep.id = uuid(); // We give it a new ID since it's a new step
    flipTree(newStep, shouldIncludeNode, usedParents);
    newStep.parent = newTree;
    newTree.children.push(newStep);
  }
}
