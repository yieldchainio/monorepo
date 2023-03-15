import Web3 from "web3";
import axios from "axios";
import { appendToFile, appendNewLineShortcut } from "./fs-shortcuts.js";
import { GetDatabaseContext } from "./database-context.js";
import {
  getFunctionDetails,
  getParameterDetails,
  getAddressDetails,
} from "./utils.js";
import { createArrayByNumberInput } from "./utils.js";
import { DBArgument } from "../generation-types.js";

// Generates The Steps For The Strategy
export const GenerateSteps = async (_file_name: any, _strategy_obj: any) => {
  ///////////////////////fs.appendFileSyncShortcuts///////////////////////
  let file_name = _file_name;
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
    await appendToFile(file_name, "\n\n");
  };
  ///////////////////////////////////////////////////////////////////////

  ///////////////////////Database Context/////////////////////////////////

  let DatabaseContext: any = await GetDatabaseContext();
  let full_tokens_list = DatabaseContext.full_tokens_list;
  let full_pools_list = DatabaseContext.full_pools_list;
  let full_protocols_list = DatabaseContext.full_protocols_list;
  let full_flows_list = DatabaseContext.full_flowslist;
  let full_functions_list = DatabaseContext.full_functions_list;
  let full_parameters_list = DatabaseContext.full_parameters_list;
  let full_networks_list = DatabaseContext.full_networks_list;

  ///////////////////////////////////////////////////////////////////////

  let steps_array = _strategy_obj.steps_array; // Shorthand For Array Of Steps
  let base_steps = _strategy_obj.strategy_initiation.base_steps; // Shorthand For Base Steps
  let steps_body_array = steps_array.filter((step: any) => {
    if (
      base_steps.find(
        (bStep: any) => bStep.step_identifier == step.step_identifier
      )
    ) {
      return false;
    }
    return true;
  }); // Shorthand For Array Of Steps, excluding base steps

  // Initiates the "Step" Struct For EAch One Of The DSL Steps
  const GenerateStepDetails = async () => {
    let siblingsMapping = new Map();
    for (const step of steps_array) {
      let step_id = step.step_identifier;
      let parent_step_id = step.parent_step_identifier;
      if (parent_step_id == undefined) continue;
      let siblings = siblingsMapping.get(parent_step_id) || [];
      siblingsMapping.set(parent_step_id, [...siblings, step_id]);
    }
    for (const [key, value] of siblingsMapping) {
      siblingsMapping.set(key, value.reverse());
    }

    await appendNewLineInterContract(
      `function updateStepsDetails() internal {`
    );
    for await (const step of steps_array) {
      // For Each Step In The Steps Array
      let step_id = step.step_identifier;
      let funcId = step.function_identifiers[0];
      let fullFunc = await getFunctionDetails(funcId);
      let args = await Promise.all(
        fullFunc.arguments.map(
          async (arg: number) => await getParameterDetails(arg)
        )
      );
      let custom_args = args.filter((arg: DBArgument) =>
        arg.value.includes("custom_arguments")
      );
      let step_additional_args_arr = [];
      let siblings = siblingsMapping.get(step.parent_step_identifier);
      let sibling_index: number | null = null;
      if (siblings && siblings.length) {
        let tIndex = siblings.indexOf(step_id);
        if (tIndex !== -1) sibling_index = tIndex + 1;
      }

      let div = sibling_index ? sibling_index : step.divisor;
      console.log(
        `Siblings for strep ${step_id} with parent id ${step.parent_step_identifier}`,
        siblings
      );
      for await (const arg of step.additional_args) {
        step_additional_args_arr.push(arg);
      }

      let newArgs: any[] = [];
      if (step_additional_args_arr.length > 0) {
        let j: number = 0;
        for (const arg of step_additional_args_arr) {
          let newArg;
          if (Array.isArray(arg)) {
            let _arg: DBArgument = custom_args[j];
            let arrayInitiation: string = `${_arg.solidity_type} memory step_${step_id}_${j}_arg = new ${_arg.solidity_type}(${arg.length});`;
            await appendNewLineInterFunction(arrayInitiation);
            for (let p = 0; p < arg.length; p++) {
              await appendNewLineInterFunction(
                `step_${step_id}_${j}_arg[${p}] = ${arg[p]};`
              );
            }
            newArg = `step_${step_id}_${j}_arg`;
          } else {
            newArg = arg;
          }
          newArgs.push(newArg);
          j++;
        }
      }
      if (step_additional_args_arr.length > 0) {
        // Append Custom Args If They Exist
        await appendNewLineInterFunction(`step_${step_id}_custom_args`); // Custom Args For Step
        await appendSameLine(` = [`);

        const appendArgToArray = async (
          _arg: any,
          index: number,
          array?: boolean,
          plain?: boolean
        ): Promise<void> => {
          // Append an opening array bracket
          if (array) {
            index !== 0
              ? appendSameLine(`, abi.encode(${_arg}`)
              : appendSameLine(`abi.encode(${_arg}`);
            return;
          }

          // Append the argument plainly without abi.encode (Mainly used for array items)
          if (plain) {
            try {
              index !== 0
                ? await appendSameLine(
                    `, ${Web3.utils.toChecksumAddress(_arg)}`
                  )
                : await appendSameLine(`${Web3.utils.toChecksumAddress(_arg)}`);
            } catch (e: any) {
              index !== 0
                ? await appendSameLine(`, ${_arg}`)
                : await appendSameLine(`${_arg}`);
            }
            return;
          }

          // Else append an abi.encoded version of it
          try {
            index !== 0
              ? await appendSameLine(
                  `, abi.encode(${Web3.utils.toChecksumAddress(_arg)})`
                )
              : await appendSameLine(
                  `abi.encode(${Web3.utils.toChecksumAddress(_arg)})`
                );
          } catch {
            index !== 0
              ? await appendSameLine(`, abi.encode(${_arg})`)
              : await appendSameLine(`abi.encode(${_arg})`);
          }
        };

        let index: number = 0;
        for (const arg of newArgs) {
          // Sufficient check to see if array, to not fuck up how it's spread out.
          if (Array.isArray(arg)) {
            // if (arg.length == 0) arg.push("0");

            await appendArgToArray("[", index, true);
            for (let i = 0; i < arg.length; i++) {
              await appendArgToArray(arg[i], i, false, true);
            }
            await appendSameLine("])");

            // Else just append the arg
          } else await appendArgToArray(arg, index);

          index++;
        }
        await appendSameLine(`];`);
        await appendNewLineInterFunction(
          `steps[${step_id}].custom_arguments = step_${step_id}_custom_args;`
        );
        // Updates Entire Step's Details
        await appendNewLineInterFunction(
          `step_${step_id} = StepDetails(${div}, step_${step_id}_custom_args);`
        );
      }
    }
    await appendNewLineInterFunction(`}`);
    for await (const step of steps_array) {
      // For Each Step In The Steps Array
      let step_id = step.step_identifier;
      let funcId = step.function_identifiers[0];
      let fullFunc = await getFunctionDetails(funcId);
      let args = await Promise.all(
        fullFunc.arguments.map(
          async (arg: number) => await getParameterDetails(arg)
        )
      );
      let custom_args: DBArgument[] = args.filter((arg: DBArgument) =>
        arg.value.includes("custom_arguments")
      );
      let siblings = siblingsMapping.get(step.parent_step_identifier);
      let sibling_index;
      if (siblings && siblings.length) {
        console.log("Siblings:", siblings);
        console.log("Current Step ID", step_id);
        let tIndex = siblings.indexOf(step_id);
        if (tIndex !== -1) sibling_index = tIndex + 1;
      }

      let div = sibling_index ? sibling_index : step.divisor;

      let step_additional_args_arr = [];
      for await (const arg of step.additional_args) {
        step_additional_args_arr.push(arg);
      }

      const appendArgToArray = async (
        _arg: any,
        index: number,
        array?: boolean,
        plain?: boolean
      ): Promise<void> => {
        // Append an opening array bracket
        if (array) {
          index !== 0
            ? appendSameLine(`, abi.encode(${_arg}`)
            : appendSameLine(`abi.encode(${_arg}`);
          return;
        }

        // Append the argument plainly without abi.encode (Mainly used for array items)
        if (plain) {
          try {
            index !== 0
              ? await appendSameLine(`, ${Web3.utils.toChecksumAddress(_arg)}`)
              : await appendSameLine(`${Web3.utils.toChecksumAddress(_arg)}`);
          } catch (e: any) {
            index !== 0
              ? await appendSameLine(`, ${_arg}`)
              : await appendSameLine(`${_arg}`);
          }
          return;
        }

        // Else append an abi.encoded version of it
        try {
          index !== 0
            ? await appendSameLine(
                `, abi.encode(${Web3.utils.toChecksumAddress(_arg)})`
              )
            : await appendSameLine(
                `abi.encode(${Web3.utils.toChecksumAddress(_arg)})`
              );
        } catch {
          index !== 0
            ? await appendSameLine(`, abi.encode(${_arg})`)
            : await appendSameLine(`abi.encode(${_arg})`);
        }
      };

      let newArgs: any[] = [];
      if (step_additional_args_arr.length > 0) {
        let j: number = 0;
        for (const arg of step_additional_args_arr) {
          let newArg;

          newArg = arg;

          newArgs.push(newArg);
          j++;
        }
      }
      await appendNewLineInterFunction(`bytes[] step_${step_id}_custom_args`); // Custom Args For Step

      await appendSameLine(`;`);

      await appendNewLineInterFunction(
        `StepDetails step_${step_id} = StepDetails(${div}, step_${step_id}_custom_args);`
      );
    }
  };

  /**
   * Generates The Strategy Running Process (That Will Be Triggered By The Keeper, And Run The Entire Strategy Correctly)
   */
  const GenerateStrategyRun = async () => {
    let current_strategy_run = 0;

    await spacing();
    await appendNewLineInterContract(
      `function runStrategy_${current_strategy_run}() public onlyExecutor {`
    );
    for await (const step of steps_body_array) {
      let step_id = step.step_identifier;
      let function_id = step.function_identifiers[0];
      let functionDetails = await getFunctionDetails(function_id);
      let paramsAmount = functionDetails.number_of_parameters;
      let stepfunc = await getFunctionDetails(function_id);
      await appendNewLineInterFunction(`updateBalances();`);
      await appendNewLineInterFunction(`updateStepsDetails();`);
      await appendNewLineInterFunction(`updateActiveStep(step_${step_id});`);
      if (
        !(await getFunctionDetails(step.function_identifiers[0])).is_callback
      ) {
        await appendNewLineInterFunction(
          `func_${function_id}("runStrategy_${current_strategy_run + 1}", [`
        );

        // Append The "Do Not Use Params" byte Into the function call, as many times as the function has parameters
        let numberArr = await createArrayByNumberInput(paramsAmount);

        if (numberArr.length === 0)
          // Append a single parameter if there are no arguments required (So solidity compiler does not go bananas)
          await appendSameLine(`abi.encode("donotuseparamsever")`);
        for await (const param of numberArr) {
          let fakeParamsArr = await createArrayByNumberInput(paramsAmount);
          let paramindex = fakeParamsArr.indexOf(param);
          paramindex !== 0
            ? await appendSameLine(`, abi.encode("donotuseparamsever")`)
            : await appendSameLine(`abi.encode("donotuseparamsever")`);
        }

        await appendSameLine(`]);`);
      } else {
        await appendNewLineInterFunction(
          `func_${function_id}("runStrategy_${current_strategy_run + 1}", [`
        );

        // Append The "Do Not Use Params" byte Into the function call, as many times as the function has parameters
        for await (const param of await createArrayByNumberInput(
          paramsAmount
        )) {
          let fakeParamsArr = await createArrayByNumberInput(paramsAmount);
          let paramindex = fakeParamsArr.indexOf(param);
          paramindex !== 0
            ? await appendSameLine(`, abi.encode("donotuseparamsever")`)
            : await appendSameLine(`abi.encode("donotuseparamsever")`);
        }
        await appendSameLine(`]);`);

        await appendNewLineInterContract(`}`);
        current_strategy_run++;
        await spacing();
        await appendNewLineInterContract(
          `function runStrategy_${current_strategy_run}(bytes[] memory _callBackParams) public onlyExecutor {`
        );
        await appendNewLineInterFunction(`callback_post(_callBackParams);`);
      }
    }
    await appendNewLineInterContract(`}`);
  };

  const GenerateReverseFunctions = async () => {
    // Checks if a function only returns token inflows, and does not consume any token outflows (meaning it is solely a net inflow for the withdrawer)
    const checkIfInflowOnly = (_step: any) => {
      return _step.inflows.length > 0 && _step.outflows.length <= 0;
    };
    // Checks if the funtion has a counter function (e.g, if deposit has a withdraw counterpart)
    const doesHaveCounterFunction = async (_functionId: any) => {
      let _funcDetails = (
        await axios.get(`https://api.yieldchain.io/functions`)
      ).data.functions.find(
        (func: any) => func.function_identifier == _functionId
      );
      return _funcDetails.counter_function_identifier;
    };

    await appendNewLineInterContract(`uint256[] public reverseFunctions = [`);

    // Filtering the strategy's body steps to only include steps that either have a counter function (i.e, decreasing the position), or ones that only return
    // token inflows (e.g, when harvesting rewards)
    let reverseWorthySteps = await Promise.all(
      steps_array.reverse().map(async (step: any) => {
        let function_id = step.function_identifiers[0];
        let counterFunction = await doesHaveCounterFunction(function_id);
        let isInflowOnly = checkIfInflowOnly(step);
        return {
          stepId: step.step_identifier,
          functionIdToInsert: isInflowOnly
            ? function_id
            : counterFunction
            ? counterFunction
            : null,
        };
      })
    );
    reverseWorthySteps = reverseWorthySteps.filter(
      (step) => step.functionIdToInsert !== null
    );

    // Appending an array of reverse function IDs to execute when withdrawing
    for await (const step of reverseWorthySteps) {
      let index = reverseWorthySteps.findIndex(
        (tStep) => tStep.stepId == step.stepId
      );
      if (step.functionIdToInsert !== null) {
        index !== 0
          ? await appendSameLine(`, ${step.functionIdToInsert}`)
          : await appendSameLine(`${step.functionIdToInsert}`);
      }
    }
    await appendSameLine(`];`);

    // Appending an array of reverse step IDs to execute when withdrawing, to get the correct custom arguments if needed, offchain.
    await appendNewLineInterContract(`uint256[] public reverseSteps = [`);
    for await (const step of reverseWorthySteps) {
      let index = reverseWorthySteps.findIndex(
        (tStep) => tStep.stepId == step.stepId
      );
      if (step.functionIdToInsert !== null) {
        index !== 0
          ? await appendSameLine(`, ${step.stepId}`)
          : await appendSameLine(`${step.stepId}`);
      }
    }
    await appendSameLine(`];`);
  };

  const GenerateStepsArray = async () => {
    await appendNewLineInterContract(
      `StepDetails[${steps_array.length}] public steps;`
    );
  };

  await GenerateStepDetails();
  await GenerateStrategyRun();
  await GenerateStepsArray();
  await GenerateReverseFunctions();
};