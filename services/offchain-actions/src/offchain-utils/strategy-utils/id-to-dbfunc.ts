import axios from "axios";
import { DBFunction } from "../../offchain-types.js";
export const getFullFunc = async (func: number): Promise<DBFunction> => {
  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;
  let fullFunc = allFunctions.find(
    (f: DBFunction) => f.function_identifier === func
  );
  return fullFunc;
};
