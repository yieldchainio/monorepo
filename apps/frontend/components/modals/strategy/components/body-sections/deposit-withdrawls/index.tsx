/**
 * The section of the strategy modal
 * that allows the user to deposit & withdraw tokens
 * out of the strategy (base interactions w the strategy)
 */

import { EthersExecutor, YCStrategy } from "@yc/yc-models";
import GradientButton from "components/buttons/gradient";
import WrappedImage from "components/wrappers/image";
import WrappedInput from "components/wrappers/input";
import WrappedText from "components/wrappers/text";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { InterModalSection } from "../../general/modal-section";
import { useBalance, useNetwork, useSigner } from "wagmi";
import useDebounce from "utilities/hooks/general/useDebounce";
import { InfoProvider } from "components/info-providers";
useBalance;

export const StrategyOperationsBox = ({
  strategy,
}: {
  strategy?: YCStrategy;
}) => {
  // Keeping track of the current operation (either a deposit or withdrawl)
  const [operation, setOperation] = useState<"Deposit" | "Withdraw">("Deposit");

  // Keep track of the input box value on the operation box
  const [valueInput, setValueInput] = useState<number>(0);
  const debouncedValue = useDebounce(valueInput, 500);

  // User's details
  const { address } = useYCUser();

  const balanceData = useBalance({
    address: address,
    token: strategy?.depositToken.address as `0x${string}`,
  });

  console.log("Balance Data", balanceData);

  const { data: signer, isLoading, isError } = useSigner();

  const { chain } = useNetwork();

  // Handle an operation (Deposit/Withdraw)
  const handleOperation = useCallback(async () => {
    if (!signer) {
      console.error(
        "Signer Undefined! data:",
        signer,
        "Loading:",
        isLoading,
        "Error:",
        isError
      );
    }
    if (!chain?.id) return;

    if (operation == "Deposit") {
      return await strategy?.fullDeposit(parseFloat(valueInput.toString()), {
        from: address as unknown as string,
        executionCallback: async (req) => {
          const res = await signer?.sendTransaction(req as any);
          if (!res)
            throw "Cannot Deposit - Res Undefined In Execution Callback";
          return {
            hash: res.hash,
          };
        },
        chainID: chain.id,
      });
    }

    if (operation == "Withdraw") {
      return await strategy?.withdraw(parseFloat(valueInput.toString()), {
        from: address as unknown as string,
        executionCallback: async (req) => {
          const res = await signer?.sendTransaction(req as any);
          if (!res)
            throw "Cannot Withdraw - Res Undefined In Execution Callback";
          return {
            hash: res.hash,
          };
        },
        chainID: chain.id,
      });
    }
  }, [operation, strategy?.stringify(), debouncedValue]);

  return (
    <InterModalSection
      height="h-[100%]"
      width="w-[40%] tablet:w-[100%] flex flex-col items-center justify-center"
      paddingX="px-0"
    >
      <OperationsHeader
        titles={["Deposit", "Withdraw"]}
        state={operation}
        setter={setOperation as (status: string) => void}
      />
      <div className="flex flex-col w-full h-full items-center justify-center gap-6">
        <InputSection
          strategy={strategy}
          state={operation}
          onChange={(value: number) => setValueInput(value)}
          balance={balanceData}
          value={valueInput}
        />
        <GradientButton
          className="py-3 max-w-[300px]"
          width={"w-[80%]"}
          onClick={async () => await handleOperation()}
        >
          {"Confirm" + " " + operation}
        </GradientButton>
      </div>
    </InterModalSection>
  );
};

/**
 * Sub component for the input section
 */

