/**
 * A component for the info box of a strategy modal that shows the TVL & user's deposits
 */

import { YCStrategy, YCToken } from "@yc/yc-models";
import Divisor from "components/general/divisor-line";
import WrappedText from "components/wrappers/text";
import { useCallback, useEffect, useState } from "react";
import { formatMoney } from "utilities/general/format-money";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { InfoSection } from "../../general/info-section";
import { InterModalSection } from "../../general/modal-section";

export const ValueLocked = ({ strategy }: { strategy?: YCStrategy }) => {
  // We keep track of these values for the TVL, deposits
  const [tvl, setTvl] = useState<string | undefined>();
  const [usdTVL, setUSDTVL] = useState<string | undefined>();
  const [userDeposit, setUserDeposit] = useState<string>("0");
  const [userUSDDeposit, setUserUSDDeposit] = useState<string | undefined>(
    "$0"
  );

  // Get the address of the current user
  const { address } = useYCUser();

  // A useEffect responsible for quoting the USD value of the TVL, and setting
  // it's state (formatted)
  useEffect(() => {
    (async () => {
      if (strategy) {
        try {
          // Get the TVL and it's USD value
          const { tvl, usdTVL } = await strategy.tvlAndUSDValue();
          setTvl(
            formatMoney(strategy.depositToken?.formatDecimals(tvl) || 0).split(
              "$"
            )[1]
          );
          setUSDTVL(formatMoney(usdTVL));
        } catch (e: any) {
          setTvl("0");
          setUSDTVL("$0");
        }

        if (address && address !== "0x0") {
          // Get the user's shares and USD value of them
          const { shares, usdValue } = await strategy.userUSDAndRawShares(
            address
          );
          setUserDeposit(
            formatMoney(
              strategy.depositToken?.formatDecimals(shares) || 0
            ).split("$")[1]
          );
          setUserUSDDeposit(formatMoney(usdValue));
        }
      }
    })();
  }, [strategy?.toString(), address]);

  return (
    <InterModalSection
      height="h-[55%] flex-row items-center justify-between tablet:h-max tablet:py-3 tablet:flex-col  "
      width={
        "w-[55%] tablet:w-[100%] tablet:px-10 tablet:gap-0 tablet:py-5"
      }
      className="overflow-hidden"
    >
      <InfoSection title="TVL">
        <div className="flex flex-row gap-2 items-end">
          <WrappedText fontSize={20} className="smallLaptop:text-[16px]">
            {tvl ? tvl + " " + strategy?.depositToken?.symbol : undefined}
          </WrappedText>
          <WrappedText
            fontSize={12}
            className="text-opacity-40 mb-0.5 largeLaptop:hidden"
          >
            {usdTVL}
          </WrappedText>
        </div>
      </InfoSection>
      <Divisor
        className="rotate-90 w-[23%] border-custom-textColor tablet:rotate-0"
        style={{
          borderColor: "rgba(var(--text), 0.1)",
          width: "18%",
        }}
      />
      <InfoSection title="Your Deposits">
        <div className="flex flex-row gap-2 items-end">
          <WrappedText fontSize={20} className="smallLaptop:text-[16px]">
            {userDeposit && tvl
              ? userDeposit + " " + strategy?.depositToken?.symbol
              : undefined}
          </WrappedText>
          <WrappedText
            fontSize={12}
            className="text-opacity-40 mb-0.5 largeLaptop:hidden"
          >
            {userUSDDeposit}
          </WrappedText>
        </div>
      </InfoSection>
    </InterModalSection>
  );
};
