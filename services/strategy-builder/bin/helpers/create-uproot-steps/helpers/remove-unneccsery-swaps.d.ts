/**
 * @notice
 * Removes any unneccsery swaps within the uproot tree.
 * This is determined by looking at whether the output ("to") token is used anywhere in the branches
 * beneath it. If not, it is unneccessery and the inputs may be swapped later the the scrapes swapper
 * @param uprootTree - The uproot tree
 */
import { YCStep } from "@yc/yc-models";
export declare function removeUnnecessarySwaps(uprootTree: YCStep): void;
