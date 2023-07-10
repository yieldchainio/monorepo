/**
 * Binary search function to find a block by it's timestamp
 * @param provider - Provider to search on
 * @param timestamp - Desired timestamp
 */
import { JsonRpcProvider } from "ethers";
export async function findBlockByTimestamp(provider, timestamp, maxDelta = 10) {
    let bottom = 0;
    let top = await provider.getBlockNumber();
    let mid = (bottom + top) / 2;
    let minBlockNumber = 0;
    let maxBlockNumber = await provider.getBlockNumber();
    let closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2);
    let closestBlock = (await provider.getBlock(closestBlockNumber));
    let foundExactBlock = false;
    while (minBlockNumber <= maxBlockNumber) {
        if (closestBlock.timestamp === timestamp) {
            foundExactBlock = true;
            break;
        }
        else if (closestBlock.timestamp > timestamp) {
            maxBlockNumber = closestBlockNumber - 1;
        }
        else {
            minBlockNumber = closestBlockNumber + 1;
        }
        closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2);
        closestBlock = (await provider.getBlock(closestBlockNumber));
    }
    const previousBlockNumber = closestBlockNumber - 1;
    const previousBlock = await provider.getBlock(previousBlockNumber);
    const nextBlockNumber = closestBlockNumber + 1;
    const nextBlock = await provider.getBlock(nextBlockNumber);
    return closestBlockNumber;
}
function isApproxEqual(num1, num2, maxDelta) {
    return Math.abs(num1 - num2) <= maxDelta;
}
await findBlockByTimestamp(new JsonRpcProvider("https://arbitrum.public-rpc.com"), 1688375640);
//# sourceMappingURL=find-block-by-timestamp.js.map