/**
 * get tnrafsfers instructins of a solana txn
 */

import axios from "axios";
import { TxnDetails } from "./types";

export const getTransferInstructions = async (txnID: string) => {
  const txn = (await getTxnDetails(txnID))?.data?.[0] as TxnDetails;
  if (!txn) throw "Cannot Get TXN Details - API Called Failed!";

  return getAllTransfers(txn);
};

const getTxnDetails = async (txnID: string) => {
  return await axios.post(
    "https://api.helius.xyz/v0/transactions?api-key=317671ec-e85b-4189-a2a1-b2eb86d932ec",
    {
      transactions: [txnID],
    }
  );
};

const getAllTransfers = (txnData: TxnDetails) => {
  return [
    ...txnData.tokenTransfers,
    ...txnData.nativeTransfers.map(
      (nativeTransfer: {
        fromUserAccount: string;
        toUserAccount: string;
        amount: number;
      }) => ({
        ...nativeTransfer,
        tokenAmount: nativeTransfer.amount,
      })
    ),
  ];
};
