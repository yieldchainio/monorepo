/**
 * Manages triggering strategies
 */
import { YCClassifications } from "@yc/yc-models";
import { AbiCoder, Contract, Wallet } from "ethers";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import dotenv from "dotenv";
import { EMPTY_BYTES_ARRAY, IsTriggerNotReadyError, isInsufficientGasBalanceError, } from "./constants";
dotenv.config();
const ycContext = YCClassifications.getInstance();
// Initiallize YC context
if (!ycContext.initiallized)
    await ycContext.initiallize();
// Get all the supported networks
const supportedNetworks = ycContext.networks.filter((network) => network.diamondAddress && network.provider);
const checkAllStrategiesTriggers = async (diamondContract) => {
    return (await diamondContract.checkStrategiesTriggers());
};
for (const network of supportedNetworks) {
    const signer = new Wallet(process.env.PRIVATE_KEY || "", network.provider);
    const diamondContract = new Contract(network.diamondAddress, DiamondABI, signer);
    const usedBlocks = new Set();
    const isValidBlock = (blockNum) => {
        if (usedBlocks.has(blockNum))
            return false;
        usedBlocks.add(blockNum);
        return true;
    };
    network.provider.on("block", async (blockNum) => {
        console.log("Checking Block #" + blockNum, "On", network.name + "...");
        if (!isValidBlock(blockNum))
            return;
        const indices = [];
        const strategiesSignals = (await checkAllStrategiesTriggers(diamondContract)).flatMap((signals, index) => {
            if (signals.includes(true)) {
                indices.push(index);
                return [signals];
            }
            return [];
        });
        if (indices.length == 0)
            return;
        const allVaults = await diamondContract.getStrategiesList();
        console.log("Going To Trigger", indices.length, "Strategies...");
        for (const strategyIdx of indices) {
            const vault = allVaults[strategyIdx];
            const triggers = strategiesSignals.shift();
            if (!triggers)
                throw "[TriggersEngine]: Iterating over valid vault but triggers shift() returned undefined";
            for (let i = 0; i < triggers.length; i++) {
                if (triggers[i] == false)
                    continue; // Trigger not ready
                try {
                    const encodedParams = AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [vault, i]);
                    const callData = await diamondContract.executeStrategyTriggerWithData.resolveOffchainData(EMPTY_BYTES_ARRAY, encodedParams, {
                        enableCcipRead: true,
                        blockTag: "latest",
                    });
                    await signer.sendTransaction({
                        to: network.diamondAddress,
                        data: callData,
                    });
                }
                catch (error) {
                    // If simply not ready we continue on, otherwise throw the exception
                    if (IsTriggerNotReadyError(error))
                        continue;
                    if (isInsufficientGasBalanceError(error))
                        continue;
                    console.error("[TriggersEngine]: Caught Unknown Exception While Executing Trigger.");
                    throw error;
                }
            }
        }
    });
}
//# sourceMappingURL=index.js.map