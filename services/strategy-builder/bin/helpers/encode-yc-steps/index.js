/**
 * Simple helper to ABI-encode an array of YCStep onchain structs
 * @param stepsArr - Linked-list array of YCStep structs
 * @return encodedSteps - Array of the ABI-encoded steps
 */
import { YCStep } from "@yc/yc-models";
import { ethers } from "ethers";
export function encodeYCSteps(stepsArr) {
    return stepsArr.map((step) => ethers.AbiCoder.defaultAbiCoder().encode([YCStep.YCStepTupleSig], [step]));
}
//# sourceMappingURL=index.js.map