import { YCNetwork } from "@yc/yc-models";
import { Provider } from "ethers";
export declare const getStartAndCurrentBlocks: (network: YCNetwork & {
    provider: Provider;
}, cache: Map<number, {
    startBlock: number;
    currentBlock: number;
}>) => Promise<{
    startBlock: number;
    currentBlock: number;
}>;
