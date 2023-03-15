import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
const __dirname = dirname(fileURLToPath(import.meta.url));
export const getStrategyTxid = async (_file_name, _network_id) => {
    console.log("Getting strategy txid");
    let stratName = _file_name.split(".sol")[0];
    let automationAddress;
    execSync("yarn hardhat compile"); // Compile the strategy contract
    let artifact = JSON.parse(fs.readFileSync(__dirname + `/../artifacts/contracts/${stratName}.sol/${stratName}.json`, "utf8"));
    console.log("Compiled got artifacts");
    let abi = artifact.abi;
    let bytecode = artifact.bytecode;
    return { abi: abi, bytecode: bytecode };
};
export const verifyContract = (_address, _networkName = "arbitrum") => {
    execSync(`yarn hardhat verify ${_address} --network ${_networkName}`); // Compile the strategy contract
};
//# sourceMappingURL=deployment.js.map