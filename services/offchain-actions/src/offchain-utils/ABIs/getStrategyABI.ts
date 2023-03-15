import axios from "axios";
import { ABI, DBFunction } from "../../offchain-types";
import abi from "./Strategy.json" assert { type: "json" };
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * This function fetches the functions from the database, and adds missing functions to the ABI
 * @returns The new ABI
 */
const getABI = async () => {
  // Fetching the functions from the database
  const functions: DBFunction[] = await (
    await axios.get("https://api.yieldchain.io/functions")
  ).data.functions;

  // Adding the missing functions to the ABI
  const newAbi: any[] =
    typeof abi === "string" ? [...JSON.parse(abi)] : [...abi];

  // Adding the missing functions to the ABI in a loop
  for (const func of functions) {
    // Checking if the function is already included in the ABI
    const isAlreadyIncluded: any | undefined = abi.find(
      (f: any) => f.name == `func_${func.function_identifier}`
    );

    // If the function is not already included, add it to the ABI
    if (!isAlreadyIncluded) {
      newAbi.push({
        inputs: [
          { internalType: "string", name: "_funcToCall", type: "string" },
          {
            internalType: `bytes[${func.arguments.length}]`,
            name: "_arguments",
            type: `bytes[${func.arguments.length}]`,
          },
        ],
        name: `func_${func.function_identifier}`,
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      });
    }
  }

  // Writing the new ABI to the file system
  fs.writeFileSync(`${__dirname}/Strategy.json`, JSON.stringify(newAbi));

  // Returning the new ABI
  return newAbi;
};

export default getABI;
