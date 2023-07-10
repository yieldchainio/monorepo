import dotenv from "dotenv";
dotenv.config();
import { YCClassifications } from "@yc/yc-models";
import { isValidNetwork } from "./utils/type-checkers";
import { Fork } from "@yc/anvil-ts";
import { AbiCoder } from "ethers";
import { TOTAL_SHARES_SLOT } from "./constants";
const context = new YCClassifications();
if (!context.initiallized)
    await context.initiallize();
const strategies = context.strategies;
const cachedBlocksPerNetwork = new Map();
for (const strategy of strategies) {
    if (!isValidNetwork(strategy.network))
        continue;
    // const { startBlock, currentBlock } = await getStartAndCurrentBlocks(
    //   strategy.network,
    //   cachedBlocksPerNetwork
    // );
    // const startingShares = await queryVaultShares(strategy, startBlock);
    // const currentShares = await queryVaultShares(strategy, currentBlock);
    // const fixValue = (value: bigint) => {
    //   return value * (startingShares / currentShares);
    // };
    const fork = await Fork.fromRpcUrl(strategy.network.jsonRpc);
    const totalShares = await strategy.contract.totalShares();
    // We give ourselves all shares of the vault in order to be able to withdraw
    await fork.write(strategy.address, AbiCoder.defaultAbiCoder().encode(["uint256"], [TOTAL_SHARES_SLOT]), AbiCoder.defaultAbiCoder().encode(["uint256"], [totalShares]));
}
//# sourceMappingURL=index.js.map