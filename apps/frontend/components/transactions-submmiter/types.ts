import { address } from "@yc/yc-models";
import { BaseComponentProps, BaseModalChildProps } from "components/types.js";
import { ImageSrc } from "components/wrappers/types";
import { ContractTransaction } from "ethers";

export interface TransactionStateProps {
  image: ImageSrc;
  subImage?: ImageSrc;
  title: string;
  description: React.ReactNode | ((receipt?: TransactionReceipt) => string);
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

export type TransactionReceipt = {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  root?: string;
  gasUsed: {
    toBigInt: () => bigint;
  };
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<{
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;

    removed: boolean;

    address: string;
    data: string;

    topics: Array<string>;

    transactionHash: string;
    logIndex: number;
  }>;
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: {
    toBigInt: () => bigint;
  };
  effectiveGasPrice: {
    toBigInt: () => bigint;
  };
  byzantium: boolean;
  type: number;
  status?: number;
};

export interface TransactionSubmmiterProps extends BaseModalChildProps {
  transactions: Transactions;
  onCompletion?: (receipts: TransactionReceipt[]) => void;
}
