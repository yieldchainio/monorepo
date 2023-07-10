import { findBlockByTimestamp } from "./find-block-by-timestamp";
export const getStartAndCurrentBlocks = async (network, cache) => {
    const cached = cache.get(network.id);
    if (cached)
        return cached;
    return {
        startBlock: await findBlockByTimestamp(network.provider, Date.now() - Number(process.env.STATISTIC_INTERVAL)),
        currentBlock: await network.provider.getBlockNumber(),
    };
};
//# sourceMappingURL=get-start-and-current-blocks.js.map