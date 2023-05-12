/**
 * @notice Builds a linked list of a YCStep **ONCHAIN STRUCT**
 * @param treeStep - The tree of YCSteps (The class instance) to build
 * @param stepFunctions - Mapping of step IDs => encoded functions
 * @return YCStep (Struct) array, specifying the encoded function, whether it's a callback,
 * and the indices of it's children within the array
 */

import { YCStep, bytes } from "@yc/yc-models";
import { StepsToEncodedFunctions } from "../../types";
import { YCStepStruct } from "@yc/yc-models";

export function buildOnchainStepsList(
  stepsTree: YCStep,
  stepFunctions: StepsToEncodedFunctions
): YCStepStruct[] {
  const stepIdsToIndices = new Map<string, number>();
  const linkedList: YCStepStruct[] = [];

  stepsTree.map((step: YCStep, index: number) => {
    const encodedFunc = stepFunctions.get(step.id);
    const conditions: bytes[] = [];
    const childrenIndices: number[] = [];

    stepIdsToIndices.set(step.id, index);

    if (!encodedFunc) throw "Cannot Create Linked List - Func Unavailable";

    linkedList.push({
      func: encodedFunc,
      childrenIndices,
      conditions,
      isCallback: step.function?.isCallback || false,
    });

    if (!step.parent?.id) return;
    const parentIdx = stepIdsToIndices.get(step.parent.id);
    if (!parentIdx) throw "Cannot Create Linked List - Parent IDX unavailable";

    stepIdsToIndices.set(step.id, index);
    linkedList[parentIdx].childrenIndices.push(index);
  });
  return linkedList
}
