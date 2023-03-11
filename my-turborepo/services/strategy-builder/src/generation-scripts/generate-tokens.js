"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenVariables = void 0;
const path_1 = require("path");
const url_1 = require("url");
const __dirname = (0, path_1.dirname)((0, url_1.fileURLToPath)(import.meta.url));
const web3_1 = __importDefault(require("web3"));
const axios_1 = __importDefault(require("axios"));
const fs_shortcuts_js_1 = require("./fs-shortcuts.js");
const utils_js_1 = require("./utils.js");
const generateTokenVariables = async (_fileName, _tokens_list, { _addresses_list, flows_to_tokens_mapping, addresses_to_flows_mapping }) => {
    ///////////////////////fs.appendFileSyncShortcuts///////////////////////
    let file_name = _fileName;
    const appendNewLineInterContract = async (_content) => {
        await (0, fs_shortcuts_js_1.appendToFile)(file_name, `\n    ${_content}`);
    };
    const appendNewLineInterFunction = async (_content) => {
        await (0, fs_shortcuts_js_1.appendToFile)(file_name, `\n        ${_content}`);
    };
    const appendNewLineInterFunction2x = async (_content) => {
        await (0, fs_shortcuts_js_1.appendToFile)(file_name, `\n            ${_content}`);
    };
    const appendNewLineInterFunction3x = async (_content) => {
        await (0, fs_shortcuts_js_1.appendToFile)(file_name, `\n                ${_content}`);
    };
    ///////////////////////////////////////////////////////////////////////
    let full_tokens_list = _tokens_list;
    /**
     * @Balances
     */
    // Generate Simple IERC20 Variable For Each Token Inputted By The Head Generation Function
    for await (const current_token_details of full_tokens_list) {
        await appendNewLineInterContract(`IERC20 ${current_token_details.symbol} = IERC20(${web3_1.default.utils.toChecksumAddress(current_token_details.address)});`);
    }
    // Generate A Simple, no-value Balance Variable For Each One Of The Tokens
    for await (const current_token_details of full_tokens_list) {
        await appendNewLineInterContract(`uint256 ${current_token_details.symbol}_BALANCE;`);
    }
    // Generate A Function That, When Called, Updates Each Global Balance Variable To The Result Of A .balanceOf External
    // Function Call To That Token Address
    await appendNewLineInterContract(`function updateBalances() internal {`);
    for await (const current_token_details of full_tokens_list) {
        await appendNewLineInterFunction(`${current_token_details.symbol}_BALANCE = ${current_token_details.symbol}.balanceOf(address(this));`);
    }
    await appendNewLineInterContract(`}`);
    await appendNewLineInterContract(`function approveAllTokens() internal {`);
    const addresses_flows_iterator = addresses_to_flows_mapping[Symbol.iterator]();
    for await (const [key, value] of addresses_flows_iterator) {
        let address_relations = await (await axios_1.default.get("https://api.yieldchain.io/address-relations")).data.address_relations;
        let allAddresses = await (await axios_1.default.get("https://api.yieldchain.io/addresses")).data.addresses;
        let related_addresses = address_relations
            .map((address_relation) => {
            return {
                current_address: allAddresses.find((address) => address.address_identifier == address_relation.address_identifier),
                related_address: allAddresses.find((address) => address.address_identifier ==
                    address_relation.address_identifier_2),
            };
        })
            .filter((address_relation) => web3_1.default.utils.toChecksumAddress(address_relation.current_address.contract_address) == web3_1.default.utils.toChecksumAddress(key))
            .map((address_relation) => address_relation.related_address);
        console.log("Related Addresses", related_addresses);
        let flows_already_done = [];
        for await (const flowdetails of value) {
            if (!flows_already_done.includes(flowdetails.token_identifier)) {
                let tokenFlowDetails = await (0, utils_js_1.getTokenDetails)(flowdetails.token_identifier);
                await appendNewLineInterFunction(`${tokenFlowDetails.symbol}.approve(${web3_1.default.utils.toChecksumAddress(key)}, type(uint256).max);`);
                for await (const related_address of related_addresses) {
                    console.log("Doing related address");
                    await appendNewLineInterFunction(`${tokenFlowDetails.symbol}.approve(${web3_1.default.utils.toChecksumAddress(related_address.contract_address)}, type(uint256).max);`);
                }
                flows_already_done.push(flowdetails.token_identifier);
            }
        }
    }
    await appendNewLineInterContract(`}`);
    // Getter function for all supported tokens on the vault contract
    await appendNewLineInterContract(`function getTokens() public pure returns (address[] memory) {`);
    await appendNewLineInterFunction(`address[] memory tokens = new address[](${full_tokens_list.length});`);
    console.log("full tokens lst", full_tokens_list);
    for await (const token of full_tokens_list) {
        await appendNewLineInterFunction(`tokens[${full_tokens_list.findIndex((toecan) => toecan.token_identifier == token.token_identifier)}] = ${web3_1.default.utils.toChecksumAddress(token.address)};`);
    }
    await appendNewLineInterFunction(`return tokens;`);
    await appendNewLineInterContract(`}`);
    return;
};
exports.generateTokenVariables = generateTokenVariables;
//# sourceMappingURL=generate-tokens.js.map