import axios from "axios";
import { ethers } from "ethers";
import getABI from "../ABIs/getStrategyABI.js";
const abi = await getABI();
const getStrategyTokens = async (_contractAddress, _provider) => {
    // Contract instance of the strategy
    let contractInstance = new ethers.Contract(_contractAddress, abi, _provider);
    // Token addresses relating to the strategy (Fetched directly from the contract using the @getTokens view function)
    let tokens = await contractInstance.getTokens();
    // All tokens in the YieldChain database
    let allYCTokens = await (await axios.get("https://api.yieldchain.io/tokens")).data.tokens;
    // The chain ID of the current network (To avoid using a token w the same address on a different network)
    let chainId = (await _provider.getNetwork()).chainId;
    // Filter the tokens in the database to only include the tokens that are used in the strategy
    let strategyTokens = allYCTokens.filter((token) => tokens.find((tokenAddress) => ethers.getAddress(tokenAddress) === ethers.getAddress(token.address) &&
        token.chain_id == Number(chainId)));
    // Return the array of tokens relating to the strategy, with all of their details
    return strategyTokens;
};
export default getStrategyTokens;
//# sourceMappingURL=get-strategy-tokens.js.map