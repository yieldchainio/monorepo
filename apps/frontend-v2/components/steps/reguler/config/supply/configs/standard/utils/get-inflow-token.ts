/**
 * Temp solution to get the inflow token of supplying
 */

import { YCProtocol, YCToken } from "@yc/yc-models";
import { Contract, ethers } from "ethers";

export async function getSupplyInflowTokens(
  protocol: YCProtocol,
  suppliedToken: YCToken
): Promise<YCToken> {
  if (protocol.id == "9ba2601c-be4e-4c78-823f-0644c54eb3b1")
    return getAaveV3SupplyInflow(suppliedToken);

  throw "No Inflow Getter Found";
}

async function getAaveV3SupplyInflow(suppliedToken: YCToken): Promise<YCToken> {
  const rpc = suppliedToken.network?.jsonRpc;

  if (!rpc) throw "Cant Get Aave Inflow - No Provider";

  const contract = new Contract(
    "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
    [
      "function getReservesTokensAddresses(address asset) view returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress)",
    ],
    new ethers.providers.JsonRpcProvider(rpc)
  );

  const res = await contract.getReservesTokensAddresses(suppliedToken.address);

  console.log("Res", res);
}
