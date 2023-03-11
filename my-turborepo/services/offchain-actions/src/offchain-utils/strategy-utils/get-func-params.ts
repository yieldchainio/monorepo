import {
  ExtendedArgument,
  DBFunction,
  DBArgument,
} from "../../offchain-types.js";
import axios from "axios";

/**
 * Get the full arguments details of a function
 * @param fullFunc
 * @returns
 */
export const getFunctionParams = async (
  fullFunc: DBFunction
): Promise<ExtendedArgument[]> => {
  let allParams = await (
    await axios.get("https://api.yieldchain.io/parameters")
  ).data.parameters;
  let functionArgumentIDs = fullFunc.arguments as number[];
  let funcArguments: ExtendedArgument[] = allParams
    .filter((p: DBArgument) =>
      functionArgumentIDs.includes(p.parameter_identifier)
    )
    .map((p: DBArgument) => {
      return {
        parameter_identifier: p.parameter_identifier,
        value: p.value,
        solidity_type: p.solidity_type,
        name: p.name,
        index: p.index,
      };
    });

  return funcArguments;
};
