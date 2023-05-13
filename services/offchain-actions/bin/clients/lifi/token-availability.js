import axios from "axios";
import { ethers } from "ethers";
const isTokenOnLifi = async (tokenAddress) => {
    if (tokenAddress == (null || undefined))
        return false;
    if (typeof tokenAddress == "object") {
        return tokenAddress.markets.includes(3 || "3");
    }
    let address = ethers.getAddress(tokenAddress);
    let allTokens /* Axios Response */ = await axios.get("https://api.yieldchain.io/tokens");
    let fullToken = allTokens.data.tokens.find((token) => ethers.getAddress(token.address) === address);
    if (fullToken) {
        return fullToken.markets.includes(3);
    }
    else {
        return false;
    }
};
export default isTokenOnLifi;
//# sourceMappingURL=token-availability.js.map