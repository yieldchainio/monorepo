import { CallbackTransaction, SendRawTransaction, SimplifiedFunction, address, EthersExecutor, EthersJsonRpcProvider } from "../../../offchain-types.js";
export declare const SearchCoarseUpperbound: (_provider: EthersJsonRpcProvider, _executor: EthersExecutor, _transactionFunction: SendRawTransaction | CallbackTransaction, _contractAddress: address, _func: SimplifiedFunction, _args: any[], _key: any, _upperBound: bigint, _lowerBound: bigint) => Promise<{
    upperBound: bigint;
    lowerBound: bigint;
}>;
