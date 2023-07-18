import WrappedImage from "components/wrappers/image";
import {
  TransactionStateProps,
  TransactionSubmmiterProps,
  Transactions,
  status,
} from "./types";
import { useEffect, useMemo, useState } from "react";
import { TransactionImage } from "./components/TransactionImage";
import WrappedText from "components/wrappers/text";
import { ChildrenProvider } from "components/internal/render-children";
import { CloseButton } from "components/buttons/close";
import { useSigner } from "wagmi";
import { useLogs } from "utilities/hooks/stores/logger";
import { RegulerButton } from "components/buttons/reguler";
import { useYCNetwork } from "utilities/hooks/yc/useYCNetwork";
import { InfoProvider } from "components/info-providers";
import { sliceAddress, sliceTxnHash } from "utilities/general/slice-address";
import { SimpleIncrementalStepBar } from "components/progress-bar/simple";

export const TransactionsSubmmiter = ({
  transactions,
  style,
  className,
  onClick,
  closeModal,
}: TransactionSubmmiterProps) => {
  // ====================
  //    HOOKS/GLOBALS
  // ====================
  const { data: signer, isLoading, isError } = useSigner();

  const logs = useLogs();

  // ============
  //    STATES
  // ============
  if (transactions.length == 0) closeModal?.();

  const [transactionsState, setTransactionsState] = useState(transactions);

  const activeIdx = useMemo(() => {
    return transactions.length - transactionsState.length;
  }, [transactionsState.length, transactions.length]);

  const currentTransaction = useMemo(
    () => transactionsState[0],
    [transactionsState.length]
  );

  const [currentStatus, setCurrentStatus] = useState<status>("awaitingSubmit");

  const [error, setError] = useState("");

  const [currentTransactionHash, setCurrentTransactionHash] = useState("");

  const [isHandling, setIsHandling] = useState<boolean>(false);

  const currentStatusProps = useMemo(() => {
    return currentTransaction[
      (currentStatus + "Props") as
        | "awaitingSubmitProps"
        | "loadingProps"
        | "successProps"
        | "errorProps"
    ];
  }, [currentStatus, currentTransaction]);

  // ============
  //   HANDLERS
  // ============
  const handleTransactionCompleted = () => {
    console.log(
      "Transactions Original:",
      transactions,
      "Transations State:",
      transactionsState
    );
    if (transactionsState.length == 1) {
      setCurrentStatus("success");
      return;
    }
    const newTxns = [...transactionsState];
    newTxns.shift();
    setTransactionsState(newTxns as Transactions);
    setCurrentStatus("awaitingSubmit");
  };

  const handleTransactionSubmit = async () => {
    console.log("IS Loading, is Error, Signer", isLoading, isError, signer);
    try {
      // TODO: Find out how to request a wallet connection here programmatically, then request it and display a
      // TODO: "Connect Your Wallet To Continue" display on the transaction submmiter, i.e change state props temproarely
      if (isLoading) {
        await new Promise((res, rej) => {
          setTimeout(async () => {
            await handleTransactionSubmit();
            return res(true);
          }, 3000);
        });
      }

      setCurrentStatus("awaitingSubmit");

      if (!signer) {
        throw logs.lazyPush({
          type: "error",
          message: "Please Connect Your Wallet Before Proceeding",
        });
      }

      const result = await signer.sendTransaction(currentTransaction.request);

      setCurrentTransactionHash(result.hash);

      setCurrentStatus("loading");

      const receipt = await result.wait();

      if (!receipt.status) throw "Transaction Failed On Mainnet";

      handleTransactionCompleted();
    } catch (e: any) {
      console.log("Error In Handle Submit", e);
      setError(e.message);
      setCurrentStatus("error");
    }
  };

  const handleTransactionError = (err?: Error) => {
    console.error("Caught Error Handling Transaction Submit:", err || error);
  };

  // ================
  //   SIDE EFFECTS
  // ================
  useEffect(() => {
    switch (currentStatus) {
      case "awaitingSubmit": {
        if (isHandling) return;
        if (!signer) return;

        setIsHandling(true);
        handleTransactionSubmit();
      }

      case "error":
        handleTransactionError();

      default:
        setIsHandling(false);
    }
  }, [currentStatus, isLoading]);

  return (
    <div
      className={
        "relative bg-custom-bcomponentbg w-[40%] h-max flex flex-col items-center pt-16 pb-16 px-8 rounded-lg justify-between mt-auto mb-auto gap-10 overflow-hidden" +
        " " +
        (className || "")
      }
      onClick={onClick}
    >
      <CloseButton onClick={closeModal} />
      <ContentSection
        statusProps={currentStatusProps}
        status={currentStatus}
        key={`${currentStatus}_${activeIdx}`}
      />
      <div className="flex flex-col items-center justify-start gap-4 w-full text-elipsis">
        {currentStatus == "awaitingSubmit" && <ProceedInWalletInfo />}
        {currentStatus == "loading" && <JustWaitSer />}
        {currentStatus == "error" && (
          <WrappedText className="text-center text-opacity-50 whitespace-pre-wrap text-ellipsis self-start w-full overflow-hidden">{`Reason: ${error}`}</WrappedText>
        )}
        {currentStatus == "error" && (
          <RegulerButton onClick={() => setCurrentStatus("awaitingSubmit")}>
            Retry
          </RegulerButton>
        )}
        {currentStatus == "success" && (
          <TransactionHash hash={currentTransactionHash} />
        )}
        <div className="w-full self-end">
          <SimpleIncrementalStepBar
            steps={transactions.map((txn, i) => {
              if (activeIdx > i || currentStatus == "success") return txn.successProps.title;
              if (currentStatus == "loading") return txn.loadingProps.title;
              if (currentStatus == "error") return txn.errorProps.title;
              
              return txn.awaitingSubmitProps.title;
            })}
            activeIdx={transactions.length - transactionsState.length}
            color="bg-blue-500"
            size={"16px"}
          />
        </div>
      </div>
    </div>
  );
};

