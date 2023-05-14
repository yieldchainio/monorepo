/**
 * Flip a tree upside down (after initial hydration),
 * recursively add the parents of a leaf node as it's children
 * @param tree - The tree to flip (recurisvely set)
 * @param condition - A condition to check on each parent node to see if shall be included, or propagated to the next one
 * @param usedParents - A hash set of used parents that we shall not use anymore
 */
import { YCStep } from "@yc/yc-models";
export declare function flipTree(tree: YCStep, condition: (node: YCStep) => boolean, usedParents: Set<any>): void;
/**
 * Head function to create the flipped tree,
 */
export declare function hydrateAndFlipTree(oldTrees: YCStep[], newTree: YCStep, shouldIncludeNode: (node: YCStep) => boolean): void;
