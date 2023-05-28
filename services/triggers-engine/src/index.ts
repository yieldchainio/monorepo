/**
 * Manages triggering strategies
 */
import { SupportedYCNetwork, YCClassifications, address } from "@yc/yc-models";
import { Contract, Wallet, ethers } from "ethers";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const ycContext = YCClassifications.getInstance();

// Initiallize YC context
if (!ycContext.initiallized) await ycContext.initiallize();

// Get all the supported networks
const supportedNetworks = ycContext.networks.filter(
  (network) => network.diamondAddress && network.provider
) as SupportedYCNetwork[];

const checkAllStrategiesTriggers = async (diamondContract: Contract) => {
  return (await diamondContract.checkStrategiesTriggers()) as boolean[][];
};

for (const network of supportedNetworks) {
  const signer = new Wallet(process.env.PRIVATE_KEY || "", network.provider);
  const diamondContract = new Contract(
    network.diamondAddress,
    DiamondABI,
    signer
  );
  const usedBlocks = new Set<number>();
  network.provider.on("block", async (blockNum) => {
    console.log("Checking Block #" + blockNum, "On", network.name + "...");
    if (usedBlocks.has(blockNum)) return;
    usedBlocks.add(blockNum);
    const indices: number[] = [];
    const strategiesSignals: boolean[][] = (
      await checkAllStrategiesTriggers(diamondContract)
    ).flatMap((signals, index) => {
      if (signals.includes(true)) {
        indices.push(index);
        return [signals];
      }

      return [];
    });

    if (indices.length == 0) return;

    console.log("Going To Trigger", indices.length, "Strategies...");
    try {
      await diamondContract.executeStrategiesTriggers(
        indices,
        strategiesSignals
      );
    } catch (e: any) {
      const err = e as Error;
      console.error(
        "Triggers Engine Caught Error Whilst Executing. Cause:",
        err.cause,
        "Msg:",
        err.message,
        "Stack:",
        err.stack
      );
    }
  });
}
