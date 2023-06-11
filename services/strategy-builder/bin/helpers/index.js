/**
 * Head function to handle the frontend step input, use the helpers, and return the inputs
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param vaultVisibility - Visibility of the vault (public = true, private = false)
 * @param depositToken - ID of a YCToken, the deposit token of the vault
 * @param chainID - The chain to deploy on
 * @return deploymentCalldata
 */
import { EncodingContext, YCClassifications, YCStep, } from "@yc/yc-models";
import { validateSteps } from "./validate/index.js";
import { createUprootSteps } from "./create-uproot-steps/index.js";
import { buildApprovalPairs } from "./build-approval-pairs/index.js";
import { encodeTreesFunctions } from "./encode-functions/index.js";
import { buildOnchainStepsList } from "./build-onchain-steps-list/index.js";
import { encodeYCSteps } from "./encode-yc-steps/index.js";
import { batchUpdateTokenPercentages } from "./update-token-percentages/index.js";
import { ethers } from "ethers";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import { buildTriggers } from "./build-triggers/index.js";
import { SWAP_FUNCTION_ID, } from "../utils/build-swap/constants.js";
export async function createDeployableVaultInput(seedSteps, treeSteps, vaultVisibility, depositTokenID, chainID) {
    const ycContext = YCClassifications.getInstance();
    if (!ycContext.initiallized)
        await ycContext.initiallize();
    console.log("Got Context...");
    const network = ycContext.getNetwork(chainID);
    if (!network || !network.diamondAddress)
        return { status: false, reason: "Unsupported network" };
    console.log("Got Network...");
    const depositToken = ycContext.getToken(depositTokenID);
    if (!depositToken)
        return { status: false, reason: "Deposit Token Not Found In Context" };
    console.log("Got Token...");
    const seedInstance = new YCStep(seedSteps, ycContext);
    const treeInstance = new YCStep(treeSteps, ycContext);
    const uprootInstance = createUprootSteps(seedInstance, treeInstance, depositToken);
    console.log("Built Uproot...");
    const triggers = buildTriggers(treeInstance);
    console.log("Built triggers...");
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
    console.log("Updated Token Percentages...");
    const approvalPairs = buildApprovalPairs(seedInstance, treeInstance, uprootInstance, depositToken);
    console.log("Built Approval Pairs...");
    const stepsToEncodedFunctions = encodeTreesFunctions([
        [seedInstance, EncodingContext.SEED],
        [treeInstance, EncodingContext.TREE],
        [uprootInstance, EncodingContext.UPROOT],
    ]);
    console.log("Encoded Trees...");
    console.log("Uproot Swaps:", uprootInstance.map((step) => step.function?.id == SWAP_FUNCTION_ID
        ? [step, stepsToEncodedFunctions.get(step.id)]
        : null));
    const onchainSeedArr = encodeYCSteps(buildOnchainStepsList(seedInstance, stepsToEncodedFunctions));
    const onchainTreeArr = encodeYCSteps(buildOnchainStepsList(treeInstance, stepsToEncodedFunctions));
    const onchainUprootArr = encodeYCSteps(buildOnchainStepsList(uprootInstance, stepsToEncodedFunctions));
    console.log("Created Linked-Lists Of Steps...");
    const ycFactoryInstance = new ethers.Contract(network.diamondAddress, DiamondABI, new ethers.JsonRpcProvider(network.jsonRpc));
    const vaultCreationArgs = {
        seedSteps: onchainSeedArr,
        treeSteps: onchainTreeArr,
        uprootSteps: onchainUprootArr,
        approvalPairs,
        triggers,
        depositToken: depositToken.address,
        isPublic: vaultVisibility,
    };
    const deploymentCalldata = await ycFactoryInstance.createVault.populateTransaction(...Object.values(vaultCreationArgs));
    return {
        status: true,
        deploymentCalldata: deploymentCalldata.data,
        uprootSteps: uprootInstance.toJSON(false, false),
    };
}
//# sourceMappingURL=index.js.map