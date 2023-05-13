import { ethers } from "ethers";
import getABI from "../ABIs/getStrategyABI.js";
const abi = await getABI();
/*---------------------------------------------------------------
    // @StepGetter gets the step details from a strategy contract
----------------------------------------------------------------*/
export const getStepDetails = async (_provider, _contractAddress, _stepId) => {
    const contract = new ethers.Contract(_contractAddress, abi, _provider);
    let stepDetails = await contract.getStepDetails(_stepId);
    stepDetails = {
        div: stepDetails["0"],
        custom_arguments: stepDetails["1"],
    };
    return stepDetails;
};
//# sourceMappingURL=get-step.js.map