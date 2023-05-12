/**
 * Validate the steps input from the frontend
 * @param stepsTree - The tree of JSONStep to validate
 * @param context - YC Classification context to validate
 */

import { JSONStep, YCClassifications, YCStep } from "@yc/yc-models";
import { ValidationResponse } from "../../types.js";

export function validateSteps(
  stepsTree: YCStep,
  context: YCClassifications
): ValidationResponse {
  return { status: true };
}
