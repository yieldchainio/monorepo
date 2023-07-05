/**
 * Query total shares of a vault
 */
export async function queryVaultShares(vault, blockTag) {
    return await vault.contract.totalShares({
        blockTag,
    });
}
//# sourceMappingURL=query-total-shares.js.map