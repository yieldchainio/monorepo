/**
 * Clones a YCStep
 * @param step - The step to clone
 * @return clonedStep
 */

import { YCStep } from "@yc/yc-models";

export function cloneStep(step: YCStep) {
  step.clone();
}
