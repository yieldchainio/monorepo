import { YCToken, address } from "@yc/yc-models";
import { YCTier } from "@yc/yc-models/src/core/tier";
import { Transaction } from "components/transactions-submmiter/types";

export interface ApprovalTransactionRequest {
  type: "approve";
  token: YCToken;
  amount: bigint;
  spender: string;
}

export interface UpgradeTierTransactionRequest {
  type: "upgradeTier";
  token: YCToken;
  tier: YCTier;
  amount: bigint;
  isLifetime: boolean;
}

export type UtilityTransactionRequest =
  | ApprovalTransactionRequest
  | UpgradeTierTransactionRequest;

export type TransactionOrUtility = Transaction | UtilityTransactionRequest;

export type TransactionsOrUtilities = [
  TransactionOrUtility,
  ...Array<TransactionOrUtility>
];
