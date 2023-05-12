/**
 * Build all of the token approval pairs to input into the vault constructor
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param uprootSteps - JSONStep tree of the uproot steps
 * @param depositToken - Deposit token of the vault
 * @return approvalPairs - 2D array of addresses [[tokenAddress, addressToApprove]]
 */

import { JSONStep, YCContract, YCStep, YCToken, address } from "@yc/yc-models";
import { ApprovalPairs } from "../../types.js";

export function buildApprovalPairs(
  seedSteps: YCStep,
  treeSteps: YCStep,
  uprootSteps: YCStep,
  depositToken: YCToken,
  diamondAddress: address
): ApprovalPairs {
  const approvalPairs: address[][] = [];

  // Diamond needs to be approved of deposit token for stashing on deposits
  approvalPairs.push([depositToken.address as address, diamondAddress]);

  seedSteps.map((step: YCStep) => {
    const relatedTokens = removeDuplicates<YCToken>([
      ...step.outflows,
      ...step.inflows,
      ...(step.function?.inflows || []),
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
        approvalPairs.push([
          token.address as address,
          contract.address as address,
        ]);
  });
  return approvalPairs;
}

function removeDuplicates<T extends { id: string }>(items: T[]): T[] {
  return items.filter(
    (token: T, index: number) =>
      items.findIndex((_token) => _token.id == token.id) == index
  );
}
