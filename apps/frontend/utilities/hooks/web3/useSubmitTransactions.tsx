import { TransactionsOrUtilities } from "utilities/web3/types";
import { useModals } from "../stores/modal";
import { TransactionsSubmmiter } from "components/transactions-submmiter";
import { parseTransactionRequest } from "utilities/web3/utility-txns-parsers";
import {
  TransactionReceipt,
  Transactions,
} from "components/transactions-submmiter/types";

export function useSubmitTransactions() {
  const modals = useModals();

  const submitTransactions = (
    transactions: TransactionsOrUtilities,
    onComplete?: (receipts: TransactionReceipt[]) => void
  ) => {
    modals.lazyPush(
      <TransactionsSubmmiter
        transactions={
          transactions.map((txn) =>
            parseTransactionRequest(txn)
          ) as Transactions
        }
        onCompletion={onComplete}
      />
    );
  };

  return { submitTransactions };
}
