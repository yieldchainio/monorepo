/**
 * Encodes a step tree's function, recursively. Returns a mapping of Step ID => Encoded function
 * @param stepsTree - Tree of steps to encode the functions of
 * @return stepsToEncodedFunctins - Mapping step IDs to their corresponding encoded functions (hex string)
 */
import { EncodingContext, YCStep } from "@yc/yc-models";
import { StepsToEncodedFunctions } from "../../types.js";
export declare function encodeTreesFunctions(stepsTrees: Array<[YCStep, EncodingContext]>): StepsToEncodedFunctions;