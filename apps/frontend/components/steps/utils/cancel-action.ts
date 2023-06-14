/**
 * Cancel a step's action.
 *
 * Used in the "Cancel" button, and directly by configs when there's a mismatch of conditions
 */

import { Step } from "utilities/classes/step";

export const cancelAction = (step: Step, triggerComparison: () => void) => {
  // Reset the configs
  step.resetConfigs();

  // Trigger a comparison
  triggerComparison();
};
