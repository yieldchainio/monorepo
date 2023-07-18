import { TransactionsSubmmiter } from "components/transactions-submmiter";
import { Transactions } from "components/transactions-submmiter/types";
import { useModals } from "utilities/hooks/stores/modal";
import { TransactionsOrUtilities, UtilityTransactionRequest } from "./types";
import { ContractTransaction } from "ethers";
import { parseTransactionRequest } from "./utility-txns-parsers";

export function sendTransactions(transactions: TransactionsOrUtilities) {
  const modals = useModals();

  const submitTransactions = () =>
    modals.lazyPush(
      <TransactionsSubmmiter
        transactions={
          transactions.map((txn) =>
            parseTransactionRequest(txn)
          ) as Transactions
        }
      />
    );

  return { submitTransactions };
}
