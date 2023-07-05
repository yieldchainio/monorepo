import dotenv from "dotenv";
dotenv.config();
import { YCStrategy, YCClassifications, YCNetwork } from "@yc/yc-models";
import { Provider } from "ethers";
import { queryVaultShares } from "./utils/query-total-shares";
import { Block } from "ethers";
import { findBlockByTimestamp } from "./utils/find-block-by-timestamp";
import { isValidNetwork } from "./utils/type-checkers";
import { getStartAndCurrentBlocks } from "./utils/get-start-and-current-blocks";
import { Fork } from "@yc/anvil-ts";
import { AbiCoder } from "ethers";
import { TOTAL_SHARES_SLOT } from "./constants";

const context = new YCClassifications();
if (!context.initiallized) await context.initiallize();

const strategies = context.strategies;

const cachedBlocksPerNetwork = new Map<
  number,
  {
    startBlock: number;
    currentBlock: number;
  }
>();

for (const strategy of strategies) {
  if (!isValidNetwork(strategy.network)) continue;

  // const { startBlock, currentBlock } = await getStartAndCurrentBlocks(
  //   strategy.network,
  //   cachedBlocksPerNetwork
  // );

  // const startingShares = await queryVaultShares(strategy, startBlock);
  // const currentShares = await queryVaultShares(strategy, currentBlock);

  // const fixValue = (value: bigint) => {
  //   return value * (startingShares / currentShares);
  // };

  const fork = await Fork.fromRpcUrl(strategy.network.jsonRpc as string);

  const totalShares: bigint = await strategy.contract.totalShares();

  // We give ourselves all shares of the vault in order to be able to withdraw
  await fork.write(
    strategy.address,
    AbiCoder.defaultAbiCoder().encode(["uint256"], [TOTAL_SHARES_SLOT]),
    AbiCoder.defaultAbiCoder().encode(["uint256"], [totalShares])
  );
}
