import {
  Transaction,
  Transactions,
} from "components/transactions-submmiter/types";
import { TransactionOrUtility, UtilityTransactionRequest } from "../types";
import { ContractTransaction } from "ethers";
import { parseApprovalTransaction } from "./approve";
import { parseUpgradeTierTransaction } from "./upgrade-tier";

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
    default:
      throw "Unsupported Utility Transaction";
  }
}

const isRegulerTransaction = (
  req: TransactionOrUtility
): req is Transaction => {
  return "request" in req;
};