const InputSection = ({
  strategy,
  state,
  onChange,
  balance,
  value,
}: {
  strategy?: YCStrategy;
  state: "Deposit" | "Withdraw";
  onChange: (value: number) => any;
  balance?: {
    data?: {
      formatted?: string;
    };
    isLoading?: boolean;
    isError?: boolean;
  };
  value: number;
}) => {
  const balanceText = useMemo(() => {
    if (balance?.data?.formatted)
      return parseFloat(balance.data.formatted).toFixed(7);
    if (balance?.isLoading) return "Loading...";
    if (balance?.isError) return "Failed To Fetch";
  }, [balance?.data?.formatted, balance?.isError, balance?.isLoading]);
  return (
    <div className="flex flex-col items-center justify-start gap-2 w-full">
      <div className="w-[80%] h-max flex flex-col justify-start items-start">
        <div className="flex flex-row items-center justify-between w-[95%]">
          <WrappedText className="text-opacity-50 w-max" fontSize={12}>
            {state + " " + "Amount"}
          </WrappedText>
          <InfoProvider contents="Use Max Balance">
            <WrappedText
              className="text-opacity-50 w-max cursor-pointer"
              fontSize={12}
              onClick={() => {
                console.log(
                  balanceText
                    ? `Gonna Change:, ${value}, "To This:", ${balanceText}`
                    : "Not Gonna CHange hehe" + balanceText
                );
                balanceText ? onChange(parseFloat(balanceText)) : null;
              }}
            >
              {"Balance: " + balanceText}
            </WrappedText>
          </InfoProvider>
        </div>

        <WrappedInput
          icon={
            <div className="absolute pointer-events-none mr-6 flex flex-row gap-1 items-center justify-center bg-custom-bg rounded-xl pl-1">
              <WrappedImage
                src={strategy?.depositToken?.logo || undefined}
                width={18}
                height={18}
                className="rounded-full"
              />
              <WrappedText fontSize={11} fontStyle="bold" className=" mt-1 ">
                {strategy?.depositToken?.symbol}
              </WrappedText>
            </div>
          }
          type={"number"}
          placeholder="0.00"
          className="w-max pr-[2vw]"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value as unknown as number)
          }
          value={`${value}`}
        ></WrappedInput>
      </div>
    </div>
  );
};

/**
 * Sub component spreading these titles out
 */

const OperationsHeader = <T extends string[]>({
  setter,
  state,
  titles,
}: {
  titles: T;
  setter: (status: string) => void;
  state: string;
}) => {
  // Memo some styling fields relating to the operation status
  const buttonBorderJustification = useMemo(() => {
    if (state == titles[0]) return "start";
    else return "end";
  }, [state]);

  return (
    <div className="w-full h-[20%] bg-custom-bg rounded-t-xl flex flex-col gap-0 border-[1px] border-custom-border dark:border-[0px]">
      <div className="flex flex-row w-full h-full  ">
        {titles.map((title, i) => (
          <OperationTitle<string>
            title={title}
            setter={setter}
            state={state}
            key={i}
          />
        ))}
      </div>
      <div
        className="flex flex-row w-full transition duration-200 ease-in-out "
        style={{
          justifyContent: buttonBorderJustification,
        }}
      >
        <div className="w-[50%] h-[2%] border-[1px] border-custom-textColor transition duration-200 ease-in-out "></div>
      </div>
    </div>
  );
};

/**
 * A sub component for the title of each operation
 */

const OperationTitle = <T,>({
  title,
  setter,
  state,
}: {
  title: T;
  setter: (status: T) => void;
  state: string;
}) => {
  const opacity = useMemo(() => {
    if (state === title) return "100%";
    else return "40%";
  }, [state]);

  const fontStyle = useMemo(() => {
    if (state == title) return "bold";
    else return "reguler";
  }, [state]);
  return (
    <div
      className="flex flex-row items-center justify-center w-[50%]  cursor-pointer  pt-1"
      onClick={() => setter(title)}
    >
      <WrappedText
        style={{
          opacity: opacity,
          fontWeight: fontStyle,
        }}
        fontSize={13}
        className="transition duration-200 ease-in-out"
      >
        {title as string}
      </WrappedText>
    </div>
  );
};
