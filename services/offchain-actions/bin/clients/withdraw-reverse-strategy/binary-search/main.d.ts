import { CallbackTransaction, SendRawTransaction, SimplifiedFunction, BaseTokensList, address, EthersExecutor, EthersJsonRpcProvider } from "../../../offchain-types.js";
export declare const MainBinarySearch: (_provider: EthersJsonRpcProvider, _executor: EthersExecutor, _transactionFunction: SendRawTransaction | CallbackTransaction, _contractAddress: address, _func: SimplifiedFunction, _args: any[], _key: any, isCallback: boolean, _upperBound: bigint, _lowerBound: bigint, _tokensList: BaseTokensList, _divideBy: number) => Promise<{
    amountToSet: bigint;
    sharesCalculatedMapping: Map<string, boolean>;
    keepFunction: boolean;
}>;
