import { ethers, BytesLike } from "ethers";
import { address, EthersJsonRpcProvider } from "../../offchain-types.js";
import getABI from "../ABIs/getStrategyABI.js";
const abi = await getABI();

/*---------------------------------------------------------------
    // @StepGetter gets the step details from a strategy contract 
----------------------------------------------------------------*/
export const getStepDetails = async (
  _provider: EthersJsonRpcProvider,
  _contractAddress: address,
  _stepId: number | string
): Promise<{
  div: number;
  custom_arguments: BytesLike[];
}> => {
  const contract = new ethers.Contract(_contractAddress, abi, _provider);
  let stepDetails = await contract.getStepDetails(_stepId);
  stepDetails = {
    div: stepDetails["0"],
    custom_arguments: stepDetails["1"],
  };
  return stepDetails;
};
