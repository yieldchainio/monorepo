/**
 * The token section of the strategy card
 */

import { YCNetwork, YCToken } from "@yc/yc-models";

interface StrategyTokenSectionProps {
  token: YCToken | null;
  network: YCNetwork | null;
}

export const StrategyTokenSection = ({
  token,
  network,
}: StrategyTokenSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <StrategyTokenLogo logo={token?.logo} networkLogo={network?.logo} />
      <div className="flex flex-col gap-0 items-center justify-center">
        <WrappedText fontSize={21} fontStyle={"bold"}>
          {token?.symbol}
        </WrappedText>
        <WrappedText
          fontSize={13}
          fontStyle={"reguler"}
          fontColor={"custom-off"}
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
const StrategyTokenLogo = ({ logo, networkLogo }: StrategyTokenLogoProps) => {
  return (
    <div className="w-max h-max p-0.5 bg-gradient-to-r from-custom-yclb to-custom-ycly rounded-full flex">
      <div className="relative bg-red-500 left-[78%] top-[85%] w-max h-max">
        <div className="w-max h-max rounded-full absolute top-[-0.1rem]">
          <WrappedImage
            src={networkLogo}
            width={16}
            height={16}
            className="rounded-full shadow-md border-[0.01rem] border-custom-themedBorder"
          />
        </div>
      </div>
      <div className="w-max h-max bg-custom-componentbg rounded-full p-[0.3rem]">
        <div className="bg-custom-bcomponentbg w-max h-max rounded-full p-1">
          <WrappedImage
            src={logo}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
