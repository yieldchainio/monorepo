/**
 * Encodes a step tree's function, recursively. Returns a mapping of Step ID => Encoded function
 * @param stepsTree - Tree of steps to encode the functions of
 * @return stepsToEncodedFunctins - Mapping step IDs to their corresponding encoded functions (hex string)
 */

import { YCStep, bytes } from "@yc/yc-models";
import { StepsToEncodedFunctions } from "../../types";

export function encodeTreesFunctions(
  stepsTree: YCStep[]
): StepsToEncodedFunctions {
  return new Map<string, bytes>();
}
