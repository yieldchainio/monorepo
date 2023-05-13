/**
 * Simple helper to ABI-encode an array of YCStep onchain structs
 * @param stepsArr - Linked-list array of YCStep structs
 * @return encodedSteps - Array of the ABI-encoded steps
 */
import { bytes } from "@yc/yc-models";
import { YCStepStruct } from "@yc/yc-models/src/types/onchain";
export declare function encodeYCSteps(stepsArr: YCStepStruct[]): bytes[];
