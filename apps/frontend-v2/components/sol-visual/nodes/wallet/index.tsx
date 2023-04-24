/**
 * Node reperesneting a Solana wallet
 */

import { InfoProvider } from "components/info-providers";
import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import Link from "next/link";
import { useMemo } from "react";
import { sliceAddress } from "utilities/general/slice-address";

export const WalletNodeComponent = ({
  solanaAddress,
  style,
}: { solanaAddress: string } & BaseComponentProps) => {
  /**
   * Memoize the sliced address
   */
  const slicedAddress: string = useMemo(
    () => sliceAddress(solanaAddress),
    [solanaAddress]
  );

  // Return JSX
  return (
    <div
      className="w-[220px] h-[70px] py-3 px-6 bg-custom-bcomponentbg flex flex-row items-center justify-start gap-5 border-custom-border shadow-md rounded-large dark:bg-custom-componentbg"
      style={style}
    >
      <WrappedImage
        width={20}
        height={20}
        src={{
          dark: "/icons/wallet-light.svg",
          light: "/icons/wallet-dark.svg",
        }}
      />
      <InfoProvider
        contents={`View Wallet On Xray`}
        className="shadow-3xl"
        delay={200}
      >
        <Link
          href={`https://xray.helius.xyz/account/${solanaAddress}`}
          target={"_blank"}
        >
          <WrappedText
            fontSize={16}
            fontStyle="bold"
            className="text-opacity-100 hover:text-opacity-100 hover:underline transition duration-200 ease-in-out w-full h-full "
          >
            {slicedAddress}
          </WrappedText>
        </Link>
      </InfoProvider>
    </div>
  );
};
