import {
  Transaction,
  Transactions,
} from "components/transactions-submmiter/types";
import { TransactionOrUtility, UtilityTransactionRequest } from "../types";
import { ContractTransaction } from "ethers";
import { parseApprovalTransaction } from "./approve";
import { parseUpgradeTierTransaction } from "./upgrade-tier";
import { parseCreateVaultTransaction } from "./create-vault";

export function parseTransactionRequest(
  req: TransactionOrUtility
): Transaction {
  if (isRegulerTransaction(req)) {
    return req;
  }

  switch (req.type) {
    case "approve":
      return parseApprovalTransaction(req);
    case "upgradeTier":
      return parseUpgradeTierTransaction(req);

    case "createVault":
      return parseCreateVaultTransaction(req);
    default:
      throw "Unsupported Utility Transaction";
  }
}

const isRegulerTransaction = (
  req: TransactionOrUtility
): req is Transaction => {
  return "request" in req;
};
