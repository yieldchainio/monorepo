/**
 * Manages triggering strategies
 */
import { YCClassifications } from "@yc/yc-models";
import { Contract, Wallet } from "ethers";
import DiamondABI from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import dotenv from "dotenv";
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
const executeStrategiesTriggers = async (diamondContract, validVaultsIndices, signals) => { };
for (const network of supportedNetworks) {
    const signer = new Wallet(process.env.PRIVATE_KEY || "", network.provider);
    const diamondContract = new Contract(network.diamondAddress, DiamondABI, signer);
    const usedBlocks = new Set();
    network.provider.on("block", async (blockNum) => {
        console.log("Checking Block #" + blockNum, "On", network.name + "...");
        if (usedBlocks.has(blockNum))
            return;
        usedBlocks.add(blockNum);
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
        console.log("Going To Trigger", indices.length, "Strategies...");
        try {
            await diamondContract.executeStrategiesTriggers(indices, strategiesSignals);
        }
        catch (e) {
            const err = e;
            console.error("Triggers Engine Caught Error Whilst Executing. Cause:", err.cause, "Msg:", err.message, "Stack:", err.stack);
        }
    });
}
//# sourceMappingURL=index.js.map