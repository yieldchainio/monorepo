/**
 * Types for the deployment modal
 */

import { BaseModalChildProps } from "components/types.js";
import { Step } from "utilities/classes/step";

export interface DeployModalProps extends BaseModalChildProps {
  seedRootStep: Step;
  treeRootStep: Step;
}
