/**
 * Head function to handle the frontend step input, use the helpers, and return the inputs
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param vaultVisibility - Visibility of the vault (public = true, private = false)
 * @param depositToken - ID of a YCToken, the deposit token of the vault
 * @param chainID - The chain to deploy on
 * @return deploymentCalldata
 */

import {
  EncodingContext,
  JSONStep,
  YCClassifications,
  YCNetwork,
  YCStep,
  address,
  bytes,
} from "@yc/yc-models";
import { validateSteps } from "./validate";
import { BuilderResponse } from "../types";
import { createUprootSteps } from "./create-uproot-steps";
import { buildApprovalPairs } from "./build-approval-pairs";
import { encodeTreesFunctions } from "./encode-functions";
import { buildOnchainStepsList } from "./build-onchain-steps-list";
import { Interface, ethers } from "ethers";
import {
  VaultFactoryInputs,
  YCStepStruct,
} from "@yc/yc-models/src/types/onchain";
import { encodeYCSteps } from "./encode-yc-steps";
import factoryABI from "@yc/yc-models/src/ABIs/factory.json";
import {
  batchUpdateTokenPercentages,
  updateTokenPercentages,
} from "./update-token-percentages";

export async function createDeployableVaultInput(
  seedSteps: JSONStep,
  treeSteps: JSONStep,
  vaultVisibility: boolean,
  depositTokenID: string,
  chainID: number
): Promise<BuilderResponse> {
  const ycContext = YCClassifications.getInstance();
  const network = ycContext.getNetwork(chainID);
  if (!network || !network.diamondAddress)
    return { status: false, reason: "Unsupported network" };

  const depositToken = ycContext.getToken(depositTokenID);
  if (!depositToken)
    return { status: false, reason: "Deposit Token Not Found In Context" };

  const seedInstance = new YCStep(seedSteps, ycContext);
  const treeInstance = new YCStep(treeSteps, ycContext);
  const uprootInstance = createUprootSteps(
    seedInstance,
    treeInstance,
    depositToken
  );
  const seedValidation = validateSteps(seedInstance, ycContext);
  if (!seedValidation.status)
    return { status: false, reason: seedValidation.reason };

  const treeValidation = validateSteps(treeInstance, ycContext);
  if (!treeValidation.status)
    return { status: false, reason: treeValidation.reason };

  const uprootValidation = validateSteps(uprootInstance, ycContext);
  if (!uprootValidation.status)
    return { status: false, reason: uprootValidation.reason };


    
  batchUpdateTokenPercentages([seedInstance, treeInstance, uprootInstance]);

  
  const approvalPairs = buildApprovalPairs(
    seedInstance,
    treeInstance,
    uprootInstance,
    depositToken,
    network.diamondAddress as address
  );

  
  const stepsToEncodedFunctions = encodeTreesFunctions([
    [seedInstance, EncodingContext.SEED],
    [treeInstance, EncodingContext.TREE],
    [uprootInstance, EncodingContext.UPROOT],
  ]);

  const onchainSeedArr: bytes[] = encodeYCSteps(
    buildOnchainStepsList(seedInstance, stepsToEncodedFunctions)
  );

  const onchainTreeArr = encodeYCSteps(
    buildOnchainStepsList(treeInstance, stepsToEncodedFunctions)
  );

  const onchainUprootArr = encodeYCSteps(
    buildOnchainStepsList(uprootInstance, stepsToEncodedFunctions)
  );

  const ycFactoryInstance = new ethers.Contract(
    network.diamondAddress,
    factoryABI,
    new ethers.JsonRpcProvider(network.jsonRpc as string)
  );

  const vaultCreationArgs: VaultFactoryInputs = {
    seedSteps: onchainSeedArr,
    treeSteps: onchainTreeArr,
    uprootSteps: onchainUprootArr,
    approvalPairs,
    depositToken: depositToken.address as `0x${string}`,
    isPublic: vaultVisibility,
  };

  const deploymentCalldata =
    await ycFactoryInstance.createVault.populateTransaction(
      ...vaultCreationArgs
    );

  return {
    status: true,
    deploymentCalldata: deploymentCalldata.data,
  };
}
