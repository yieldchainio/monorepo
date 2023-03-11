import Web3 from "web3";
import axios from "axios";
import { appendToFile, appendNewLineShortcut } from "./fs-shortcuts.js";
import { GetDatabaseContext } from "./database-context.js";
import {
  getFunctionDetails,
  getParameterDetails,
  getAddressDetails,
  getFunctionAddress,
} from "./utils.js";
import * as dbtypes from "../generation-types";

export const generateFunctions = async (_fileName: any, _strategy_obj: any) => {
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
  const appendSameLine = async (_content: any) => {
    await appendToFile(file_name, _content);
  };
  const spacing = async () => {
    await appendNewLineInterContract(`\n\n`);
  };
  ///////////////////////////////////////////////////////////////////////

  ///////////////////////Database Context/////////////////////////////////

  let DatabaseContext: any = await GetDatabaseContext();
  let full_tokens_list = DatabaseContext.full_tokens_list;
  let full_pools_list = DatabaseContext.full_pools_list;
  let full_protocols_list = DatabaseContext.full_protocols_list;
  let full_flows_list = DatabaseContext.full_flowslist;
  let full_functions_list = DatabaseContext.full_functions_list.data.functions;
  let full_parameters_list = DatabaseContext.full_parameters_list;
  let full_networks_list = DatabaseContext.full_networks_list;

  ///////////////////////////////////////////////////////////////////////
  let steps_array = _strategy_obj.steps_array;
  let basesteps_arr = _strategy_obj.strategy_initiation.base_steps;
  let counterFunctionsArr = await Promise.all(
    steps_array.map(async (step: any) => {
      let counterFunctionIdentifier = await full_functions_list.find(
        (func: any) =>
          func.function_identifier ==
          full_functions_list.find(
            (tFunc: any) =>
              tFunc.function_identifier == step.function_identifiers[0]
          ).counter_function_identifier
      );
      let addressIdentifier;
      try {
        addressIdentifier = (
          await getFunctionAddress(
            counterFunctionIdentifier.function_identifier
          )
        ).address_identifier;
      } catch (e) {
        console.log(`Failed to find address for function identifier `, e);
      }
      let counterFakeStep = {
        function_identifiers: [
          counterFunctionIdentifier
            ? counterFunctionIdentifier.function_identifier
            : null,
        ],
        address_identifiers: [addressIdentifier],
      };
      console.log("Fake Coutner step bor", counterFakeStep);
      return counterFakeStep;
    })
  );
  let functions_arr: dbtypes.DBFunction[] = [];
  let functions_to_params_mapping = new Map();
  let functions_to_addresses_mapping = new Map();

  // Fetch Function & Params Details
  const fetchDetails = async (_arr: any) => {
    for await (const step of _arr) {
      if (step.function_identifiers[0] == null) break;
      for await (const funcid of step.function_identifiers) {
        let funct = await getFunctionDetails(funcid);
        let funcindex = step.function_identifiers.indexOf(funcid);
        console.log(
          step.address_identifiers[funcindex],
          "Step Address Ientifier",
          "Func ID of it",
          step.function_identifiers[0]
        );
        let funcaddress = await (
          await getAddressDetails(step.address_identifiers[funcindex])
        ).contract_address;
        let paramsArr = [];

        functions_arr.push(funct);

        for await (const paramid of funct.arguments) {
          let param: dbtypes.DBArgument = await getParameterDetails(paramid);

          paramsArr.push(param);
        }
        functions_to_params_mapping.set(funcid, paramsArr);
        functions_to_addresses_mapping.set(funcid, funcaddress);
      }
    }
  };

  await fetchDetails(steps_array);
  await fetchDetails(basesteps_arr);
  await fetchDetails(
    counterFunctionsArr.filter(
      (counterFunc) => counterFunc.function_identifiers[0] != null
    )
  );
  functions_arr = await functions_arr.filter(
    (functionObj: dbtypes.DBFunction, index: number) =>
      functions_arr.findIndex(
        (t) => t.function_identifier == functionObj.function_identifier
      ) == index
  );

  /**
   * @MainFunctionGen
   * Generates Full Function For Each One Of The Functions From The Array
   */
  for await (const func of functions_arr) {
    let func_id = func.function_identifier;
    let func_name = func.function_name;
    let func_address = Web3.utils.toChecksumAddress(
      functions_to_addresses_mapping.get(func.function_identifier)
    );
    let func_args = functions_to_params_mapping.get(func.function_identifier);
    let is_func_callback = func.is_callback;

    // Appends Function Name ("func_" + The Function Identifier), and an array of bytes (With A Fixed Size) as arguments,
    // To later be used by custom execution tools (I.E Event Listener For Strategy Reversal W Custom Amount / Harvest Wrapper)
    const generateRegularFunctioNWrapper = async () => {
      spacing();
      await appendNewLineInterContract(
        `function func_${func.function_identifier}`
      );
      await appendSameLine(`(string memory _funcToCall`);
      await appendSameLine(
        `, bytes[${func.number_of_parameters || 1}] memory _arguments`
      );
      await appendSameLine(`) public onlyExecutor {`);

      // Address For Function To Call
      await appendNewLineInterFunction(
        `address currentFunctionAddress = ${func_address};`
      );

      // Checks Whether Params Provided Were Default Or Not, Assigns Boolean Based Off Of that
      await appendNewLineInterFunction(
        `bool useCustomParams = keccak256(_arguments[0]) == keccak256(abi.encode("donotuseparamsever")) ? false : true;`
      );

      // Local Variables For Success & Data From Function Calls
      await appendNewLineInterFunction(`bytes memory result;`);
      await appendNewLineInterFunction(`bool success;`);

      /*-------------------------------------------------------------------------------------------------------------
       * Generates @Call For The Case Where There Were Custom Arguments Provided Into The Wrapping Function
       */
      await appendNewLineInterFunction(`if (useCustomParams) {`);
      const addCustomArgsCall = async () => {
        await appendNewLineInterFunction2x(`(success, result) = `);
        await appendNewLineInterFunction2x(
          `currentFunctionAddress.call{value: 0}(abi.encodeWithSignature("${func_name}(`
        );
        for await (const arg of func_args) {
          let argindex = func_args.findIndex(
            (param: any) =>
              arg.parameter_identifier == param.parameter_identifier
          );
          if (argindex == func_args.length - 1) {
            await appendSameLine(`${arg.solidity_type}`);
          } else {
            await appendSameLine(`${arg.solidity_type},`);
          }
        }
        await appendSameLine(`)"`);
        for await (const arg of func_args) {
          let argindex = func_args.findIndex(
            (param: any) =>
              arg.parameter_identifier == param.parameter_identifier
          );
          await appendSameLine(
            `, abi.decode(_arguments[${argindex}], (${arg.solidity_type}))`
          );
        }
        await appendSameLine(`));`);
        return;
      };

      /**
       * Generates Delegate Call For The Case Where There Were @NO Custom Arguments Provided Into The Wrapping Function,
       * Uses Default, Hard-coded Values As Parameters.
       */
      const addDefaultArgsCall = async () => {
        await appendNewLineInterFunction(`} else {`);
        await appendNewLineInterFunction2x(`(success, result) = `);
        await appendSameLine(
          `currentFunctionAddress.call{value: 0}(abi.encodeWithSignature("${func_name}(`
        );
        for await (const arg of func_args) {
          let argindex = func_args.findIndex(
            (param: any) =>
              arg.parameter_identifier == param.parameter_identifier
          );
          if (argindex == func_args.length - 1) {
            await appendSameLine(`${arg.solidity_type}`);
          } else {
            await appendSameLine(`${arg.solidity_type},`);
          }
        }
        await appendSameLine(`)"`);
        for await (const arg of func_args) {
          await appendSameLine(`, ${arg.value}`);
        }
        await appendSameLine(`));`);
        await appendNewLineInterFunction(`}`);
      };

      // Call Both Functions, Determination On Which One To Call Happens At Runtime
      await addCustomArgsCall();
      await addDefaultArgsCall();

      // Sets Global Latest Data Variable To Local One (Local One Is Set By The Conditional Call)
      await appendNewLineInterFunction(`latestContractData = result;`);

      // Requires "_success" (Set by boolean return value of either one of the Calls) to equal to true.
      // AKA, it requires the Call to go through for the wrapped function to finalize.
      await appendNewLineInterFunction(
        `require(success, "Function Call Failed On func_${func_id}, Strategy Execution Aborted");`
      );

      // Closing Function Bracket
      await appendNewLineInterContract(`}`);
    };

    const generateCallBackFunction = async () => {
      //
      const createPreCallbackFunction = async () => {
        // Initiate Function
        await appendNewLineInterContract(
          `function func_${func.function_identifier}`
        );
        await appendSameLine(`(string memory _funcToCall`);
        await appendSameLine(
          `, bytes[${func.number_of_parameters || 1}] memory _arguments`
        );
        await appendSameLine(`) public onlyExecutor {`);

        // Address For Function To Call
        await appendNewLineInterFunction(
          `address currentFunctionAddress = ${func_address};`
        );

        // Checks Whether Params Provided Were Default Or Not, Assigns Boolean Based Off Of that
        await appendNewLineInterFunction(
          `bool useCustomParams = keccak256(_arguments[0]) == keccak256(abi.encode("donotuseparamsever")) ? false : true;`
        );

        // Local Variables For Success & Data From Function Calls
        await appendNewLineInterFunction(`bytes memory result;`);
        await appendNewLineInterFunction(`bool success;`);

        /**
         * Generates @Call For The Case Where There Were Custom Arguments Provided Into The Wrapping Function
         */
        await appendNewLineInterFunction(`if (useCustomParams) {`);

        const addCustomArgsCall = async () => {
          await appendNewLineInterFunction2x(
            `bytes[] memory eventArr = new bytes[](${func_args.length});`
          );
          await appendNewLineInterFunction2x(
            `bytes[${func_args.length}] memory eventArrFixed = [`
          );
          for await (const arg of func_args) {
            let argindex = func_args.findIndex(
              (param: any) =>
                arg.parameter_identifier == param.parameter_identifier
            );
            if (argindex == 0) {
              await appendSameLine(`_arguments[${argindex}]`);
            } else {
              await appendSameLine(`, _arguments[${argindex}]`);
            }
          }
          await appendSameLine(`];`);
          await appendNewLineInterFunction2x(`for (uint256 i = 0; i < eventArrFixed.length; i++) {
            eventArr[i] = eventArrFixed[i];
        }`);
          await appendNewLineInterFunction2x(
            `emit CallbackEvent("${func_name}", _funcToCall, eventArr);`
          );

          return;
        };

        /**
         * Generates Delegate Call For The Case Where There Were @NO Custom Arguments Provided Into The Wrapping Function,
         * Uses Default, Hard-coded Values As Parameters.
         */
        const addDefaultArgsCall = async () => {
          await appendNewLineInterFunction(`} else {`);
          await appendNewLineInterFunction2x(
            `bytes[] memory eventArr = new bytes[](${func_args.length});`
          );
          await appendNewLineInterFunction2x(
            `bytes[${func_args.length}] memory eventArrFixed = [`
          );
          for await (const arg of func_args) {
            func_args[0].parameter_identifier == arg.parameter_identifier
              ? await appendSameLine(`abi.encode(${arg.value})`)
              : await appendSameLine(`, abi.encode(${arg.value})`);
          }
          await appendSameLine(`];`);

          await appendNewLineInterFunction2x(`for (uint256 i = 0; i < eventArrFixed.length; i++) {
            eventArr[i] = eventArrFixed[i];
        }`);
          await appendNewLineInterFunction2x(
            `emit CallbackEvent("${func_name}", _funcToCall, eventArr);`
          );

          await appendNewLineInterFunction(`}`);
        };
        // Call Both Functions, Determination On Which One To Call Happens At Runtime
        await addCustomArgsCall();
        await addDefaultArgsCall();

        // Sets Global Latest Data Variable To Local One (Local One Is Set By The Conditional Call)
        await appendNewLineInterFunction(`latestContractData = result;`);

        // Closing Function Bracket
        await appendNewLineInterContract(`}`);
      };
      // Call The Function
      await createPreCallbackFunction();
    };

    // If Function Is A Callback Function (Aka there is a need for a pause & / or an addtioanl post call, it will generate
    // In a different format. It will generate a unique event which will be emitted from the initial call (assuming no parameters were
    // provided to it). It will also generate a "post" version of it, which is a generic function that takes in an address
    // And bytes (calldata), and calls that address using that encoded calldata,
    if (is_func_callback) {
      await generateCallBackFunction();
    } else {
      await generateRegularFunctioNWrapper();
    }
  }
};