const ContentSection = ({
  statusProps,
  status,
}: {
  statusProps: TransactionStateProps;
  status: status;
}) => {
  return (
    <div className="flex flex-col items-center justify-start gap-4">
      <TransactionImage
        image={statusProps.image}
        subImage={statusProps.subImage}
        isLoading={status == "loading"}
      />
      <div className="flex flex-col items-center gap-1 animate-slideLeft">
        <WrappedText fontSize={24} fontStyle="medium">
          {statusProps.title}
        </WrappedText>
        <ChildrenProvider
          textProps={{
            fontSize: 14,
            className: "text-opacity-70",
          }}
        >
          {statusProps.description}
        </ChildrenProvider>
      </div>
    </div>
  );
};

const ProceedInWalletInfo = () => {
  return (
    <div className="flex flex-row items-center">
      <WrappedText fontSize={14} className="text-opacity-70">
        Proceed In Wallet
      </WrappedText>
    </div>
  );
};

const JustWaitSer = () => {
  return (
    <div className="flex flex-row items-center">
      <WrappedText fontSize={14} className="text-opacity-70">
        Wait Until The Transaction Confirms
      </WrappedText>
    </div>
  );
};

const TransactionHash = ({ hash }: { hash: string }) => {
  const network = useYCNetwork();
  return (
    <InfoProvider contents="View On Block Explorer">
      <div
        className="cursor-pointer flex flex-row items-center justify-center py-1 px-6 rounded-full bg-custom-textColor bg-opacity-[5%] hover:bg-opacity-[15%] transition duration-200 ease-in-out border-[1px] border-custom-border gap-2"
        onClick={() => {
          window.open(`${network?.blockExplorer}/tx/${hash}`);
        }}
      >
        <WrappedText fontSize={12}>{sliceTxnHash(hash)}</WrappedText>
        <WrappedImage
          src={{
            dark: "/icons/link-light.svg",
            light: "/icons/link-dark.svg",
          }}
          width={14}
          height={14}
        />
      </div>
    </InfoProvider>
  );
};
