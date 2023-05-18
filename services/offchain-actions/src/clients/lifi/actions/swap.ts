/**
 * Reguler swap action for lifi
 */
import {} from "dotenv/config.js";
import { ethers, BytesLike, Wallet, JsonRpcProvider } from "ethers";
import axios from "axios";
import {
  address,
  bytes,
  EthersExecutor,
  EthersReceipt,
  SQSOnchainLog,
  YcCommand,
} from "@yc/yc-models";
import { LifiQuoteRequest } from "../types.js";

export const lifiSwap = async (request: SQSOnchainLog): Promise<YcCommand> => {
  const quote_url: string = "https://li.quest/v1/quote";
  const provider: JsonRpcProvider = new ethers.JsonRpcProvider(request.rpc_url);

  // A reguler swap - Chains remain the same
  const fromChain: number = Number((await provider.getNetwork()).chainId);
  const toChain: number = fromChain;

  // const fromToken: address = ethers.AbiCoder.defaultAbiCoder().decode(
  //   ["address"],
  //   _args_bytes_arr[1]
  // )[0];
  // let toToken: address = ethers.AbiCoder.defaultAbiCoder().decode(
  //   ["address"],
  //   _args_bytes_arr[2]
  // )[0];
  // let fromAmount: number = ethers.AbiCoder.defaultAbiCoder().decode(
  //   ["uint256"],
  //   _args_bytes_arr[3]
  // )[0];

  // let fromTokenContract = new ethers.Contract(
  //   ethers.getAddress(fromToken),
  //   erc20abi,
  //   provider
  // );
  // let toTokenContract = new ethers.Contract(
  //   ethers.getAddress(toToken),
  //   erc20abi,
  //   provider
  // );

  // console.log(
  //   `Swapping ${ethers.formatUnits(
  //     fromAmount.toString(),
  //     await fromTokenContract.decimals()
  //   )} ${await fromTokenContract.symbol()} to ${await toTokenContract.symbol()} In Reverse Swap`
  // );
  // let toAddress: address = ethers.AbiCoder.defaultAbiCoder().decode(
  //   ["address"],
  //   _args_bytes_arr[4]
  // )[0];
  // let funcToCall: string = _operationFuncToCall;

  // /* --------------------------------------------------------------------------------------------------------------
  //  * @notice
  //  * Getting a quote through the LiFi API For the requested swap
  //  * ---------------------------------------------------------------------------------------------------------------*/
  // let fullUrl: string = `${quote_url}?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAddress=${_contractAddress}&toAddress=${toAddress}&fromAmount=${fromAmount}`;
  // let quote: null | LifiQuoteRequest = null;
  // // Recrusive Retries of the API Call to LiFi's quotes. Incase it fails
  // let retries: number = 0;
  // const getQuote = async () => {
  //   try {
  //     quote = (await axios.get(fullUrl)).data.transactionRequest;
  //     return true;
  //   } catch (e: any) {
  //     console.log("Err In Lifiswap", e);
  //     retries++;
  //     if (retries < 5) {
  //       await new Promise((r) => setTimeout(r, 1000));
  //       await getQuote();
  //     } else {
  //       console.error("Failed to get quote from LiFi");
  //     }
  //   }
  // };

  // if (fromAmount > 0 && (await isTokenOnLifi(fromToken))) {
  //   await getQuote();
  // }

  // if (quote === null) {
  //   return;
  // }

  // /* --------------------------------------------------------------------------------------------------------------
  //  * The Arrays To Encode Into The Bytes Array To Be Sent To The Strategy Contract
  //  * ---------------------------------------------------------------------------------------------------------------*/
  // let callingAddressesArr: string[] = [];
  // let calldataArr: string[] = [];
  // let nativeValuesArr: Array<string | number> = [];

  // // The Address the swap should be called on (The LiFi Diamond, If they end up changing the architecture and adding
  // // Multiple contract choices, it would choose them instead.)
  // let addressToCallOn: address =
  //   quote["to"] || "0x0000000000000000000000000000000000000001";
  // let nativeValue: string = toBigInt(quote["value"]).toString() || "0";
  // let callData: BytesLike = quote["data"] || "0x";

  // /* --------------------------------------------------------------------------------------------------------------
  //    * @notice
  //    * Checks to see if address to call on is in/not yet inside the callingAddressesArr,
  //    * If not, Before Pushing it, it first pushes the fromToken address to the array.
  //    * This is for the contract to detect it as an approval and not a swap, and approve the LiFi Contract
  //    * to spend the fromToken on behalf of the contract.
  //    ---------------------------------------------------------------------------------------------------------------*/
  // let tokenContract = new ethers.Contract(fromToken, erc20abi, provider);
  // let calldata = tokenContract.interface.encodeFunctionData("approve", [
  //   addressToCallOn,
  //   ethers.MaxUint256,
  // ]);

  // callingAddressesArr.push(fromToken);
  // calldataArr.push(calldata);
  // nativeValuesArr.push("0");

  // /* --------------------------------------------------------------------------------------------------------------
  //    * Pushes the address to call on, the calldata to use when calling, and the native value - into their corresponding
  //    * Arrays. These arrays will be used to "multicall" the swap function in the LiFi Contract.
  //    ---------------------------------------------------------------------------------------------------------------*/
  // callingAddressesArr.push(addressToCallOn);
  // calldataArr.push(callData);
  // nativeValuesArr.push(
  //   parseInt(ethers.parseEther(parseInt(nativeValue).toString()).toString())
  // );
  // // Formats All Addresses To Their Checksum'ed Format
  // callingAddressesArr = callingAddressesArr.map(
  //   (address) => (address = ethers.getAddress(address))
  // );

  // /* --------------------------------------------------------------------------------------------------------------
  // * Encodes all arrays in the default ABI Format, pushes them into a "bytes" array.
  // ---------------------------------------------------------------------------------------------------------------*/
  // let encodedCallingAddressesArr: BytesLike =
  //   ethers.AbiCoder.defaultAbiCoder().encode(
  //     ["address[]"],
  //     [callingAddressesArr]
  //   );
  // let encodedCalldataArr: BytesLike = ethers.AbiCoder.defaultAbiCoder().encode(
  //   ["bytes[]"],
  //   [calldataArr]
  // );
  // let encodedNativeValuesArr: BytesLike =
  //   ethers.AbiCoder.defaultAbiCoder().encode(["uint256[]"], [nativeValuesArr]);
  // let bytesArrToPost: BytesLike[] = [
  //   encodedCallingAddressesArr,
  //   encodedCalldataArr,
  //   encodedNativeValuesArr,
  // ];

  // // Creates a new ethers wallet instance (To Call The Strategy Contract With)
  // let wallet: EthersExecutor = new EthersExecutor(
  //   "0x" + process.env.PRIVATE_KEY,
  //   provider
  // );
  // try {
  //   // Sends the transaction to the strategy contract, calling the required function with the array of bytes as an arg
  //   let receipt: EthersReceipt | ExtendedReceipt | null =
  //     await sendRawTransaction(
  //       provider,
  //       _contractAddress,
  //       funcToCall,
  //       [bytesArrToPost],
  //       wallet
  //     );

  //   console.log("Returning Lifiswap Receipt, Logs:", receipt?.logs?.length);
  //   return receipt;
  // } catch (e: any) {
  //   console.error("The annoying erro in LifiSwap");
  // }
  return `0xhey`;
};
