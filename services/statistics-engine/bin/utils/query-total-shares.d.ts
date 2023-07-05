/**
 * Query total shares of a vault
 */
import { YCStrategy } from "@yc/yc-models";
import { BlockTag } from "ethers";
export declare function queryVaultShares(vault: YCStrategy, blockTag: BlockTag): Promise<bigint>;
