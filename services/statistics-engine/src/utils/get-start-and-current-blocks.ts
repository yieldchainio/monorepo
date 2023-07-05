import { YCNetwork } from "@yc/yc-models";
import { findBlockByTimestamp } from "./find-block-by-timestamp";
import { Provider } from "ethers";

export const getStartAndCurrentBlocks = async (
  network: YCNetwork & { provider: Provider },
  cache: Map<number, { startBlock: number; currentBlock: number }>
): Promise<{ startBlock: number; currentBlock: number }> => {
  const cached = cache.get(network.id);
  if (cached) return cached;
  return {
    startBlock: await findBlockByTimestamp(
      network.provider,
      Date.now() - Number(process.env.STATISTIC_INTERVAL)
    ),
    currentBlock: await network.provider.getBlockNumber(),
  };
};
