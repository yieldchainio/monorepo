import { address, EthersJsonRpcProvider } from "../../offchain-types.js";
import { BaseTokensList } from "../../offchain-types.js";
export declare const getTokenBalances: (_provider: EthersJsonRpcProvider, _contractAddress: address, _tokensList: BaseTokensList) => Promise<Map<string, string>>;
