import { ethers, Wallet } from "ethers";
import dotenv from "dotenv";
import getABI from "../offchain-utils/ABIs/getStrategyABI.js";
dotenv.config();

const abi = await getABI();

const provider = new ethers.JsonRpcProvider(
  // Arbitrum RPC URL
  "https://arb1.arbitrum.io/rpc"
);

let wallet: Wallet = new ethers.Wallet(
  "0x" + process.env.PRIVATE_KEY,
  provider
);

let stratContractInstance: any = new ethers.Contract(
  "0x206e7dF1AF1da97852C2bC424b2c8935f3974C60",
  abi,
  wallet
);
let tx: any = await stratContractInstance.runStrategy_0({
  
});
