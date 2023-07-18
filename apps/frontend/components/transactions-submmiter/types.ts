import { address } from "@yc/yc-models";
import { BaseComponentProps, BaseModalChildProps } from "components/types.js";
import { ImageSrc } from "components/wrappers/types";
import { ContractTransaction } from "ethers";

export interface TransactionStateProps {
  image: ImageSrc;
  subImage?: ImageSrc;
  title: string;
  description: string | React.ReactNode;
}

export type status = "awaitingSubmit" | "loading" | "success" | "error";

export interface Transaction {
  request: {
    to: address;
    data: string;
    gasLimit?: bigint;
  };
  awaitingSubmitProps: TransactionStateProps;
  loadingProps: TransactionStateProps;
  successProps: TransactionStateProps;
  errorProps: TransactionStateProps;
}

export type Transactions = [Transaction, ...Array<Transaction>];

export interface TransactionSubmmiterProps extends BaseModalChildProps {
  transactions: Transactions;
}
