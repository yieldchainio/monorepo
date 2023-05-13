import { address, DBToken, EthersJsonRpcProvider } from "../../offchain-types";
declare const getStrategyTokens: (_contractAddress: address, _provider: EthersJsonRpcProvider) => Promise<DBToken[]>;
export default getStrategyTokens;
