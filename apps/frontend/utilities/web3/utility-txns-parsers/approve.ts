import { erc20ABI, useSigner } from "wagmi";
import { ApprovalTransactionRequest } from "../types";
import { Contract, providers } from "ethers";
import ERC20ABI from "@yc/yc-models/src/ABIs/erc20.json" assert { type: "json" };
import { Interface } from "ethers/lib/utils";
import { ContractTransaction, PopulatedTransaction } from "ethers";
import { Transaction } from "components/transactions-submmiter/types";

export function parseApprovalTransaction(
  req: ApprovalTransactionRequest
): Transaction {
  const iface = new Interface(erc20ABI);
  const calldata = iface.encodeFunctionData(iface.getFunction("approve"), [
    req.spender,
    req.amount,
  ]);

  const txn = {
    to: req.token.address as `0x${string}`,
    data: calldata,
  };

  return {
    request: txn,
    awaitingSubmitProps: {
      title: `Approve ${req.token.formatDecimals(req.amount)} ${
        req.token.symbol
      }`,
      description: `Approve Allowance Of ${req.token.formatDecimals(
        req.amount
      )} ${req.token.symbol}`,
      image: req.token.logo,
    },
    loadingProps: {
      title: `Approving ${req.token.formatDecimals(req.amount)} ${
        req.token.symbol
      }...`,
      description: `Submmited Approval To The Network, Awaiting Completion...`,
      image: req.token.logo,
    },
    successProps: {
      title: `Approved ${req.token.formatDecimals(req.amount)} ${
        req.token.symbol
      }`,
      description: `Successfully Approved Sufficient Allowance`,
      image: "/icons/green-checkmark-full.svg",
    },
    errorProps: {
      title: `Failed To Approve ${req.token.symbol}`,
      description: `Approval Of ${req.token.formatDecimals(req.amount)} ${
        req.token.symbol
      } Failed`,
      image: "/icons/error.png",
    },
  };
}
