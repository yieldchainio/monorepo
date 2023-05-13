import { ethers } from "ethers";
import axios from "axios";
import { EthersExecutor, } from "../../offchain-types.js";
import { sendRawTransaction } from "../../offchain-utils/transaction-utils/RawTransaction.js";
import getABI from "../../offchain-utils/ABIs/getStrategyABI.js";
import toBigInt from "../../offchain-utils/generic-utils/ToBigInt.js";
import erc20abi from "../../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
import isTokenOnLifi from "./token-availability.js";
const abi = await getABI();
export const lifiswap = async (_provider, _contractAddress, _operationFuncToCall, _args_bytes_arr) => {
    let quote_url = "https://li.quest/v1/quote";
    let provider = new ethers.JsonRpcProvider(_provider);
    /* --------------------------------------------------------------------------------------------------------------
     * @notice
     * Decoding encoded args from the array inputted by the event emitted
     * ---------------------------------------------------------------------------------------------------------------*/
    let fromChain = Number((await provider.getNetwork()).chainId);
    let toChain = fromChain;
    let fromToken = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[1])[0];
    let toToken = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[2])[0];
    let fromAmount = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], _args_bytes_arr[3])[0];
    let fromTokenContract = new ethers.Contract(ethers.getAddress(fromToken), erc20abi, provider);
    let toTokenContract = new ethers.Contract(ethers.getAddress(toToken), erc20abi, provider);
    console.log(`Swapping ${ethers.formatUnits(fromAmount.toString(), await fromTokenContract.decimals())} ${await fromTokenContract.symbol()} to ${await toTokenContract.symbol()} In Reverse Swap`);
    let toAddress = ethers.AbiCoder.defaultAbiCoder().decode(["address"], _args_bytes_arr[4])[0];
    let funcToCall = _operationFuncToCall;
    /* --------------------------------------------------------------------------------------------------------------
     * @notice
     * Getting a quote through the LiFi API For the requested swap
     * ---------------------------------------------------------------------------------------------------------------*/
    let fullUrl = `${quote_url}?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAddress=${_contractAddress}&toAddress=${toAddress}&fromAmount=${fromAmount}`;
    let quote = null;
    // Recrusive Retries of the API Call to LiFi's quotes. Incase it fails
    let retries = 0;
    const getQuote = async () => {
        try {
            quote = (await axios.get(fullUrl)).data.transactionRequest;
            return true;
        }
        catch (e) {
            console.log("Err In Lifiswap", e);
            retries++;
            if (retries < 5) {
                await new Promise((r) => setTimeout(r, 1000));
                await getQuote();
            }
            else {
                console.error("Failed to get quote from LiFi");
            }
        }
    };
    if (fromAmount > 0 && (await isTokenOnLifi(fromToken))) {
        await getQuote();
    }
    if (quote === null) {
        return;
    }
    /* --------------------------------------------------------------------------------------------------------------
     * The Arrays To Encode Into The Bytes Array To Be Sent To The Strategy Contract
     * ---------------------------------------------------------------------------------------------------------------*/
    let callingAddressesArr = [];
    let calldataArr = [];
    let nativeValuesArr = [];
    // The Address the swap should be called on (The LiFi Diamond, If they end up changing the architecture and adding
    // Multiple contract choices, it would choose them instead.)
    let addressToCallOn = quote["to"] || "0x0000000000000000000000000000000000000001";
    let nativeValue = toBigInt(quote["value"]).toString() || "0";
    let callData = quote["data"] || "0x";
    /* --------------------------------------------------------------------------------------------------------------
       * @notice
       * Checks to see if address to call on is in/not yet inside the callingAddressesArr,
       * If not, Before Pushing it, it first pushes the fromToken address to the array.
       * This is for the contract to detect it as an approval and not a swap, and approve the LiFi Contract
       * to spend the fromToken on behalf of the contract.
       ---------------------------------------------------------------------------------------------------------------*/
    let tokenContract = new ethers.Contract(fromToken, erc20abi, provider);
    let calldata = tokenContract.interface.encodeFunctionData("approve", [
        addressToCallOn,
        ethers.MaxUint256,
    ]);
    callingAddressesArr.push(fromToken);
    calldataArr.push(calldata);
    nativeValuesArr.push("0");
    /* --------------------------------------------------------------------------------------------------------------
       * Pushes the address to call on, the calldata to use when calling, and the native value - into their corresponding
       * Arrays. These arrays will be used to "multicall" the swap function in the LiFi Contract.
       ---------------------------------------------------------------------------------------------------------------*/
    callingAddressesArr.push(addressToCallOn);
    calldataArr.push(callData);
    nativeValuesArr.push(parseInt(ethers.parseEther(parseInt(nativeValue).toString()).toString()));
    // Formats All Addresses To Their Checksum'ed Format
    callingAddressesArr = callingAddressesArr.map((address) => (address = ethers.getAddress(address)));
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
    try {
        // Sends the transaction to the strategy contract, calling the required function with the array of bytes as an arg
        let receipt = await sendRawTransaction(provider, _contractAddress, funcToCall, [bytesArrToPost], wallet);
        console.log("Returning Lifiswap Receipt, Logs:", receipt?.logs?.length);
        return receipt;
    }
    catch (e) {
        console.error("The annoying erro in LifiSwap");
    }
};
//# sourceMappingURL=swap.js.map