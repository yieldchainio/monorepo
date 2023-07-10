/**
 * Binary search function to find a block by it's timestamp
 * @param provider - Provider to search on
 * @param timestamp - Desired timestamp
 */
import { Provider } from "ethers";
export declare function findBlockByTimestamp(provider: Provider, timestamp: number, maxDelta?: number): Promise<number>;
