/**
 * Gas balance funding modal
 */

import { YCStrategy } from "@yc/yc-models";
import GradientButton from "components/buttons/gradient";
import { RegulerButton } from "components/buttons/reguler";
import { TokenInput } from "components/token-input";
import { BaseModalChildProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useYCNetwork } from "utilities/hooks/yc/useYCNetwork";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { useBalance, useContractWrite, useNetwork, useSigner } from "wagmi";
import DiamondAbi from "@yc/yc-models/src/ABIs/diamond.json" assert { type: "json" };
import { useLogs } from "utilities/hooks/stores/logger";

export const GasBalanceModal = ({
  strategy,
  modalKey,
  closeModal,
}: BaseModalChildProps & { strategy?: YCStrategy }) => {
  return (
    <div
      className="flex flex-row bg-custom-subbg w-[80%] h-[80%] mx-auto my-auto rounded-lg "
      onClick={(e) => e.stopPropagation()}
    >
      <FundingSection strategy={strategy} closeModal={closeModal} />
      <CoinSection />
    </div>
  );
};

const FundingSection = ({
  strategy,
  closeModal,
}: { strategy?: YCStrategy } & BaseModalChildProps) => {
  return (
    <div className="relative flex flex-col bg-custom-subbg w-full h-full px-20 py-16 gap-10 rounded-lg">
      <div className="flex flex-col gap-1 w-[75%]">
        <WrappedText fontStyle="medium" fontSize={26}>
          Gas Balance
        </WrappedText>
        <WrappedText
          fontSize={16}
          className="text-opacity-50 whitespace-pre-wrap"
        >
          The vault uses this balance to execute itself. You can optionally
          deposit funds to make sure it keeps on going
        </WrappedText>
      </div>
      <DepositSubSection strategy={strategy} closeModal={closeModal} />
    </div>
  );
};

const DepositSubSection = ({
  strategy,
  closeModal,
}: { strategy?: YCStrategy } & BaseModalChildProps) => {
  const { address } = useYCUser();

  const network = useYCNetwork();

  const [formattedInput, setFormattedInput] = useState<number>(0);

  const [latestRunCost, setLatestRunCost] = useState<bigint>(0n);
  useEffect(() => {
    (async () => {
      const runs = await strategy?.getStrategyRuns();
      setLatestRunCost(runs?.[0].fee || 0n);
    })();
  }, [strategy?.address]);

  const [sufficientRunsForInput, setSufficientRunsForInput] =
    useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!network.nativeToken) return 0n;
      if (latestRunCost == 0n) return 0n;
      if (isNaN(formattedInput)) return 0n;
      const perRunCost = latestRunCost;
      const rawInput = network.nativeToken.parseDecimals(formattedInput);
      setSufficientRunsForInput(
        parseFloat(
          (Number(rawInput / 1000n) / Number(perRunCost / 1000n)).toFixed(2)
        )
      );
    })();
  }, [latestRunCost, formattedInput]);

  const { data: signer, isLoading, isError } = useSigner();

  const {
    data,
    isLoading: isWriteLoading,
    isSuccess,
    writeAsync: fundGasBalance,
  } = useContractWrite({
    address: network.diamondAddress || undefined,
    mode: "recklesslyUnprepared",
    abi: DiamondAbi,
    functionName: "fundGasBalance",
  });

  const logs = useLogs();

  return (
    <div className="flex flex-col items-start justify-start w-full  gap-20 ">
      <div className="flex flex-col gap-8 w-full">
        <TokenInput
          token={network?.nativeToken || undefined}
          onChange={(newVal) => {

            setFormattedInput(parseFloat(newVal));
          }}
          address={address}
          value={formattedInput}
          className="w-full"
        />
        <WrappedText className="text-opacity-50">{`${
          isNaN(formattedInput) ? 0 : formattedInput
        } ${
          network.nativeToken?.symbol
        } Would Last For ${sufficientRunsForInput} Runs`}</WrappedText>
      </div>

      <div className="flex flex-row gap-3 ">
        <RegulerButton onClick={closeModal}>Cancel</RegulerButton>
        <GradientButton
          className="py-3"
          onClick={async () => {
            await fundGasBalance({
              recklesslySetUnpreparedArgs: [strategy?.address],
              recklesslySetUnpreparedOverrides: {
                value: BigNumber.from(
                  network.nativeToken?.parseDecimals(formattedInput)
                ),
              },
            });
            logs.lazyPush({
              type: "success",
              message: `Funded Vault Gas Balance For ${formattedInput} ${network.nativeToken?.symbol} `,
            });
            closeModal?.();
          }}
        >
          Fund
        </GradientButton>
      </div>
    </div>
  );
};

const CoinSection = () => {
  return (
    <div className="relative flex flex-col bg-custom-componentbg/50 w-full h-full overflow-hidden tablet:hidden rounded-lg">
      <WrappedImage
        src={"/icons/big-coins.svg"}
        className=" w-[100%] h-[100%] absolute top-[100%] left-[100%] translate-x-[-80%] translate-y-[-90%]"
      ></WrappedImage>
    </div>
  );
};
