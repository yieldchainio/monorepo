import { YCToken, address } from "@yc/yc-models";
import { Transaction } from "components/transactions-submmiter/types";

export interface ApprovalTransactionRequest {
  type: "approve";
  token: YCToken
  amount: bigint;
  spender: string;
}

export type UtilityTransactionRequest = ApprovalTransactionRequest;

export type TransactionOrUtility = Transaction | UtilityTransactionRequest;

export type TransactionsOrUtilities = [
  TransactionOrUtility,
  ...Array<TransactionOrUtility>
];
