import { ethers } from "ethers";
import {
  TokenBalancesMapping,
  SharesCalculatedMapping,
  address,
  SimplifiedFunction,
  EthersJsonRpcProvider,
} from "../../offchain-types.js";
import toBigInt from "../generic-utils/ToBigInt.js";
import deepCopyMap from "../generic-utils/deep-copy-map.js";
import erc20abi from "../ABIs/ERC20.json" assert { type: "json" };

/**
 * @notice Here we are iterating over the mapping of token addresses to a boolean indicating whether or not the token inflow from the function
 * is already calculated by the share, or not.
 * If the token inflow is not already calculated by the share, we calculate how much of that inflow belongs to the user, and add it to the mapping
 * of tokens to transfer to the user.
 */

const getTokenAmountToTransfer = async (
  _trueFalseMapping: SharesCalculatedMapping,
  _preChangesMapping: TokenBalancesMapping,
  _tokensToTransferAmount: Map<address, string>,
  _func: SimplifiedFunction,
  _provider: EthersJsonRpcProvider,
  _withdrawShare: number
) => {
  let trueFalseMapping = deepCopyMap(_trueFalseMapping);
  let preChangesMapping = deepCopyMap(_preChangesMapping);
  let tokensToTransferAmount = deepCopyMap(_tokensToTransferAmount);
  let func = _func;
  let originalProvider = _provider;
  let withdrawShare = _withdrawShare;

  for await (const [tokenAddress, alreadyCalculated] of trueFalseMapping) {
    // The change in balance of the token
    let change: string =
      preChangesMapping.get(ethers.getAddress(tokenAddress)) || "0";
    console.log(
      "iterating on token address",
      tokenAddress,
      "Inide Func " + func.name,
      "change:",
      change
    );

    // The previous amount to transfer to the user (if any, so that we can add to it rather than override it)
    let prevTransferAmt = tokensToTransferAmount.get(
      ethers.getAddress(tokenAddress)
    );
    let symbol = await new ethers.Contract(
      tokenAddress,
      erc20abi,
      originalProvider
    ).symbol();

    console.log(
      "Inside true false mapping, symbol: ",
      symbol,
      `prev transfer amount: ${prevTransferAmt}`
    );

    // The amount to transfer to the user.
    // Based on the prev transfer amount + the change + whether it is calculated by share by default
    let amtToSet = (
      toBigInt(prevTransferAmt || 0) +
      toBigInt(change) /
        toBigInt(
          parseInt((alreadyCalculated ? 1 : 100 / withdrawShare).toString())
        )
    ).toString();

    // Setting the amount to transfer to the user
    tokensToTransferAmount.set(ethers.getAddress(tokenAddress), amtToSet);
    console.log(
      `Amt to set for token ${symbol}: ${amtToSet} after function ${func.name}`
    );
  }
  return tokensToTransferAmount;
};
export default getTokenAmountToTransfer;
