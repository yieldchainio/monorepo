/**
 * Node reperesneting a Solana wallet
 */

import { InfoProvider } from "components/info-providers";
import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import Link from "next/link";
import { useMemo } from "react";
import { formatMoney } from "utilities/general/format-money";

export const TokenNodeComponent = ({
  symbol,
  logo,
  amount,
  style,
  address,
}: {
  symbol: string;
  logo: string;
  amount: number;
  address: string;
} & BaseComponentProps) => {
  /**
   * Memoize formattted amount
   */
  const formattedAmount = useMemo(() => {
    const amtTouse = symbol === "SOL" ? amount / 1000000000 : amount;

    const formatter = new Intl.NumberFormat("en-US", { notation: "compact" });

    const res = formatter.format(amtTouse);
    return res.slice(1, res.length);
  }, [amount]);
  // Return JSX
  return (
    <div
      className="w-[120px] h-[30px] py-1 px-3 bg-custom-bcomponentbg flex flex-col items-center justify-center gap-2 border-custom-border shadow-md rounded-large dark:bg-custom-componentbg"
      style={style}
    >
      <InfoProvider
        contents={
          <Link
            href={`https://xray.helius.xyz/token/${address}`}
            target="_blank"
          >
            <WrappedText
              fontStyle="bold"
              fontSize={12}
              className="text-opacity-100 hover:text-opacity-100 hover:underline transition duration-200 ease-in-out w-full h-full leading-none"
            >
              View On XRAY
            </WrappedText>
          </Link>
        }
        delay={200}
      >
        <div className="flex flex-row items-center gap-1">
          <WrappedText className="leading-none">{formattedAmount}</WrappedText>
          <div className="flex flex-row gap-1">
            <WrappedImage
              width={18}
              height={18}
              src={logo}
              className="rounded-full"
            />
          </div>
          <WrappedText fontSize={14} fontStyle="bold" className="leading-none">
            {symbol}
          </WrappedText>
        </div>
      </InfoProvider>
    </div>
  );
};
