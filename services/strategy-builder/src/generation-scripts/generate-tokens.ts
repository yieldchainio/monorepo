import hardhat from "hardhat";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import Web3 from "web3";
import axios from "axios";
import { appendToFile, appendNewLineShortcut } from "./fs-shortcuts.js";
import { getTokenDetails } from "./utils.js";
import { DBAddress } from "../generation-types";

export const generateTokenVariables = async (
  _fileName: any,
  _tokens_list: any,
  { _addresses_list, flows_to_tokens_mapping, addresses_to_flows_mapping }: any
) => {
  ///////////////////////fs.appendFileSyncShortcuts///////////////////////
  let file_name = _fileName;
  const appendNewLineInterContract = async (_content: any) => {
    await appendToFile(file_name, `\n    ${_content}`);
  };
  const appendNewLineInterFunction = async (_content: any) => {
    await appendToFile(file_name, `\n        ${_content}`);
  };
  const appendNewLineInterFunction2x = async (_content: any) => {
    await appendToFile(file_name, `\n            ${_content}`);
  };
  const appendNewLineInterFunction3x = async (_content: any) => {
    await appendToFile(file_name, `\n                ${_content}`);
  };
  ///////////////////////////////////////////////////////////////////////

  let full_tokens_list = _tokens_list;

  /**
   * @Balances
   */

  // Generate Simple IERC20 Variable For Each Token Inputted By The Head Generation Function
  for await (const current_token_details of full_tokens_list) {
    await appendNewLineInterContract(
      `IERC20 ${
        current_token_details.symbol
      } = IERC20(${Web3.utils.toChecksumAddress(
        current_token_details.address
      )});`
    );
  }

  // Generate A Simple, no-value Balance Variable For Each One Of The Tokens
  for await (const current_token_details of full_tokens_list) {
    await appendNewLineInterContract(
      `uint256 ${current_token_details.symbol}_BALANCE;`
    );
  }

  // Generate A Function That, When Called, Updates Each Global Balance Variable To The Result Of A .balanceOf External
  // Function Call To That Token Address
  await appendNewLineInterContract(`function updateBalances() internal {`);
  for await (const current_token_details of full_tokens_list) {
    await appendNewLineInterFunction(
      `${current_token_details.symbol}_BALANCE = ${current_token_details.symbol}.balanceOf(address(this));`
    );
  }
  await appendNewLineInterContract(`}`);

  await appendNewLineInterContract(`function approveAllTokens() internal {`);
  const addresses_flows_iterator =
    addresses_to_flows_mapping[Symbol.iterator]();

  for await (const [key, value] of addresses_flows_iterator) {
    let address_relations = await (
      await axios.get("https://api.yieldchain.io/address-relations")
    ).data.address_relations;
    let allAddresses = await (
      await axios.get("https://api.yieldchain.io/addresses")
    ).data.addresses;
    type addressRelationType = {
      address_identifier: number;
      address_identifier_2: number;
    };
    let related_addresses: DBAddress[] = address_relations
      .map((address_relation: addressRelationType) => {
        return {
          current_address: allAddresses.find(
            (address: DBAddress) =>
              address.address_identifier == address_relation.address_identifier
          ),
          related_address: allAddresses.find(
            (address: DBAddress) =>
              address.address_identifier ==
              address_relation.address_identifier_2
          ),
        };
      })
      .filter(
        (address_relation: {
          current_address: DBAddress;
          related_address: DBAddress;
        }) =>
          Web3.utils.toChecksumAddress(
            address_relation.current_address.contract_address
          ) == Web3.utils.toChecksumAddress(key)
      )
      .map((address_relation: any) => address_relation.related_address);

    console.log("Related Addresses", related_addresses);

    let flows_already_done: any = [];
    for await (const flowdetails of value) {
      if (!flows_already_done.includes(flowdetails.token_identifier)) {
        let tokenFlowDetails = await getTokenDetails(
          flowdetails.token_identifier
        );
        await appendNewLineInterFunction(
          `${tokenFlowDetails.symbol}.approve(${Web3.utils.toChecksumAddress(
            key
          )}, type(uint256).max);`
        );
        for await (const related_address of related_addresses) {
          console.log("Doing related address");
          await appendNewLineInterFunction(
            `${tokenFlowDetails.symbol}.approve(${Web3.utils.toChecksumAddress(
              related_address.contract_address
            )}, type(uint256).max);`
          );
        }
        flows_already_done.push(flowdetails.token_identifier);
      }
    }
  }

  await appendNewLineInterContract(`}`);

  // Getter function for all supported tokens on the vault contract
  await appendNewLineInterContract(
    `function getTokens() public pure returns (address[] memory) {`
  );
  await appendNewLineInterFunction(
    `address[] memory tokens = new address[](${full_tokens_list.length});`
  );
  console.log("full tokens lst", full_tokens_list);
  for await (const token of full_tokens_list) {
    await appendNewLineInterFunction(
      `tokens[${full_tokens_list.findIndex(
        (toecan: any) => toecan.token_identifier == token.token_identifier
      )}] = ${Web3.utils.toChecksumAddress(token.address)};`
    );
  }
  await appendNewLineInterFunction(`return tokens;`);
  await appendNewLineInterContract(`}`);

  return;
};
