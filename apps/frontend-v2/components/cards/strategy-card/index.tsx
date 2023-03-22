/**
 * A component for a strategy's vault card.
 */

import { YCStrategy } from "@yc/yc-models";
import Section from "components/section";
import { SmallVerified } from "components/verified/circle";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { formatMoney } from "utilities/general/format-money";
import { sliceAddress } from "utilities/general/slice-address";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { StrategyTokenSection } from "./token-section";

export interface StrategyCardProps {
  strategy: YCStrategy;
}

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  // The user that created the strategy
  const { address, userName, profilePic, socialMedia, verified } = useYCUser({
    userAddress: strategy.creator?.address as `0x${string}`,
  });
  return (
    <div className="w-max h-[350px] bg-custom-bcomponentbg rounded-3xl flex flex-col items-center justify-start">
      {verified && <SmallVerified />}
      <div className="bg-gradient-to-r from-custom-yclb/10 to-custom-ycy/10 w-full h-[22%] rounded-t-3xl flex flex-row gap-5 pl-4 pr-5">
        <div className="flex flex-row items-center w-full justify-between px-1 gap-5">
          <div className="flex flex-row items-center gap-1.5">
            <WrappedImage
              src={profilePic}
              width={38}
              height={38}
              className="rounded-full border-2 border-custom-border"
            />
            <div className="flex flex-col w-[50%] mt-0.5">
              <WrappedText>{userName}</WrappedText>
              <WrappedText
                fontColor="custom-off cursor-pointer hover:text-custom-offhover transition duration-200 ease-in-out mt-[-3px]"
                fontSize={10}
              >
                {(socialMedia.twitter && socialMedia.twitter) ||
                  (address && sliceAddress(address))}
              </WrappedText>
            </div>
          </div>
          <WrappedText fontStyle="medium" fontSize={16} className="">
            APY: 200%
          </WrappedText>
        </div>
      </div>
      <div className="flex flex-col items-center justify-startw-full h-full py-6 w-full px-6 gap-4">
        <StrategyTokenSection
          token={strategy.depositToken}
          network={strategy.network}
        />
        <Section
          fields={{
            "Total Value Locked": formatMoney(strategy.tvl),
            Title: strategy.title,
          }}
          showLines={false}
          fontSize={12}
        ></Section>
      </div>
    </div>
  );
};
