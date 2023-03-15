import axios from "axios";
import { IFullFunction } from "src/App";
import {
  DBAddress,
  DBFlow,
  DBFunction,
  DBNetwork,
  IntegrateAbleFunction,
} from "../types";
import { ethers } from "ethers";
import { IFlow } from "./map-funcs-to-flows";
import { classifyOnchainToken } from "./getOnchainToken";

export interface IntegrationInterface {
  functions: IntegrateAbleFunction[];
  contract_address: string;
  protocol_identifier: number;
  chain_id: number;
  abi: any[];
  network: DBNetwork;
}

export const integrateIntoDB = async (
  _integrationObject: IntegrationInterface
) => {
  try {
    let oldFuncIdsToDbFuncIds: Map<number, number> = new Map();
    let funcIds: number[] = [];
    let oldFuncIdsToOldFuncObjs: Map<number, IntegrateAbleFunction> = new Map();

    for (let i = 0; i < _integrationObject.functions.length; i++) {
      // Current Function
      let currentFunction = _integrationObject.functions[i];

      // Keeping track of the function temp ID and the function object for later use
      oldFuncIdsToOldFuncObjs.set(
        currentFunction.tempId,
        _integrationObject.functions[i]
      );

      // Arrays of DB Flow ids & arg IDs
      let newFlowIds: number[] = [];
      let newArgIds: number[] = [];

      for (let j = 0; j < currentFunction.args.length; j++) {
        // Current argument
        let currentArg = currentFunction.args[j];

        // The object we're going to post when adding the argument
        let argAddingObject = {
          index: currentArg.tempId,
          solidity_type: currentArg.type,
          value: currentArg.value,
          name: currentArg.name,
        };

        // Posting the argument to be added to the database. Being returned the parameter ID (default auto-incrmeneting ID)
        let newParamId = await (
          await axios.post(
            "https://integrationapi.yieldchain.io/add-parameter",
            argAddingObject
          )
        ).data.parameter_identifier;

        if (newParamId === (undefined || null)) {
          alert("Error: Parameter ID is undefined or null " + newParamId);
          return;
        }

        // Pushing the new parameter ID to the array of new parameter IDs
        newArgIds.push(newParamId);
      }

      for (let j = 0; j < currentFunction.flows.length; j++) {
        // Current flow
        let currentFlow: IFlow = currentFunction.flows[j];

        let tokenId: number | null = currentFlow.token_details.token_identifier;

        if (tokenId === null) {
          alert("Error: Token ID is null, Current Flow: " + currentFlow);
          return;
        }

        // The object we're going to post when adding the flow
        let flowAddingObject: Partial<DBFlow> = {
          token_identifier: tokenId,
          outflow0_or_inflow1: currentFlow.outflow0_or_inflow1,
        };

        // Posting the flow to be added to the database. Being returned the flow ID (default auto-incrmeneting ID)
        let newFlowId: number = await (
          await axios.post(
            "https://integrationapi.yieldchain.io/add-flow",
            flowAddingObject
          )
        ).data.flow_identifier;

        if (newFlowId === (undefined || null)) {
          alert("Error: Flow ID is undefined or null " + newFlowId);
          return;
        }

        // Pushing the new flow ID to the array of new flow IDs
        newFlowIds.push(newFlowId);
      }

      /**
       * @notice
       * Posting the function to be added to the database. Being returned the function ID (default auto-incrmeneting ID)
       */
      let funcObjectToPost: DBFunction = {
        function_identifier: -1, // This will be handled by the post request
        function_name: currentFunction.name,
        number_of_parameters: currentFunction.args.length,
        flows: newFlowIds,
        arguments: newArgIds,
        is_callback: false, // TODO: Integrate callback functions to admin UI? or not needed? Assuming this would be manual integration anywya.
        counter_function_identifier: null,
        unlocked_by: null,
      };

      // Posting the function to be added to the database. Being returned the function ID (default auto-incrmeneting ID)
      let newFuncId = await (
        await axios.post(
          "https://integrationapi.yieldchain.io/add-function",
          funcObjectToPost
        )
      ).data.function_identifier;

      if (newFuncId === (undefined || null)) {
        alert("Error: Function ID is undefined or null " + newFuncId);
        return;
      }

      // Setting old func ID => new (DB) func id
      oldFuncIdsToDbFuncIds.set(currentFunction.tempId, newFuncId);

      // Pushing the new function ID to the array of new function IDs
      funcIds.push(newFuncId);
    }

    // Another iterations over the functions to update their counter func & unlocked by func IDs
    for (let i = 0; i < _integrationObject.functions.length; i++) {
      // Current Function
      let currentFunction = _integrationObject.functions[i];

      // The object we're going to post when adding the argument
      let postObject: {
        counter_function_identifier?: number;
        unlocked_by?: number;
      } = {};

      // Getting the new counter func ID
      let newCounterFuncId = oldFuncIdsToDbFuncIds.get(
        currentFunction.counterFuncId || -1
      );

      // Getting the new unlocked by func ID
      let newUnlockedByFuncId = oldFuncIdsToDbFuncIds.get(
        currentFunction.unlockedByFuncId || -1
      );

      // If the new counter func ID is defined, add it to the post object
      if (newCounterFuncId !== undefined)
        postObject.counter_function_identifier = newCounterFuncId;

      // If the new unlocked by func ID is defined, add it to the post object
      if (newUnlockedByFuncId !== undefined)
        postObject.unlocked_by = newUnlockedByFuncId;

      // If the post object has any keys, post it to the update function endpoint
      if (Object.keys(postObject).length > 0) {
        let res = await axios.post(
          `https://integrationapi.yieldchain.io/update-function/${oldFuncIdsToDbFuncIds.get(
            currentFunction.tempId
          )}`,
          postObject
        );

        if (res.data === undefined || res.data === null) {
          alert("Error: Function update response is undefined or null");
          return;
        }
      }
    }

    // Rows of Protocol IDs => Chain IDs
    let protocolsChains = await (
      await axios.get("https://api.yieldchain.io/protocols-networks")
    ).data.protocols_networks;

    // Rows of Protocol IDs => Address IDs
    let protocolsAddresses = await (
      await axios.get("https://api.yieldchain.io/protocols-addresses")
    ).data.protocols_addresses;

    // Rows of DBAddresses
    let allAddresses: DBAddress[] = await (
      await axios.get("https://api.yieldchain.io/addresses")
    ).data.addresses;

    // The current address (if it exists)
    let currentAddress: DBAddress | undefined = allAddresses.find(
      (address: DBAddress) =>
        ethers.getAddress(address.contract_address) ===
        ethers.getAddress(_integrationObject.contract_address)
    );

    // The current address ID (if it exists)
    let currentAddressId: number | undefined =
      currentAddress?.address_identifier;

    // Add the address to the DB if it doesn't exist
    if (currentAddress == undefined) {
      // Post req to add it
      let newAddress = await axios.post(
        "https://integrationapi.yieldchain.io/add-address",
        {
          contract_address: _integrationObject.contract_address,
          abi: JSON.stringify(_integrationObject.abi),
          chain_id: _integrationObject.chain_id,
          functions: funcIds,
        }
      );

      // Set the current address ID to the new address ID
      currentAddressId = newAddress.data.address_identifier;
    } else {
      // If the address exists in the database, we get it's functions array
      let oldAddressFunctions = currentAddress.functions;

      // Add the functions to the address if they don't exist
      for (let i = 0; i < funcIds.length; i++) {
        if (!oldAddressFunctions.includes(funcIds[i]))
          oldAddressFunctions.push(funcIds[i]);
      }
    }

    // Look for a protocol-address pair of the current protocol to the current address
    let currentAddressInProtocolPairs = protocolsAddresses.find(
      (protocol_address_pair: {
        protocol_identifier: number;
        address_identifier: number;
      }) => {
        return (
          protocol_address_pair.protocol_identifier ===
            _integrationObject.protocol_identifier &&
          protocol_address_pair.address_identifier === currentAddressId
        );
      }
    );

    // If we did not find a protocol-address pair of the current protocol to the current address, we add it
    if (!currentAddressInProtocolPairs) {
      await axios.post(
        "https://integrationapi.yieldchain.io/add-protocol-address",
        {
          protocol_identifier: _integrationObject.protocol_identifier,
          address_identifier: currentAddressId,
        }
      );
    }

    // Look for a protocol-chain pair of the current protocol to the current chain
    let currentProtocolChainPair = protocolsChains.find(
      (protocol_chain_pair: {
        protocol_identifier: number;
        chain_id: number;
      }) => {
        return (
          protocol_chain_pair.protocol_identifier ===
            _integrationObject.protocol_identifier &&
          protocol_chain_pair.chain_id === _integrationObject.chain_id
        );
      }
    );

    // If we did not find a protocol-chain pair of the current protocol to the current chain, we add it
    if (!currentProtocolChainPair) {
      await axios.post(
        "https://integrationapi.yieldchain.io/add-protocol-network",
        {
          protocol_identifier: _integrationObject.protocol_identifier,
          chain_id: _integrationObject.chain_id,
        }
      );
    }

    /**
     * @notice
     * another iteration over the functions, this time to add them to their corresponding action tables
     */
    for (const fullFunc of _integrationObject.functions) {
      // Getting the new ID of the function
      let newId = oldFuncIdsToDbFuncIds.get(fullFunc.tempId);

      // @Typeguard
      if (newId == (undefined || null)) continue;

      // Getting the new ID of the action connected to the function
      let funcActionId = fullFunc.actionId;

      // @Typeguard
      if (funcActionId == -1) continue;

      // Object to post
      let postObject = {
        function_identifier: newId,
        action_identifier: funcActionId,
      };

      console.log("GOing To post THis object for action ser", postObject);
      // Adding the function to the action's table
      await axios.post(
        `https://integrationapi.yieldchain.io/add-function-to-action/`,
        postObject
      );
    }

    return true;
  } catch (e: any) {
    return e.message;
  }
};
