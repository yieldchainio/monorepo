import fs from "fs";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import Web3 from "web3";
import axios from "axios";

import { initStrategy } from "./init-strategy.js";
import { generateTokenVariables } from "./generate-tokens.js";
import { getTokenDetails, getAddressDetails } from "./utils.js";
import { generateFunctions } from "./Generate-Functions.js";
import { appendNewLineShortcut } from "./fs-shortcuts.js";
import { GenerateSteps } from "./Generate-Steps.js";
import { removeDuplicatesSimple } from "./utils.js";

// enum ActionTypes {
//   STAKE,
//   HARVEST,
//   SWAP,
//   ADDLIQ,
//   LPZAP,
//   CROSSCHAINSWAP,
// }

// interface IStep {
//   type: ActionTypes;
//   divisor: number;
//   function_identifiers: number[];
//   address_identifiers: number[];
//   protocol_identifier: number;
//   outflows_identifiers?: number[];
//   inflows_identifiers?: number[];
//   additional_args?: any[];
// }

// interface IStrategyInit {
//   base_steps: IStep[];
// }

// interface IStrategyObject {
//   strategy_name: string;
//   execution_interval: number;
//   strategy_initiation: IStrategyInit;
//   steps_array: IStep[];
//   vault_deposit_token_identifier: number;
// }

export const headGeneration = async (
  strategy_object: any /*IStrategyObject */
) => {
  console.log("Started Strategy Building Process...");
  let file_name = `${strategy_object.strategy_name.replace(/\s/g, "")}.sol`;
  let flows_arr = [];
  let tokens_arr = [];
  let addresses_arr = [];
  console.log(
    "Strategy Logic File Is ",
    `${file_name}`,
    "Factory Is",
    `${file_name.split(".")[0]}Factory.sol!`
  );

  /**
   * @Initiation
   * Call Strategy Initiation Function (Generates All Generic Boilerplate For Strategy Logic, And Generates The
   * Factory Contract), returns array of "flows" from the databae which relate to each base step from the initiation,
   * as well as the vault deposit token (If externally needed)
   */
  await initStrategy(strategy_object).then((res: any) =>
    res.forEach((res_item: any) => flows_arr.push(res_item))
  );
  console.log(
    "Successfully Initiated Strategy Generation! Boilerplate Created ✔"
  );

  // Mappings Of Relation Between Pools, Flows, And Tokens. In Order to ensure gas & size efficiency, we will only
  // Generate Some Token Variables If They Relate To A Flow, Or A Pool.
  let flows_to_tokens_mapping = new Map();
  let addresses_to_flows_mapping = new Map();

  // Get All Flows Relating To Each Step, Push To Array
  for await (const step of strategy_object.steps_array) {
    console.log("Step in loop", step);
    let res = await axios.get(
      `https://api.yieldchain.io/address-flows/${step.address_identifiers[0]}`
    );
    let step_specfic_arr = [];
    for await (const item of res.data.address_flows) {
      step_specfic_arr.push(item);
      flows_arr.push(item);
    }
    addresses_to_flows_mapping.set(
      (await getAddressDetails(step.address_identifiers[0])).contract_address,
      step_specfic_arr
    );
  }
  for await (const basestep of strategy_object.strategy_initiation.base_steps) {
    let res = await axios.get(
      `https://api.yieldchain.io/address-flows/${basestep.address_identifiers[0]}`
    );
    let step_specfic_arr = [];
    for await (const item of res.data.address_flows) {
      step_specfic_arr.push(item);
      flows_arr.push(item);
    }
    addresses_to_flows_mapping.set(
      (await getAddressDetails(basestep.address_identifiers[0]))
        .contract_address,
      step_specfic_arr
    );
  }
  // Get Token Details Of Each Token Identifier Relating To each Flow From The Array, Push Into Tokens Array
  for await (const item of flows_arr) {
    let tokendetails = await getTokenDetails(item.token_identifier);
    flows_to_tokens_mapping.set(item.flow_identifier, tokendetails);
    tokens_arr.push(tokendetails);
  }

  if (
    !tokens_arr.find(
      (token) =>
        token.token_identifier ===
        strategy_object.vault_deposit_token_identifier
    )
  ) {
    let tokendetails = await getTokenDetails(
      strategy_object.vault_deposit_token_identifier
    );
    tokens_arr.push(tokendetails);
  }

  // Gets All Addresses From Each Step, Pushes Into Addresses Array
  let full_pools_list = await axios.get(`https://api.yieldchain.io/addresses`);
  for await (const pool of full_pools_list.data.addresses) {
    try {
      let flows_of_pool = addresses_arr.push(
        Web3.utils.toChecksumAddress(pool.contract_address)
      );
    } catch (e) {
      console.log("Error while iterating over full addresses list, error: ", e);
    }
  }

  // Remove Duplicates From Addresses Array
  addresses_arr = removeDuplicatesSimple(addresses_arr);

  // Filter Tokens Array to Remove Duplicates, To Save On Computation & Gas Costs (No need to create & update multiple
  // Variables For The Exact Same Token)
  tokens_arr = await removeDuplicatesSimple(tokens_arr);
  console.log("Retreived All Token Details, Generating Tokens Variables...");
  /**
   * @Token_Variables_Generation
   * Generates Token-Related Variables For Each One Of The Tokens Relating To the Strategy
   */
  await generateTokenVariables(file_name, tokens_arr, {
    addresses_arr,
    flows_to_tokens_mapping,
    addresses_to_flows_mapping,
  });

  console.log("Generated All Token Variables Successfully ✔✔");
  console.log("Preparing To Generate Function Wrappers...");

  /**
   * @Function_Wrappers_Generation
   * Generates A Wrapped Function For Each Low-level Function Call Relating To Each One Of the Steps
   */
  await generateFunctions(file_name, strategy_object);
  console.log("Generated Function Wrappers Successfully ✔✔✔✔");

  /**
   * @Steps_Generation
   * Generates A Struct-Relating Object For Each One Of The Strategy's Steps, Initiates It's (encoded) Parameters Bytes Arr,
   * And then It Also Generates "Run Strategy" Functions,
   * (Starts off with a single one, splits itself If There Are Any CallBack Functions (Wrapper-related) In It)
   */

  await GenerateSteps(file_name, strategy_object);

  console.log("Generated Strategy Steps Succcessfully ✔✔✔✔✔✔✔✔");

  // Close Contract Bracket
  await appendNewLineShortcut(file_name, `}`);

  console.log(`
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⣹⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⢀⣾⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⣠⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⢀⣼⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿
  ⣿⡿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣅⠀⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣷⣄⠀⠀⠙⠻⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣷⣄⠀⠀⠈⠛⢿⣿⣿⠏⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠙⠃⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`);
  fs.copyFileSync(
    __dirname + `/../../${file_name}`,
    __dirname + `/../../contracts/${file_name}`
  );
  try {
    fs.unlinkSync(__dirname + `/../../${file_name}`);
  } catch (e) {
    console.log("Error in fs.unlinkSync", e);
  }
  console.log("After FS unlink");
  return file_name;
};
