/**
 * Processor of blocks and transactions
 */
import { YCNetwork } from "@yc/yc-models";
import { Provider } from "ethers";
export declare class BlocksQueue {
    #private;
    constructor(network: YCNetwork & {
        provider: Provider;
    }, blockProcessor: (blockNum: number) => Promise<void> | void);
    start(): Promise<void>;
}
