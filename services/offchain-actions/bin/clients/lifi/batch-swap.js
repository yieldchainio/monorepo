import { ethers } from "ethers";
import axios from "axios";
import dotenv from "dotenv";
import { EthersExecutor, } from "../../offchain-types.js";
import getABI from "../../offchain-utils/ABIs/getStrategyABI.js";
import erc20abi from "../../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
import { sendRawTransaction } from "../../offchain-utils/transaction-utils/RawTransaction.js";
import toBigInt from "../../offchain-utils/generic-utils/ToBigInt.js";
import isTokenOnLifi from "./token-availability.js";
const abi = await getABI();
dotenv.config();
export const lifibatchswap = async (_provider, _contractAddress, _operationFuncToCall, _args_bytes_arr) => {
    // The base URL for the quote
    let quote_url = "https://li.quest/v1/quote";
    let provider = new ethers.JsonRpcProvider(_provider);
    let fromChain = Number(await provider.getNetwork().then((res) => res.chainId));
    let toChain = fromChain;
    let fromToken = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[1])[0];
    let toTokensArr = ethers.AbiCoder.defaultAbiCoder().decode(["address[]"], _args_bytes_arr[2])[0];
    let totalFromAmount = ethers.AbiCoder.defaultAbiCoder().decode(["uint"], _args_bytes_arr[3])[0];
    let toTokensDivs = ethers.AbiCoder.defaultAbiCoder().decode(["uint256[]"], _args_bytes_arr[4])[0];
    let toAddress = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[5])[0];
    let funcToCall = _operationFuncToCall;
    let callingAddressesArr = [];
    let calldataArr = [];
    let nativeValuesArr = [];
    // Filtering from tokens to only include ones available on LiFi
    toTokensArr = await Promise.all(toTokensArr.map(async (tokenAddress) => {
        let isAvailableOnLifi = await isTokenOnLifi(tokenAddress);
        if (isAvailableOnLifi) {
            return ethers.getAddress(tokenAddress);
        }
        else {
            return "null";
        }
    }));
    // Removing Nulls
    // *** string to avoid type errors
    toTokensArr = toTokensArr.filter((token, index) => {
        if (typeof token === "number")
            return false;
        if (token === "null" ||
            token === null ||
            token === undefined ||
            token === "") {
            toTokensDivs.splice(index, 1);
            return false;
        }
        return true;
    });
    if (toTokensArr.length > 0) {
        for await (const toToken of toTokensArr) {
            let index = toTokensArr.indexOf(toToken);
            let quote = (await axios.get(`${quote_url}?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAddress=${_contractAddress}&toAddress=${toAddress}&fromAmount=${totalFromAmount / toTokensDivs[index]}`)).data.transactionRequest;
            let addressToCallOn = quote.to;
            let nativeValue = quote.value;
            let callData = quote.data;
            /* --------------------------------------------------------------------------------------------------------------
             * @notice
             * Checks to see if address to call on is in/not yet inside the callingAddressesArr,
             * If not, Before Pushing it, it first pushes the fromToken address to the array.
             * This is for the contract to detect it as an approval and not a swap, and approve the LiFi Contract
             * to spend the fromToken on behalf of the contract.
             ---------------------------------------------------------------------------------------------------------------*/
            if (!callingAddressesArr.includes(addressToCallOn)) {
                // populate calldata for approval function call
                let tokenContract = new ethers.Contract(fromToken, erc20abi, provider);
                let calldata = tokenContract.interface.encodeFunctionData("approve", [
                    addressToCallOn,
                    ethers.MaxUint256,
                ]);
                callingAddressesArr.push(fromToken);
                calldataArr.push(calldata);
                nativeValuesArr.push("0");
            }
            /* --------------------------------------------------------------------------------------------------------------
             * Pushes the address to call on, the calldata to use when calling, and the native value - into their corresponding
             * Arrays. These arrays will be used to multicall the swap function in the LiFi Contract.
             ---------------------------------------------------------------------------------------------------------------*/
            callingAddressesArr.push(ethers.getAddress(addressToCallOn));
            calldataArr.push(callData);
            nativeValuesArr.push(toBigInt(nativeValue).toString());
        }
    }
    /* --------------------------------------------------------------------------------------------------------------
    * Encodes all arrays in the default ABI Format, pushes them into a "bytes" array.
    ---------------------------------------------------------------------------------------------------------------*/
    let encodedCallingAddressesArr = ethers.AbiCoder.defaultAbiCoder().encode(["address[]"], [callingAddressesArr]);
    let encodedCalldataArr = ethers.AbiCoder.defaultAbiCoder().encode(["bytes[]"], [calldataArr]);
    let encodedNativeValuesArr = ethers.AbiCoder.defaultAbiCoder().encode(["uint256[]"], [nativeValuesArr]);
    let bytesArrToPost = [
        encodedCallingAddressesArr,
        encodedCalldataArr,
        encodedNativeValuesArr,
    ];
    // Creates a new ethers wallet instance (To Call The Strategy Contract With)
    let wallet = new EthersExecutor("0x" + process.env.PRIVATE_KEY, provider);
    // Sends the transaction to the strategy contract, calling the required function with the array of bytes as an arg
    let receipt = await sendRawTransaction(provider, _contractAddress, funcToCall, [bytesArrToPost], wallet);
    // Returns the receipt
    return receipt;
};
//# sourceMappingURL=batch-swap.js.map