import { address, EthersExecutor, EthersReceipt, ExtendedReceipt } from "../../offchain-types.js";
export declare const manyToOneSwap: (_provider: string, _contractAddress: address, _fromTokensArr: address[], _fromTokensAmounts: string[], _toToken: address, _executor: EthersExecutor) => Promise<EthersReceipt | ExtendedReceipt | null>;
