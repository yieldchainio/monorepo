/**
 * Temp solution to get the inflow token of supplying
 */

import { YCClassifications, YCProtocol, YCToken } from "@yc/yc-models";
import { Contract, ethers } from "ethers";
import { v4 } from "uuid";
import ERC20Abi from "@yc/yc-models/src/ABIs/erc20.json" assert { type: "json" };

export async function getSupplyInflowTokens(
  protocol: YCProtocol,
  suppliedToken: YCToken
): Promise<YCToken> {
  if (protocol.id == "9ba2601c-be4e-4c78-823f-0644c54eb3b1")
    return getAaveV3SupplyInflow(suppliedToken, protocol);

  throw "No Inflow Getter Found";
}

async function getAaveV3SupplyInflow(
  suppliedToken: YCToken,
  protocol: YCProtocol
): Promise<YCToken> {
  const rpc = suppliedToken.network?.jsonRpc;

  if (!rpc) throw "Cant Get Aave Inflow - No Provider";
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const contract = new Contract(
    "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
    [
      "function getReserveTokensAddresses(address asset) view returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress)",
    ],
    provider
  );

  const res = await contract.callStatic.getReserveTokensAddresses(
    suppliedToken.address
  );

  const aToken = res.aTokenAddress;

  const tokenContract = new ethers.Contract(aToken, ERC20Abi, provider);

  const symbol = await tokenContract.callStatic.symbol();
  const decimals = await tokenContract.callStatic.decimals();

  const token =
    YCClassifications.getInstance().tokens.find(
      (_token) =>
        _token.address == aToken &&
        _token.network?.id == suppliedToken.network?.id
    ) ||
    new YCToken(
      {
        id: v4(),
        name: `${protocol.name} ${suppliedToken.symbol}`,
        symbol: symbol,
        decimals: decimals,
        address: aToken,
        logo: "https://etherscan.io/images/main/empty-token.png",
        markets_ids: [protocol.id],
        chain_id: suppliedToken.network.id,
        tags: [],
        parent_protocol: protocol.id,
      },
      YCClassifications.getInstance()
    );

  return token;
}
