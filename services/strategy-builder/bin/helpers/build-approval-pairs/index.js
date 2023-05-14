/**
 * Build all of the token approval pairs to input into the vault constructor
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param uprootSteps - JSONStep tree of the uproot steps
 * @param depositToken - Deposit token of the vault
 * @return approvalPairs - 2D array of addresses [[tokenAddress, addressToApprove]]
 */
import { ethers } from "ethers";
export function buildApprovalPairs(seedSteps, treeSteps, uprootSteps, depositToken) {
    const approvalPairs = [];
    // Diamond needs to be approved of deposit token for stashing on deposits
    approvalPairs.push([
        depositToken.address,
        ethers.ZeroAddress,
    ]);
    approvalPairs.push(...getTreeApprovalPairs(seedSteps));
    approvalPairs.push(...getTreeApprovalPairs(treeSteps));
    approvalPairs.push(...getTreeApprovalPairs(uprootSteps));
    return approvalPairs;
}
function getTreeApprovalPairs(tree) {
    const pairs = [];
    tree.map((step) => {
        const relatedTokens = removeDuplicates([
            ...step.outflows,
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
                pairs.push([token.address, contract.address]);
    });
    return pairs;
}
function removeDuplicates(items) {
    return items.filter((token, index) => items.findIndex((_token) => _token.id == token.id) == index);
}
//# sourceMappingURL=index.js.map