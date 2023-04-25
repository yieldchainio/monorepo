import hardhat from "hardhat";
import fs from "fs";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import Web3 from "web3";
import axios from "axios";
import {
  DBToken,
  DBContract,
  DBArgument,
  DBFunction,
  DBFlow,
} from "../generation-types";

export const getTokenDetails = async (_token_identifier: number) => {
  let full_tokens_list: DBToken[] = (
    await axios.get("https://api.yieldchain.io/tokens")
  ).data.tokens as DBToken[];
  let current_token_details: DBToken =
    full_tokens_list[
      full_tokens_list.findIndex(
        (token_item: any /* IToken */) =>
          token_item.token_identifier == _token_identifier
      )
    ];

  return current_token_details;
};

export const getFlowDetails = async (_flow_identifier: number) => {
  let full_flows_list: DBFlow[] = (
    await axios.get("https://api.yieldchain.io/flows")
  ).data.flows as DBFlow[];

  let current_flow_details: DBFlow =
    full_flows_list[
      full_flows_list.findIndex(
        (flow_item: any /* IFlow */) =>
          flow_item.flow_identifier == _flow_identifier
      )
    ];
  return current_flow_details;
};

export const getFunctionDetails = async (_function_identifier: number) => {
  // Gets Function Details From Data

  let full_functions_list: DBFunction[] = (
    await axios.get("https://api.yieldchain.io/functions")
  ).data.functions as DBFunction[]; // Gets Full Functions List From Database

  let current_function_details: DBFunction =
    full_functions_list[
      full_functions_list.findIndex(
        (function_item: any /* IFunction */) =>
          function_item.function_identifier == _function_identifier
      )
    ]; // Finds Current Function Details
  return current_function_details; // Returns Current Function Details
};

export const getParameterDetails = async (_parameter_identifier: number) => {
  let full_parameters_list: DBArgument[] = (
    await axios.get("https://api.yieldchain.io/parameters")
  ).data.parameters as DBArgument[]; // Get full parameters list from API

  let current_parameter_details: DBArgument =
    full_parameters_list[
      full_parameters_list.findIndex(
        (parameter_item: any) =>
          parameter_item.parameter_identifier == _parameter_identifier
      )
    ]; // Get current parameter details from parameters list
  return current_parameter_details; // Return current parameter details
};

export const getAddressDetails = async (_address_identifier: any) => {
  let full_addresses_list: DBContract[] = (
    await axios.get("https://api.yieldchain.io/addresses")
  ).data.addresses as DBContract[]; // Gets the full list of addresses from the api

  let current_address_details: DBContract =
    full_addresses_list[
      full_addresses_list.findIndex(
        (address_item: any) =>
          address_item.address_identifier == _address_identifier
      )
    ]; // Finds the address details from the full list of addresses
  return current_address_details; // Returns the address details
};

export const createArrayByNumberInput = async (number: any) => {
  // create array of numbers from 0 to number input
  let arr = []; // create empty array
  for (let i = 0; i < number; i++) {
    // loop through number input
    arr.push(i); // push number to array
  }
  return arr; // return array
};

export const getFunctionAddress = async (_function_identifier: any) => {
  console.log(`Getting Address for FuncID ${_function_identifier}...`);
  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;
  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;
  console.log(`All Addresses: ${allAddresses}`);
  console.log(`All Functions: ${allFunctions}`);
  let currentAddress = allAddresses.find(
    (addressObj: any) =>
      addressObj.functions &&
      addressObj.functions.includes(_function_identifier)
  );
  console.log(
    `Address for FuncID ${_function_identifier}: ${currentAddress.address}}`
  );
  return currentAddress;
};

export const removeDuplicatesSimple = (arr: any) => {
  return arr.filter((item: any, index: any) => {
    let value = JSON.stringify(item);
    return arr.findIndex((obj: any) => JSON.stringify(obj) === value) === index;
  });
};

export const timeout = (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sleep = async (_func: any, _args: any, _ms: any) => {
  await timeout(_ms);
  return _func(..._args);
};
