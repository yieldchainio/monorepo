/**
 * @notice Builds a linked list of a YCStep **ONCHAIN STRUCT**
 * @param treeStep - The tree of YCSteps (The class instance) to build
 * @param stepFunctions - Mapping of step IDs => encoded functions
 * @return YCStep (Struct) array, specifying the encoded function, whether it's a callback,
 * and the indices of it's children within the array
 */
import { YCStep } from "@yc/yc-models";
import { StepsToEncodedFunctions } from "../../types.js";
import { YCStepStruct } from "@yc/yc-models";
export declare function buildOnchainStepsList(stepsTree: YCStep, stepFunctions: StepsToEncodedFunctions): YCStepStruct[];
