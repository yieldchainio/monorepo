/**
 * Take in a DeployableStep tree, and correct all of it's token percentages,
 * @param tree - InteractiveDeployableStep that we can iterate over recursively
 */

import { YCStep } from "@yc/yc-models";

export function updateTokenPercentages(stepTree: YCStep) {
  // Map through the tree - For each node, fix the token percentages
  stepTree.map((step: YCStep) => {
    const { children } = step;

    const unusedPercentages = new Map<string, number>();

    for (let childIndex = 0; childIndex < children.length; childIndex++) {
      const child = children[childIndex] as YCStep;

      const childTokenPercentages = new Map<string, number>();

      for (const tokenPercentagePair of child.tokenPercentages || []) {
        const unusedPercentage =
          unusedPercentages.get(tokenPercentagePair[0]) || 100;

        childTokenPercentages.set(
          tokenPercentagePair[0],
          (tokenPercentagePair[1] / unusedPercentage) * 100
        );

        unusedPercentages.set(
          tokenPercentagePair[0],
          unusedPercentage - tokenPercentagePair[1]
        );
      }

      child.tokenPercentages = childTokenPercentages;
    }
  });
}

export function batchUpdateTokenPercentages(trees: YCStep[]) {
  for (const tree of trees) updateTokenPercentages(tree);
}
