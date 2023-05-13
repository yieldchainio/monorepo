import { BytesLike } from "ethers";
import { address, EthersJsonRpcProvider } from "../../offchain-types.js";
export declare const getStepDetails: (_provider: EthersJsonRpcProvider, _contractAddress: address, _stepId: number | string) => Promise<{
    div: number;
    custom_arguments: BytesLike[];
}>;
