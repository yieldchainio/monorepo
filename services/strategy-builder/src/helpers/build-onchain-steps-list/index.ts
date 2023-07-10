/**
 * @notice Builds a linked list of a YCStep **ONCHAIN STRUCT**
 * @param treeStep - The tree of YCSteps (The class instance) to build
 * @param stepFunctions - Mapping of step IDs => encoded functions
 * @return YCStep (Struct) array, specifying the encoded function, whether it's a callback,
 * and the indices of it's children within the array
 */

import {
  YCStepStruct,
  StepsToEncodedFunctions,
  YCStep,
  bytes,
  buildMVC,
} from "@yc/yc-models";

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

    const isCallback = step.function?.isCallback || false;

    linkedList.push({
      func: encodedFunc,
      childrenIndices,
      conditions,
      isCallback: isCallback,
      mvc: isCallback ? buildMVC(step) : "0x00",
    });

    if (!step.parent?.id) return;
    const parentIdx = stepIdsToIndices.get(step.parent.id);
    if (parentIdx == undefined)
      throw "Cannot Create Linked List - Parent index is undefined";

    linkedList[parentIdx].childrenIndices.push(index);
  });

  console.log("Callbacks:", linkedList.flatMap((step) => step.isCallback ? [] : [step.mvc]))
  return linkedList;
}
