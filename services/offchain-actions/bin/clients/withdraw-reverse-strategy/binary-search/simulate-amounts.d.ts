import { EthersJsonRpcProvider, address, SimplifiedFunction, BaseTokensList, EthersExecutor, SharesCalculatedMapping } from "../../../offchain-types.js";
declare const simulateFunction: (_provider: EthersJsonRpcProvider, _contractAddress: address, _func: SimplifiedFunction, _args: any[], _tokensList: BaseTokensList, divideBy: number, _executor: EthersExecutor) => Promise<{
    argsForCall: any[];
    sharesCalculatedMapping: SharesCalculatedMapping;
    shouldKeepFunction: boolean;
}>;
export default simulateFunction;
