import { ethers } from "ethers";
import dotenv from "dotenv";
import getABI from "../offchain-utils/ABIs/getStrategyABI.js";
const abi = await getABI();
import erc20abi from "../offchain-utils/ABIs/ERC20.json" assert { type: "json" };
dotenv.config();

const provider = new ethers.JsonRpcProvider(
  // Arbitrum RPC
  "https://arb1.arbitrum.io/rpc"
);
const wallet = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  "0x206e7dF1AF1da97852C2bC424b2c8935f3974C60",
  abi,
  wallet
);

const deposit = async () => {
  console.log("Inside deposit");

  const tx = await contract.deposit.populateTransaction(
    ethers.parseUnits("0.001")
  );

  console.log("TX", tx);
  const signedTx = await wallet.sendTransaction(tx);
  provider.waitForTransaction(signedTx.hash);
  console.log("Signed TX", signedTx);

  console.log("Sent deposit Test");
  return;
};

await deposit();
