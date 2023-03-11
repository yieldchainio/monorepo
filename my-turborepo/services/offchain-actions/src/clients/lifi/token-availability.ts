import axios from "axios";
import { ethers } from "ethers";
import { address, DBToken } from "../../offchain-types";
const isTokenOnLifi = async (
  tokenAddress: string | DBToken | null
): Promise<boolean> => {
  if (tokenAddress == (null || undefined)) return false;
  if (typeof tokenAddress == "object") {
    return tokenAddress.markets.includes(3 || "3");
  }
  let address: address = ethers.getAddress(tokenAddress);
  let allTokens: any /* Axios Response */ = await axios.get(
    "https://api.yieldchain.io/tokens"
  );
  let fullToken: DBToken = allTokens.data.tokens.find(
    (token: DBToken) => ethers.getAddress(token.address) === address
  );
  if (fullToken) {
    return fullToken.markets.includes(3);
  } else {
    return false;
  }
};

export default isTokenOnLifi;
