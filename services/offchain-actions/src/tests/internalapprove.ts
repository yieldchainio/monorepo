import { ethers, MaxUint256, Wallet } from "ethers";
import getABI from "../offchain-utils/ABIs/getStrategyABI.js";
const abi = await getABI();
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(
  // Arbitrum RPC
  "https://arb1.arbitrum.io/rpc"
);

let wallet: Wallet = new ethers.Wallet(
  "0x" + process.env.PRIVATE_KEY,
  provider
);
const strategyContractInstance = new ethers.Contract(
  "0x206e7dF1AF1da97852C2bC424b2c8935f3974C60",
  abi,
  wallet
);

const data = await strategyContractInstance.internalApprove(
  "0xAFda6ef1983605D86002198DbA21b86405437fEc",
  ethers.getAddress("0x9bc2735791c476c859a47b8caefc65f18771f7c7"),
  "1000000000000000000000000000000",
  {
    gasLimit: 30000000,
  }
);

console.log(data);
