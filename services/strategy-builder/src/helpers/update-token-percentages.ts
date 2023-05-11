/**
 * Take in a DeployableStep tree, and correct all of it's token percentages,
 * @param tree - InteractiveDeployableStep that we can iterate over recursively
 */

import { TokenPercentage } from "@yc/yc-models";
import { InteractiveDeployableStep } from "./encode-tree";

export function updateTokenPercentages(stepTree: InteractiveDeployableStep) {
  // Map through the tree - For each node, fix the token percentages
  stepTree.map((step: InteractiveDeployableStep) => {
    const { children } = step;

    const unusedPercentages = new Map<string, number>();

    for (let childIndex = 0; childIndex < children.length; childIndex++) {
      const child = children[childIndex] as InteractiveDeployableStep;

      const childTokenPercentages = new Map<string, number>();

      for (const tokenPercentagePair of child.tokenPercentages || []) {
        const unusedPercentage =
          unusedPercentages.get(tokenPercentagePair[0]) || 100;

        childTokenPercentages.set(
          tokenPercentagePair[0],
          (tokenPercentagePair[1].percentage / unusedPercentage) * 100
        );

        unusedPercentages.set(
          tokenPercentagePair[0],
          unusedPercentage - tokenPercentagePair[1].percentage
        );
      }

      const newPercentages: Array<[string, TokenPercentage]> = [];
      for (const [tokenID, percentage] of childTokenPercentages) {
        newPercentages.push([tokenID, { dirty: false, percentage }]);
      }
      child.tokenPercentages = newPercentages;
    }
  });
}
