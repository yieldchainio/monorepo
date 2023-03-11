import {} from "dotenv/config.js";
import { ethers, BytesLike } from "ethers";
import axios from "axios";
import {
  address,
  DBToken,
  EthersExecutor,
  EthersJsonRpcProvider,
  EthersReceipt,
  ExtendedReceipt,
} from "../../offchain-types.js";
import { LifiQuoteRequest } from "./types.js";
import toBigInt from "../../offchain-utils/generic-utils/ToBigInt.js";
import erc20abi from "../../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
import isTokenOnLifi from "./token-availability.js";
import getABI from "../../offchain-utils/ABIs/getStrategyABI.js";
import dotenv from "dotenv";
import { sendRawTransaction } from "../../offchain-utils/transaction-utils/RawTransaction.js";
dotenv.config();
const abi = await getABI();

export const manyToOneSwap = async (
  _provider: string,
  _contractAddress: address,
  _fromTokensArr: address[],
  _fromTokensAmounts: string[],
  _toToken: address,
  _executor: EthersExecutor
): Promise<EthersReceipt | ExtendedReceipt | null> => {
  let quote_url: string = "https://li.quest/v1/quote";
  let provider: EthersJsonRpcProvider = new ethers.JsonRpcProvider(_provider);

  /* --------------------------------------------------------------------------------------------------------------
   * @notice
   * Decoding encoded args from the array inputted by the event emitted
   * ---------------------------------------------------------------------------------------------------------------*/
  let toChain: string = (await provider.getNetwork()).chainId.toString();
  let fromChain: string = toChain;

  console.log("Initial From tokens", _fromTokensArr);
  console.log("Initial From amounts", _fromTokensAmounts);

  // Filtering from tokens to only include ones available on LiFi
  let fromTokens: Array<address> = await Promise.all(
    _fromTokensArr.map(async (tokenAddress: address) => {
      let isAvailableOnLifi = await isTokenOnLifi(tokenAddress);
      if (isAvailableOnLifi) {
        return ethers.getAddress(tokenAddress);
      } else {
        return "null";
      }
    })
  );

  console.log("From Tokens After Initial Map", fromTokens);
  console.log("From Amounts After Initial Map", _fromTokensAmounts);

  // Removing Nulls
  // *** string to avoid type errors
  console.log("From Tokens Before Filter", fromTokens);
  console.log("From Amounts Before Filter", _fromTokensAmounts);
  fromTokens = fromTokens.filter((token: address, index: number) => {
    if (token == "null") {
      _fromTokensAmounts[index] = "null";
      return false;
    } else {
      return true;
    }
  });

  console.log("From Tokens after initial FILTER", fromTokens);
  console.log("From Amounts after initial FILTER", _fromTokensAmounts);

  _fromTokensAmounts = _fromTokensAmounts.filter(
    (token: address) => token !== "null"
  );

  console.log("From Tokens after FILTERING of amounts", fromTokens);
  console.log("From Amounts after FILTERING of amounts", _fromTokensAmounts);

  let toToken: address = _toToken;
  let fromAmounts: string[] = _fromTokensAmounts;
  let toAddress: address = _contractAddress;

  /* --------------------------------------------------------------------------------------------------------------
   * The Arrays To Encode Into The Bytes Array To Be Sent To The Strategy Contract
   * ---------------------------------------------------------------------------------------------------------------*/
  let callingAddressesArr: address[] = [];
  let calldataArr: BytesLike[] = [];
  let nativeValuesArr: string[] = [];

  /* --------------------------------------------------------------------------------------------------------------
   * @notice
   * Getting a quote through the LiFi API For the requested swap
   * ---------------------------------------------------------------------------------------------------------------*/
  for await (const fromToken of fromTokens) {
    let index: number = fromTokens.indexOf(fromToken);
    let fromAmount: string = fromAmounts[index];
    console.log(
      "Iterating Over Token: ",
      fromToken,
      "Index: ",
      index,
      "FromAmount: ",
      fromAmount
    );
    let fullUrl: string = `${quote_url}?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAddress=${_contractAddress}&toAddress=${toAddress}&fromAmount=${fromAmount}`;

    let quote: null | LifiQuoteRequest = null;
    // Recrusive Retries of the API Call to LiFi's quotes. Incase it fails
    let retries: number = 0;
    const getQuote = async () => {
      try {
        quote = (await axios.get(fullUrl)).data.transactionRequest;
        return true;
      } catch (e: any) {
        retries++;
        if (retries < 5) {
          await new Promise((r) => setTimeout(r, 1000));
          await getQuote();
        } else {
          console.error("Error In LifiSwap, Message: ", e.message);
        }
      }
    };

    if (parseInt(fromAmount) > 0) {
      await getQuote();
    }

    if (quote === null) {
      return null;
    }

    // The Address the swap should be called on (The LiFi Diamond, If they end up changing the architecture and adding
    // Multiple contract choices, it would choose them instead.)
    let addressToCallOn: address = quote["to"];
    let nativeValue: string = quote["value"];
    let callData: BytesLike = quote["data"];

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
    nativeValuesArr.push(toBigInt(nativeValue).toString());
  }
  // Formats All Addresses To Their Checksum'ed Format
  callingAddressesArr = callingAddressesArr.map((address) => {
    try {
      return ethers.getAddress(address);
    } catch {
      return address;
    }
  });
  /* --------------------------------------------------------------------------------------------------------------
  * Encodes all arrays in the default ABI Format, pushes them into a "bytes" array.
  ---------------------------------------------------------------------------------------------------------------*/
  let encodedCallingAddressesArr: BytesLike =
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address[]"],
      [callingAddressesArr]
    );
  let encodedCalldataArr: BytesLike = ethers.AbiCoder.defaultAbiCoder().encode(
    ["bytes[]"],
    [calldataArr]
  );
  let encodedNativeValuesArr: BytesLike =
    ethers.AbiCoder.defaultAbiCoder().encode(["uint256[]"], [nativeValuesArr]);
  let bytesArrToPost: BytesLike[] = [
    encodedCallingAddressesArr,
    encodedCalldataArr,
    encodedNativeValuesArr,
  ];

  console.log(
    `Swapping Tokens : ${await Promise.all(
      fromTokens.map(
        async (toecan: any) =>
          (await new ethers.Contract(
            ethers.getAddress(toecan),
            erc20abi,
            provider
          ).symbol()) + ", "
      )
    )} for ${await new ethers.Contract(
      ethers.getAddress(_toToken),
      erc20abi,
      provider
    ).symbol()}`
  );

  console.log(
    "Transfer Amounts ARR",
    fromAmounts.map((amount: any) => ethers.formatUnits(amount, 18))
  );

  console.log(
    "Balance arr directly from tokens",
    await Promise.all(
      fromTokens.map(async (token: any) => {
        let contract = new ethers.Contract(
          ethers.getAddress(token),
          erc20abi,
          provider
        );
        let balance = ethers.formatUnits(
          await contract.balanceOf(_contractAddress),
          18
        );
        let symbol = await contract.symbol();

        return `${symbol} : ${balance}`;
      })
    )
  );

  let receipt = await sendRawTransaction(
    provider,
    _contractAddress,
    "callback_post",
    [bytesArrToPost],
    _executor
  );

  return receipt;
};
