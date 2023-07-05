/**
 * Query total shares of a vault
 */

import { YCStrategy } from "@yc/yc-models";
import { BlockTag } from "ethers";

export async function queryVaultShares(
  vault: YCStrategy,
  blockTag: BlockTag
): Promise<bigint> {
  return await vault.contract.totalShares({
    blockTag,
  });
}
