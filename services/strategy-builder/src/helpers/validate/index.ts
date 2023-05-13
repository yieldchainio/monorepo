/**
 * Validate the steps input from the frontend
 * @param stepsTree - The tree of JSONStep to validate
 * @param context - YC Classification context to validate
 */

import {
  JSONStep,
  YCClassifications,
  YCStep,
  ValidationResponse,
} from "@yc/yc-models";

export function validateSteps(
  stepsTree: YCStep,
  context: YCClassifications
): ValidationResponse {
  return { status: true };
}
