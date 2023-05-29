/**
 * Encodes a step tree's function, recursively. Returns a mapping of Step ID => Encoded function
 * @param stepsTree - Tree of steps to encode the functions of
 * @return stepsToEncodedFunctins - Mapping step IDs to their corresponding encoded functions (hex string)
 */
import { ethers } from "ethers";
export function encodeTreesFunctions(stepsTrees) {
    const stepIDsToEncodedFunctions = new Map();
    for (const tree of stepsTrees)
        tree[0].map((step) => {
            stepIDsToEncodedFunctions.set(step.id, step.function?.encodeYCCommand(step.toJSON(), tree[1], step.customArguments) || ethers.ZeroHash);
            if (step.function?.id == "19084200-fcc0-46db-9c95-7c0fcebc8d4b")
                console.log("Encoded Remove Liquidity...", stepIDsToEncodedFunctions.get(step.id));
        });
    return stepIDsToEncodedFunctions;
}
//# sourceMappingURL=index.js.map