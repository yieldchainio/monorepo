import { ethers, InterfaceAbi } from "ethers";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const getStrategyTxid = async (
  _file_name: string,
  _network_id: string | number
) => {
  console.log("Getting strategy txid");
  let stratName: string = _file_name.split(".sol")[0];
  let automationAddress;
  execSync("yarn hardhat compile"); // Compile the strategy contract
  let artifact: any = JSON.parse(
    fs.readFileSync(
      __dirname + `/../artifacts/contracts/${stratName}.sol/${stratName}.json`,
      "utf8"
    )
  );
  console.log("Compiled got artifacts");
  let abi: InterfaceAbi = artifact.abi;
  let bytecode: any = artifact.bytecode;
  return { abi: abi, bytecode: bytecode };
};

export const verifyContract = (
  _address: string,
  _networkName: string = "arbitrum"
) => {
  execSync(`yarn hardhat verify ${_address} --network ${_networkName}`); // Compile the strategy contract
};
