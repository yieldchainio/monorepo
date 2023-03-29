/**
 * The section component for the gas funding box.
 *
 * @note This is not the gas funding modal, just the box where
 * you can view the gas balance and initiate the gas funding modal
 *
 *
 * @param gasBalanceWei - the gas balance of the vault in raw wei (unformatted)
 * @param network - the network of the strategy. We access methods on
 * it's native token.
 */

import { YCStrategy } from "@yc/yc-models";
import { RegulerButton } from "components/buttons/reguler";
import WrappedText from "components/wrappers/text";
import { useEffect, useState } from "react";
import { MediaScreens } from "types/styles/media-breakpoints";
import { formatMoney } from "utilities/general/format-money";
import {
  MediaScreenSizes,
  useMediaBreakpoints,
} from "utilities/hooks/styles/useMediaBreakpoints";
import { InfoSection } from "../../general/info-section";
import { InterModalSection } from "../../general/modal-section";

export const GasBalance = ({ strategy }: { strategy?: YCStrategy }) => {
  // A state for the formatted interval (e.g "5 Days", "8 Hours")
  const [formattedInterval, setFormattedInterval] = useState<
    string | undefined
  >();

  // Gas balance in native token
  const [gasBalance, setGasBalance] = useState<string | undefined>();
  const [usdGasBalance, setUSDGasBalance] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const { balance, usdValue } = (await strategy?.gasBalanceAndUSD()) || {};
      setGasBalance(
        formatMoney(
          strategy?.network?.nativeToken?.formatDecimals(balance || 0n) || 0
        ).split("$")[1]
      );
      setUSDGasBalance(formatMoney(usdValue || 0));
    })();
  }, [strategy?.toString()]);

  useEffect(() => {
    const { interval, unit } = strategy?.formattedInterval || {};
    if (interval && unit) setFormattedInterval(`${interval} ${unit}`);
  }, [strategy?.toString()]);

  // Breakpoints for responsiveness
  const { proprety: addGasText } = useMediaBreakpoints({
    [MediaScreens.LAPTOP]: "+",
    [MediaScreenSizes.ANY]: "Add Gas",
  });

  return (
    <InterModalSection
      height="h-[100%] tablet:h-[40%]"
      className="tablet:h-[45%] flex-col py-6 smallMobile:items-center  justify-start items-start gap-4 tablet:gap-2"
      width="w-[40%] tablet:w-max smallMobile:w-full"
    >
      <InfoSection title="Runs Every" className="tablet:hidden">
        {formattedInterval}
      </InfoSection>
      <InfoSection title="Gas Balance">
        <div className="flex flex-row gap-2 items-end">
          <WrappedText fontSize={20} className="tablet:text-[16px]">
            {usdGasBalance}
          </WrappedText>
          <WrappedText
            fontSize={12}
            className="text-opacity-40 mb-0.5 largeLaptop:hidden"
          >
            {gasBalance
              ? gasBalance + " " + strategy?.network?.nativeToken?.symbol
              : undefined}
          </WrappedText>
          {/* <WrappedText
            fontSize={12}
            className="text-opacity-40 mb-0.5 hidden smallLaptop:flex"
          >
            ~ 3 Days
          </WrappedText> */}
        </div>
      </InfoSection>
      <div className="flex flex-col gap-1">
        <RegulerButton className=" bg-custom-textColor hover:bg-custom-textColor laptop:pt-[0.5px] laptop:pb-[0.5px] smallLaptop:px-2 laptop:px-2 ">
          <WrappedText
            className=" text-custom-bg "
            fontStyle="bold"
            style={{
              fontSize: "16px",
              color: "var(--bg)",
            }}
          >
            {addGasText}
          </WrappedText>
        </RegulerButton>
        <WrappedText
          className="text-opacity-30 smallLaptop: hidden"
          fontSize={12}
        >
          Gas Finishes In 3 days
        </WrappedText>
      </div>
    </InterModalSection>
  );
};
