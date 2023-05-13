/**
 * Head function to handle the frontend step input, use the helpers, and return the inputs
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param vaultVisibility - Visibility of the vault (public = true, private = false)
 * @param depositToken - ID of a YCToken, the deposit token of the vault
 * @param chainID - The chain to deploy on
 * @return deploymentCalldata
 */
import { JSONStep } from "@yc/yc-models";
import { BuilderResponse } from "../types.js";
export declare function createDeployableVaultInput(seedSteps: JSONStep, treeSteps: JSONStep, vaultVisibility: boolean, depositTokenID: string, chainID: number): Promise<BuilderResponse>;
