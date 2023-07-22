import {
  BuilderResponse,
  JSONStep,
  JSONStrategy,
  YCNetwork,
  YCToken,
  address,
  bytes,
} from "@yc/yc-models";
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

export interface CreateVaultTransactionRequest {
  type: "createVault";
  builderResult: {
    deploymentCalldata: bytes;
    uprootSteps: JSONStep;
  };
  strategy: Omit<JSONStrategy, "createdAt" | "address" | "execution_interval">;
  network: YCNetwork;
}

export type UtilityTransactionRequest =
  | ApprovalTransactionRequest
  | UpgradeTierTransactionRequest
  | CreateVaultTransactionRequest;

export type TransactionOrUtility = Transaction | UtilityTransactionRequest;

export type TransactionsOrUtilities = [
  TransactionOrUtility,
  ...Array<TransactionOrUtility>
];
