/**
 * @notice
 * Removes any unneccsery swaps within the uproot tree.
 * This is determined by looking at whether the output ("to") token is used anywhere in the branches
 * beneath it. If not, it is unneccessery and the inputs may be swapped later the the scrapes swapper
 * @param uprootTree - The uproot tree
 */
import { REVERSE_SWAP_FUNCTION_ID, } from "../../../utils/build-swap/constants.js";
export function removeUnnecessarySwaps(uprootTree) {
    uprootTree.map((step) => {
        if (step.function?.id !== REVERSE_SWAP_FUNCTION_ID)
            return;
        if (step.find((childInBranch) => childInBranch.outflows
            .concat(childInBranch.function?.outflows || [])
            .some((token) => token.address == step.customArguments[1])))
            return;
        const indexAsSibling = step?.parent?.children.findIndex((sibling) => sibling.id == step.id);
        if (indexAsSibling == undefined) {
            console.error("Step Parent", step?.parent);
            throw "Cannot Remove Unneccsery Swaps - Index as sibling undefined";
        }
        step.parent?.children.splice(indexAsSibling, 1);
        forceOrphansAdoption(step);
    });
}
function forceOrphansAdoption(deadParent) {
    const grandParent = deadParent.parent;
    if (!grandParent)
        return; // They will end up on the streets
    for (const child of deadParent.children)
        grandParent.children.push(child);
}
//# sourceMappingURL=remove-unneccsery-swaps.js.map