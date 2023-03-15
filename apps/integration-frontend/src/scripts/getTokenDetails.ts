import { DBNetwork, DBToken } from "src/types";
import axios from "axios";
import { ethers } from "ethers";
import { classifyOnchainToken } from "./getOnchainToken";

export const getTokenDetails = async (
  _token_address: string,
  _network: DBNetwork
) => {
  let allTokens = await axios.get("https://api.yieldchain.io/tokens");
  let tokenDetails = allTokens.data.tokens.find(
    (token: DBToken) =>
      ethers.getAddress(token.address) === ethers.getAddress(_token_address)
  );

  if (tokenDetails == undefined) {
    // Get it's details and add it to the DB
    await classifyOnchainToken(_token_address, _network);
  }
};
