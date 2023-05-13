import { ethers } from "ethers";
import erc20abi from "../ABIs/ERC20.json" assert { type: "json" };
import getABI from "../ABIs/getStrategyABI.js";
import toBigInt from "../generic-utils/ToBigInt.js";
const abi = await getABI();
export const manualWithdraw = async (_tokenAddress, _contractAddress, _destination, _amount, _json_rpc_url) => {
    let provider = new ethers.JsonRpcProvider(_json_rpc_url);
    let wallet = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);
    let contract = new ethers.Contract(_contractAddress, abi, provider);
    let tokenContract = new ethers.Contract(_tokenAddress, erc20abi, wallet);
    let tokenBalance = (await tokenContract.balanceOf(_contractAddress)).toString();
    console.log("Inside Manual Withdraw", `Amout Inputted: ${_amount}, Token Balance: ${tokenBalance}`);
    /**
     * @notice
     * // TODO: This is a temporary fix for the case where the user inputs an amount greater than the token balance.
     * // TODO: I am not sure whether this is sufficient/Safe. I had noticed the main Reverse strategy script sometimes
     * // TODO: inputs an amount very slightly greater than the token balance (i.e, 100000000000001 instead of 100000000000000),
     */
    if (toBigInt(_amount) > toBigInt(tokenBalance)) {
        _amount = tokenBalance;
    }
    let transferAmount = _amount === "all" ? tokenBalance : _amount;
    let unsignedTx = await tokenContract["transfer"].populateTransaction(_destination, transferAmount);
    let transferAddressesArr = ethers.AbiCoder.defaultAbiCoder().encode(["address[]"], [[_tokenAddress]]);
    let transferCalldatasArr = ethers.AbiCoder.defaultAbiCoder().encode(["bytes[]"], [[unsignedTx.data]]);
    let transferValuesArr = ethers.AbiCoder.defaultAbiCoder().encode(["uint256[]"], [[0]]);
    let tx = await contract["callback_post"].populateTransaction([
        transferAddressesArr,
        transferCalldatasArr,
        transferValuesArr,
    ]);
    let txn = await wallet.sendTransaction(tx);
    await txn.wait();
    return txn;
};
//# sourceMappingURL=manualWithdraw.js.map