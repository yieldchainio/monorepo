import { TokenBalancesMapping, SharesCalculatedMapping, address, SimplifiedFunction, EthersJsonRpcProvider } from "../../offchain-types.js";
/**
 * @notice Here we are iterating over the mapping of token addresses to a boolean indicating whether or not the token inflow from the function
 * is already calculated by the share, or not.
 * If the token inflow is not already calculated by the share, we calculate how much of that inflow belongs to the user, and add it to the mapping
 * of tokens to transfer to the user.
 */
declare const getTokenAmountToTransfer: (_trueFalseMapping: SharesCalculatedMapping, _preChangesMapping: TokenBalancesMapping, _tokensToTransferAmount: Map<address, string>, _func: SimplifiedFunction, _provider: EthersJsonRpcProvider, _withdrawShare: number) => Promise<Map<string, string>>;
export default getTokenAmountToTransfer;
