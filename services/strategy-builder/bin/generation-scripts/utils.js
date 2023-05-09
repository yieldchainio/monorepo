import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import axios from "axios";
export const getTokenDetails = async (_token_identifier) => {
    let full_tokens_list = (await axios.get("https://api.yieldchain.io/tokens")).data.tokens;
    let current_token_details = full_tokens_list[full_tokens_list.findIndex((token_item /* IToken */) => token_item.token_identifier == _token_identifier)];
    return current_token_details;
};
export const getFlowDetails = async (_flow_identifier) => {
    let full_flows_list = (await axios.get("https://api.yieldchain.io/flows")).data.flows;
    let current_flow_details = full_flows_list[full_flows_list.findIndex((flow_item /* IFlow */) => flow_item.flow_identifier == _flow_identifier)];
    return current_flow_details;
};
export const getFunctionDetails = async (_function_identifier) => {
    // Gets Function Details From Data
    let full_functions_list = (await axios.get("https://api.yieldchain.io/functions")).data.functions; // Gets Full Functions List From Database
    let current_function_details = full_functions_list[full_functions_list.findIndex((function_item /* IFunction */) => function_item.function_identifier == _function_identifier)]; // Finds Current Function Details
    return current_function_details; // Returns Current Function Details
};
export const getParameterDetails = async (_parameter_identifier) => {
    let full_parameters_list = (await axios.get("https://api.yieldchain.io/parameters")).data.parameters; // Get full parameters list from API
    let current_parameter_details = full_parameters_list[full_parameters_list.findIndex((parameter_item) => parameter_item.parameter_identifier == _parameter_identifier)]; // Get current parameter details from parameters list
    return current_parameter_details; // Return current parameter details
};
export const getAddressDetails = async (_address_identifier) => {
    let full_addresses_list = (await axios.get("https://api.yieldchain.io/addresses")).data.addresses; // Gets the full list of addresses from the api
    let current_address_details = full_addresses_list[full_addresses_list.findIndex((address_item) => address_item.address_identifier == _address_identifier)]; // Finds the address details from the full list of addresses
    return current_address_details; // Returns the address details
};
export const createArrayByNumberInput = async (number) => {
    // create array of numbers from 0 to number input
    let arr = []; // create empty array
    for (let i = 0; i < number; i++) {
        // loop through number input
        arr.push(i); // push number to array
    }
    return arr; // return array
};
export const getFunctionAddress = async (_function_identifier) => {
    console.log(`Getting Address for FuncID ${_function_identifier}...`);
    let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
        .data.addresses;
    let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
        .data.functions;
    console.log(`All Addresses: ${allAddresses}`);
    console.log(`All Functions: ${allFunctions}`);
    let currentAddress = allAddresses.find((addressObj) => addressObj.functions &&
        addressObj.functions.includes(_function_identifier));
    console.log(`Address for FuncID ${_function_identifier}: ${currentAddress.address}}`);
    return currentAddress;
};
export const removeDuplicatesSimple = (arr) => {
    return arr.filter((item, index) => {
        let value = JSON.stringify(item);
        return arr.findIndex((obj) => JSON.stringify(obj) === value) === index;
    });
};
export const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export const sleep = async (_func, _args, _ms) => {
    await timeout(_ms);
    return _func(..._args);
};
//# sourceMappingURL=utils.js.map