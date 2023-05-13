/**
 * Simple helper to ABI-encode an array of YCStep onchain structs
 * @param stepsArr - Linked-list array of YCStep structs
 * @return encodedSteps - Array of the ABI-encoded steps
 */
import { bytes, YCStepStruct } from "@yc/yc-models";
export declare function encodeYCSteps(stepsArr: YCStepStruct[]): bytes[];
