import { ethers } from "ethers";
import { address, EthersJsonRpcProvider } from "../../offchain-types.js";
import { BaseTokensList } from "../../offchain-types.js";
import erc20abi from "../ABIs/ERC20.json" assert { type: "json" };
/*---------------------------------------------------------------
    // @TokenBalancesGetter gets the balances of all of the tokens  
----------------------------------------------------------------*/
export const getTokenBalances = async (
  _provider: EthersJsonRpcProvider,
  _contractAddress: address,
  _tokensList: BaseTokensList
) => {
  let tokenBalances = new Map<address, string>(); // Address => Balance

  let pendingBalances = _tokensList.map(async (token) => {
    let balance = (
      await new ethers.Contract(token.address, erc20abi, _provider).balanceOf(
        _contractAddress
      )
    ).toString();
    tokenBalances.set(ethers.getAddress(token.address), balance);
  });
  await Promise.all(pendingBalances);
  return tokenBalances;
};
