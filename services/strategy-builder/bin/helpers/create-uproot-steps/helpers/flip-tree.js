/**
 * Flip a tree upside down (after initial hydration),
 * recursively add the parents of a leaf node as it's children
 * @param tree - The tree to flip (recurisvely set)
 * @param condition - A condition to check on each parent node to see if shall be included, or propagated to the next one
 * @param usedParents - A hash set of used parents that we shall not use anymore
 */
import { v4 as uuid } from "uuid";
export function flipTree(tree, condition, usedParents) {
    tree.children = [];
    const oldParent = getClosestParent(tree.parent, condition);
    if (oldParent == null)
        return;
    if (usedParents.has(oldParent?.id))
        return;
    usedParents.add(oldParent?.id);
    const newChild = oldParent.clone();
    newChild.id = uuid();
    tree?.children.push(newChild);
    flipTree(newChild, condition, usedParents);
    newChild.parent = tree;
}
/**
 * Get closest parent which answers a condition
 * @param parent - Parent to start searching in
 * @param condition - The condition to check
 * @return cloesest valid parent, or null if none
 */
function getClosestParent(parent, condition) {
    if (parent == null)
        return null;
    if (condition(parent))
        return parent;
    else
        return getClosestParent(parent.parent, condition);
}
/**
 * Head function to create the flipped tree,
 */
export function hydrateAndFlipTree(oldTrees, newTree, shouldIncludeNode) {
    const allLeaves = [];
    for (const tree of oldTrees)
        allLeaves.push(...tree.leaves);
    const usedParents = new Set();
    for (const step of allLeaves) {
        if (!shouldIncludeNode(step))
            continue;
        const newStep = step.clone();
        newStep.id = uuid(); // We give it a new ID since it's a new step
        flipTree(newStep, shouldIncludeNode, usedParents);
        newStep.parent = newTree;
        newTree.children.push(newStep);
    }
}
//# sourceMappingURL=flip-tree.js.map