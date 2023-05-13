/**
 * Take in a DeployableStep tree, and correct all of it's token percentages,
 * @param tree - InteractiveDeployableStep that we can iterate over recursively
 */
import { YCStep } from "@yc/yc-models";
export declare function updateTokenPercentages(stepTree: YCStep): void;
export declare function batchUpdateTokenPercentages(trees: YCStep[]): void;
