import { ethers } from "ethers";
import {
  EthersLog,
  EthersReceipt,
  SQSOnchainLog,
  SQSMessage,
} from "./offchain-types.js";
/*---------------------------------------------------------------
    // @Utils imports
----------------------------------------------------------------*/
import { lifibatchswap } from "./clients/lifi/batch-swap.js";
import { lifiswap } from "./clients/lifi/swap.js";
import { reverseLifiSwap } from "./clients/lifi/reverse-swap.js";
import { reverseStrategy } from "./clients/withdraw-reverse-strategy/main.js";
/*---------------------------------------------------------------
----------------------------------------------------------------*/

const AvailableOffchainActions: any = {
  lifibatchswap: lifibatchswap,
  lifiswap: lifiswap,
  reverseLifiSwap: reverseLifiSwap,
  reverseStrategy: reverseStrategy,
};

export const handleCallbackEvent = async (
  _log: string | object,
  shouldWait?: number
): Promise<EthersReceipt | null> => {
  console.log("Inside Handle callback event", Math.floor(Date.now() / 1000));
  // We may need to wait a bit just incase (optional, provided by caller)
  if (shouldWait)
    await new Promise((resolve) => setTimeout(resolve, shouldWait));

  // Parsing the Stringified Log
  let log: SQSOnchainLog = typeof _log == "string" ? JSON.parse(_log) : _log;

  // Data of the log
  let data: string = log.data;

  // Provider of the log
  let provider: string = log.json_rpc_url;

  // Decoding the data into the function to eval, the opration origin, and the encoded arguments (to be used by the offchain
  // action in whatever way it needs to)
  let decodedArgs: any[] = ethers.AbiCoder.defaultAbiCoder().decode(
    ["string", "string", "bytes[]"],
    data
  );
  let funcToEval: Function = AvailableOffchainActions[decodedArgs[0]];

  // Trying to eval the offchain action function
  try {
    console.log("Got Request For Function:", decodedArgs[0]);
    let receipt = await funcToEval(
      provider,
      log.address,
      decodedArgs[1],
      decodedArgs[2]
    );
    return receipt || null;
  } catch (err) {
    console.log(`${decodedArgs[0]} Failed.`);
    console.log(err);
  }
  return null;
};