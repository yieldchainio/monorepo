import axios from "axios";
import { ethers } from "ethers";
import { DBNetwork, DBToken } from "src/types";
import erc20abi from "./erc20abi.json";

export const classifyOnchainToken = async (
  address: string,
  network: DBNetwork
): Promise<DBToken | null> => {
  console.log("Inside classifying token", address, network);
  if (!network.json_rpc) {
    console.log("NO json rpc serra");
    console.error("NO JSON RPC IN CLASSIFYONCHAIN TOKEN");
    return null;
  }
  try {
    address = ethers.getAddress(address);
  } catch (e: any) {
    console.log("INVALID ADDRESS IN CLASSIFYONCHAIN TOKEN");
    return null;
  }

  let provider = new ethers.JsonRpcProvider(network.json_rpc);

  console.log("Have provider in token", provider);

  let tokenContract = new ethers.Contract(address, erc20abi, provider);

  console.log("Have token contract in token", tokenContract);
  let name = await tokenContract.name();
  let symbol = await tokenContract.symbol();
  let decimals = await tokenContract.decimals();

  console.log("Got respones from contract", name, symbol, decimals);

  let object = {
    name: name,
    address: ethers.getAddress(address),
    symbol: symbol,
    decimals: parseInt(decimals),
    coinKey: symbol,
    priceUsd: null,
    chain_id: network.chain_id,
    markets: [],
  };

  console.log("Token Object", object);

  let tokenId = await (
    await axios.post("https://integrationapi.yieldchain.io/add-token/", object)
  ).data.token_identifier;

  console.log("Got token id", tokenId);

  console.log("Did The Post Request on Token", tokenId);

  let newObject = {
    token_identifier: tokenId,
    name: name,
    address: ethers.getAddress(address),
    symbol: symbol,
    decimals: parseInt(decimals),
    coinkey: symbol,
    priceusd: 0,
    chain_id: network.chain_id,
    markets: [],
    logo: "",
  };

  return newObject;
};
