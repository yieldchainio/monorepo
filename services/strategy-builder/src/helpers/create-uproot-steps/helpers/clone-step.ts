/**
 * Clones a YCStep
 * @param step - The step to clone
 * @return clonedStep
 */

import { YCClassifications, YCStep } from "@yc/yc-models";


export function cloneStep(step: YCStep) {
    const jsonStep = step.toJSON(true);
    const newStep = new YCStep(jsonStep, YCClassifications.getInstance());
    newStep.parent = step.parent;
    return newStep;
  }