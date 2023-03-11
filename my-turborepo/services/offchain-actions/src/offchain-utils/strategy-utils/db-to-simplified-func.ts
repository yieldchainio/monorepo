import { ethers } from "ethers";
import {
  SimplifiedFunction,
  DBFunction,
  ExtendedArgument,
  ExtendedStepDetails,
  address,
  DBArgument,
} from "../../offchain-types.js";
import { getFunctionParams } from "./get-func-params.js";

const dbFuncsToSimplifiedFuncs = async (
  _functionsArr: DBFunction[],
  _stepsArr: ExtendedStepDetails[],
  _contractAddress: address
): Promise<SimplifiedFunction[]> => {
  let newArr = await Promise.all(
    _functionsArr.map(
      async (
        currentFunctionDetails: DBFunction | SimplifiedFunction,
        index: number
      ) => {
        try {
          // Mapping the parameters to their values, if custom arguments are present, use the custom arguments instead
          let params: ExtendedArgument[] = (
            await getFunctionParams(currentFunctionDetails as DBFunction)
          ).sort(
            (a: DBArgument, b: DBArgument) =>
              a.parameter_identifier - b.parameter_identifier
          );

          // An array of all the args that are considered custom arguments
          let onlyCustomsArr = params.filter((param) =>
            param.value.includes("abi.decode(current_custom_arguments[")
          );

          // If there are custom arguments, decode them based on the inut to the step at the corresponding index
          params = await Promise.all(
            params.map((param: DBArgument) => {
              if (
                param.value.includes("abi.decode(current_custom_arguments[")
              ) {
                let indexOfCustom = onlyCustomsArr.findIndex(
                  (tParam) =>
                    tParam.parameter_identifier == param.parameter_identifier
                );

                // If it's an array, we go over each parameter
                if (param.solidity_type.includes("[")) {
                  const decodedVal = ethers.AbiCoder.defaultAbiCoder().decode(
                    [param.solidity_type],
                    _stepsArr[index].custom_arguments[indexOfCustom]
                  )[0];
                  let newValArr: any[] = [];

                  for (let _param of decodedVal) {
                    if (param.value.includes("/*amount*/")) {
                      newValArr.push("SOMETHING_BALANCE");
                      continue;
                    }
                    newValArr.push(_param);
                  }

                  param.value = newValArr as any; // Is actually an array
                  return param;
                }

                if (param.value.includes("/*amount*/")) {
                  param.solidity_type.includes;
                  param.value = "SOMETHING_BALANCE";
                  return param;
                }

                param.value = ethers.AbiCoder.defaultAbiCoder().decode(
                  [param.solidity_type],
                  _stepsArr[index].custom_arguments[indexOfCustom]
                )[0];
              }
              if (param.value == "address(this)") {
                param.value = _contractAddress;
              }
              return param;
            })
          );

          // The new full function
          let fullFunction: SimplifiedFunction = {
            function_identifier: currentFunctionDetails.function_identifier,
            name: `func_${currentFunctionDetails.function_identifier}`,
            arguments: [...params].sort((a, b) => a.index - b.index),
            is_callback: currentFunctionDetails.is_callback,
            index: index,
          };
          return fullFunction;
        } catch (e: any) {
          console.log(
            "Caught Param Mapping error!!! Function Details: ",
            currentFunctionDetails,
            "E"
          );
          throw e;
        }
      }
    )
  );

  return newArr;
};

export default dbFuncsToSimplifiedFuncs;
