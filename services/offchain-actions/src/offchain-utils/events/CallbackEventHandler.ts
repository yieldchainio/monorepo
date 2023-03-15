import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { EthersLog, EthersProvider } from "../../offchain-types.js";

type JsonRpcUrl = string;

export const handleCallbackEvent = async (
  log: EthersLog,
  provider: JsonRpcUrl
) => {
  console.log("Caught CallbackEvent event In Event Router!");

  let executed: boolean = false;
  if (!executed) {
    try {
      await axios
        .post("https://builderapi.yieldchain.io/callback-event", {
          log: log,
          provider: provider,
        })
        .then((res) =>
          console.log("Successfily Posted To Port 3000", res.data)
        );
      executed = true;
    } catch (e) {
      console.log("Error Posting To Port 3000", e);
      console.log(
        "detailed inputted into above error: ",
        "Log:",
        log,
        "Provider:",
        provider
      );
    }
  }
};
