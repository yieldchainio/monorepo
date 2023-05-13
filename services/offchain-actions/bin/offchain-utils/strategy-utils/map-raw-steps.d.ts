import { address, EthersJsonRpcProvider, ExtendedStepDetails } from "../../offchain-types.js";
declare const stepIDsToSteps: (_steps: bigint[], _provider: EthersJsonRpcProvider, _contractAddress: address) => Promise<ExtendedStepDetails[]>;
export default stepIDsToSteps;
