/**
 * The token section of the strategy card
 */

import { YCNetwork, YCToken } from "@yc/yc-models";

interface StrategyTokenSectionProps {
  token?: YCToken | null;
  network?: YCNetwork | null;
}

export const StrategyTokenSection = ({
  token,
  network,
}: StrategyTokenSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 mobile:gap-2">
      <StrategyTokenLogo logo={token?.logo} networkLogo={network?.logo} />
      <div className="flex flex-col gap-0 items-center justify-center">
        <WrappedText
          fontSize={21}
          fontStyle={"bold"}
          className="mobile:hidden "
        >
          {token?.symbol}
        </WrappedText>
        <WrappedText
          fontSize={13}
          fontStyle={"reguler"}
          fontColor={"custom-off"}
          className="smallLaptop:hidden"
        >
          {network?.name}
        </WrappedText>
      </div>
    </div>
  );
};

/**
 * A token logo wrapper for the strategy card
 */

import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";

interface StrategyTokenLogoProps {
  logo?: string | null;
  networkLogo?: string | null;
}
function StrategyTokenLogo({ logo, networkLogo }: StrategyTokenLogoProps) {
  return (
    <div className="w-max h-max p-0.5 bg-gradient-to-r from-custom-yclb to-custom-ycy rounded-full flex">
      <div className="relative bg-red-500 left-[78%] top-[15%] w-max h-max">
        <div className="w-max h-max rounded-full absolute top-[2.6rem]">
          <WrappedImage
            src={networkLogo}
            width={22}
            height={22}
            className="rounded-full border-[0.3rem] border-custom-bcomponentbg"
          />
        </div>
      </div>
      <div className="w-max h-max bg-custom-bcomponentbg rounded-full p-[0.3rem]">
        <div className="bg-custom-bcomponentbg w-max h-max rounded-full p-1">
          <WrappedImage
            src={logo}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
