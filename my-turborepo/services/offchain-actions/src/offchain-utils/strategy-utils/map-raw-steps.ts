import {
  address,
  EthersJsonRpcProvider,
  ExtendedStepDetails,
} from "../../offchain-types.js";
import { ethers, BytesLike } from "ethers";
import { getStepDetails } from "./get-step.js";

const stepIDsToSteps = async (
  _steps: bigint[],
  _provider: EthersJsonRpcProvider,
  _contractAddress: address
): Promise<ExtendedStepDetails[]> => {
  let newArr = await Promise.all(
    _steps.map(async (stepId: bigint) => {
      let stepDetails: { div: number; custom_arguments: BytesLike[] } =
        await getStepDetails(_provider, _contractAddress, Number(stepId));
      return {
        ...stepDetails,
        stepId: Number(stepId),
      };
    })
  );

  return newArr;
};

export default stepIDsToSteps;
