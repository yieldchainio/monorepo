import { ethers } from "ethers";
import erc20abi from "../../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
import { lifiswap } from "./swap.js";
import toBigInt from "../../offchain-utils/generic-utils/ToBigInt.js";
export const reverseLifiSwap = async (_provider, _contractAddress, _operationFuncToCall, _args_bytes_arr) => {
    console.log("Reverse Lifi Swap Called");
    let provider = new ethers.JsonRpcProvider(_provider);
    let fromChain = Number(await provider.getNetwork().then((res) => res.chainId));
    let toChain = fromChain;
    let fromToken = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[1])[0];
    let toToken = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[2])[0];
    let toAddress = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[4])[0];
    let fromAmount = toBigInt(await new ethers.Contract(fromToken, erc20abi, provider).balanceOf(_contractAddress)).toString();
    let funcToCall = _operationFuncToCall;
    let newArgs = [
        ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [toChain]),
        ethers.AbiCoder.defaultAbiCoder().encode(["address"], [fromToken]),
        ethers.AbiCoder.defaultAbiCoder().encode(["address"], [toToken]),
        ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [fromAmount]),
        ethers.AbiCoder.defaultAbiCoder().encode(["address"], [toAddress]),
    ];
    return await lifiswap(_provider, _contractAddress, funcToCall, newArgs);
};
//# sourceMappingURL=reverse-swap.js.map