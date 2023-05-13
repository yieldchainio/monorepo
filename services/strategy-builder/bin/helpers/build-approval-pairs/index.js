/**
 * Build all of the token approval pairs to input into the vault constructor
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param uprootSteps - JSONStep tree of the uproot steps
 * @param depositToken - Deposit token of the vault
 * @return approvalPairs - 2D array of addresses [[tokenAddress, addressToApprove]]
 */
export function buildApprovalPairs(seedSteps, treeSteps, uprootSteps, depositToken, diamondAddress) {
    const approvalPairs = [];
    // Diamond needs to be approved of deposit token for stashing on deposits
    approvalPairs.push([depositToken.address, diamondAddress]);
    seedSteps.map((step) => {
        const relatedTokens = removeDuplicates([
            ...step.outflows,
            ...step.inflows,
            ...(step.function?.inflows || []),
            ...(step.function?.outflows || []),
        ]);
        const relatedContracts = step.function?.address?.address
            ? removeDuplicates([
                step.function.address,
                ...step.function.address.relatedContracts,
            ])
            : [];
        for (const contract of relatedContracts)
            for (const token of relatedTokens)
                approvalPairs.push([
                    token.address,
                    contract.address,
                ]);
    });
    return approvalPairs;
}
function removeDuplicates(items) {
    return items.filter((token, index) => items.findIndex((_token) => _token.id == token.id) == index);
}
//# sourceMappingURL=index.js.map