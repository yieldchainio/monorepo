/**
 * Build all of the token approval pairs to input into the vault constructor
 * @param seedSteps - JSONStep tree of the seed steps
 * @param treeSteps - JSONStep tree of the tree steps
 * @param uprootSteps - JSONStep tree of the uproot steps
 * @param depositToken - Deposit token of the vault
 * @return approvalPairs - 2D array of addresses [[tokenAddress, addressToApprove]]
 */
import { YCStep, YCToken, address } from "@yc/yc-models";
import { ApprovalPairs } from "../../types.js";
export declare function buildApprovalPairs(seedSteps: YCStep, treeSteps: YCStep, uprootSteps: YCStep, depositToken: YCToken, diamondAddress: address): ApprovalPairs;