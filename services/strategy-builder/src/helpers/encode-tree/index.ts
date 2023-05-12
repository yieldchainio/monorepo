/**
 * Main function to run to encode a tree of steps
 * @param deployableStep - A DeployableStep type step from the frontend (Tree)
 * @param treeContext - A TreeContext (SEED, TREE, UPROOT)
 */
import {
  DeployableStep,
  YCClassifications,
  ConstructableNode,
  Node,
} from "@yc/yc-models";
import { updateTokenPercentages } from "../update-token-percentages";

export type InteractiveDeployableStep = ConstructableNode<any> & DeployableStep;

export function encodeTree(deployableStep: DeployableStep) {
  const tree: InteractiveDeployableStep = new ConstructableNode(
    deployableStep
  ) as InteractiveDeployableStep;

  // Update all of the token percentages on the steps
  updateTokenPercentages(tree);

  // Iterate over each step - Encode it
  tree.map((step: InteractiveDeployableStep) => {});
}
