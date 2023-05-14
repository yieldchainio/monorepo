/**
 * Build all of the token approval pairs to input into the vault constructor
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param uprootSteps - JSONStep tree of the uproot steps
 * @param depositToken - Deposit token of the vault
 * @return approvalPairs - 2D array of addresses [[tokenAddress, addressToApprove]]
 */

import {
  JSONStep,
  YCContract,
  YCStep,
  YCToken,
  address,
  ApprovalPairs,
} from "@yc/yc-models";
import { ethers } from "ethers";

export function buildApprovalPairs(
  seedSteps: YCStep,
  treeSteps: YCStep,
  uprootSteps: YCStep,
  depositToken: YCToken
): ApprovalPairs {
  const approvalPairs: address[][] = [];

  // Diamond needs to be approved of deposit token for stashing on deposits
  approvalPairs.push([
    depositToken.address as address,
    ethers.ZeroAddress as address,
  ]);

  approvalPairs.push(...getTreeApprovalPairs(seedSteps));
  approvalPairs.push(...getTreeApprovalPairs(treeSteps));
  approvalPairs.push(...getTreeApprovalPairs(uprootSteps));
  return approvalPairs;
}

function getTreeApprovalPairs(tree: YCStep) {
  const pairs: ApprovalPairs = [];
  tree.map((step: YCStep) => {
    const relatedTokens = removeDuplicates<YCToken>([
      ...step.outflows,
      ...(step.function?.outflows || []),
    ]);

    const relatedContracts = step.function?.address?.address
      ? removeDuplicates<YCContract>([
          step.function.address,
          ...step.function.address.relatedContracts,
        ])
      : [];

    for (const contract of relatedContracts)
      for (const token of relatedTokens)
        pairs.push([token.address as address, contract.address as address]);
  });

  return pairs;
}

function removeDuplicates<T extends { id: string }>(items: T[]): T[] {
  return items.filter(
    (token: T, index: number) =>
      items.findIndex((_token) => _token.id == token.id) == index
  );
}
