/**
 * @notice Builds a linked list of a YCStep **ONCHAIN STRUCT**
 * @param treeStep - The tree of YCSteps (The class instance) to build
 * @param stepFunctions - Mapping of step IDs => encoded functions
 * @return YCStep (Struct) array, specifying the encoded function, whether it's a callback,
 * and the indices of it's children within the array
 */
export function buildOnchainStepsList(stepsTree, stepFunctions) {
    const stepIdsToIndices = new Map();
    const linkedList = [];
    stepsTree.map((step, index) => {
        const encodedFunc = stepFunctions.get(step.id);
        const conditions = [];
        const childrenIndices = [];
        stepIdsToIndices.set(step.id, index);
        if (!encodedFunc)
            throw "Cannot Create Linked List - Func Unavailable";
        linkedList.push({
            func: encodedFunc,
            childrenIndices,
            conditions,
            isCallback: step.function?.isCallback || false,
        });
        if (!step.parent?.id)
            return;
        const parentIdx = stepIdsToIndices.get(step.parent.id);
        if (!parentIdx)
            throw "Cannot Create Linked List - Parent IDX unavailable";
        stepIdsToIndices.set(step.id, index);
        linkedList[parentIdx].childrenIndices.push(index);
    });
    return linkedList;
}
//# sourceMappingURL=index.js.map