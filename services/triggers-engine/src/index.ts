/**
 * Manages triggering strategies
 */
import { SupportedYCNetwork, YCClassifications, address } from "@yc/yc-models";
import { AbiCoder, Contract, Wallet, ethers, TransactionRequest } from "ethers";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import dotenv from "dotenv";
import {
  EMPTY_BYTES_ARRAY,
  IsTriggerNotReadyError,
  isInsufficientGasBalanceError,
} from "./constants.js";
import { BlocksQueue } from "./classes/blocks-queue.js";
import { TriggersQueue } from "./classes/triggers-queue.js";
dotenv.config();

const ycContext = YCClassifications.getInstance();

// Initiallize YC context
if (!ycContext.initiallized) await ycContext.initiallize();

// Get all the supported networks
const supportedNetworks = ycContext.networks.filter(
  (network) => network.diamondAddress && network.provider
) as SupportedYCNetwork[];

const checkAllStrategiesTriggers = async (
  diamondContract: Contract,
  blockTag: number
) => {
  return (await diamondContract.checkStrategiesTriggers({
    blockTag,
  })) as boolean[][];
};

for (const network of supportedNetworks) {
  const signer = new Wallet(process.env.PRIVATE_KEY || "", network.provider);
  const diamondContract = new Contract(
    network.diamondAddress,
    DiamondABI,
    signer
  );

  const triggersQueue = new TriggersQueue(signer, diamondContract);

  async function processBlock(blockNum: number) {
    const indices: number[] = [];

    const strategiesSignals: boolean[][] = (
      await checkAllStrategiesTriggers(diamondContract, blockNum)
    ).flatMap((signals, index) => {
      if (signals.includes(true)) {
        indices.push(index);
        return [signals];
      }

      return [];
    });

    if (indices.length == 0) return;

    const allVaults: address[] = await diamondContract.getStrategiesList();

    console.log("Going To Trigger", indices.length, "Strategies...");

    for (const strategyIdx of indices) {
      const vault = allVaults[strategyIdx];

      const triggers = strategiesSignals.shift();
      if (!triggers)
        throw "[TriggersEngine]: Iterating over valid vault but triggers shift() returned undefined";

      for (let i = 0; i < triggers.length; i++)
        if (triggers[i] == true) triggersQueue.push(vault, i); // Only if trigger valid & ready
    }
  }

  const blocksQueue = new BlocksQueue(network, processBlock);

  blocksQueue.start();
}
