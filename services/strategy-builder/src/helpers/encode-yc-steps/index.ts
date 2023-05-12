/**
 * Simple helper to ABI-encode an array of YCStep onchain structs
 * @param stepsArr - Linked-list array of YCStep structs
 * @return encodedSteps - Array of the ABI-encoded steps
 */

import { YCStep, bytes } from "@yc/yc-models";
import { YCStepStruct } from "@yc/yc-models/src/types/onchain";
import { ethers } from "ethers";

export function encodeYCSteps(stepsArr: YCStepStruct[]): bytes[] {
  return stepsArr.map((step: YCStepStruct) =>
    ethers.AbiCoder.defaultAbiCoder().encode([YCStep.YCStepTupleSig], [step])
  );
}
