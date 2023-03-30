/**
 * A component for a strategy's vault card.
 */

import { YCStrategy } from "@yc/yc-models";
import Section from "components/section";
import { SmallVerified } from "components/verified/circle";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { formatMoney } from "utilities/general/format-money";
import { filterDupes } from "utilities/general/remove-dupes";
import { sliceAddress } from "utilities/general/slice-address";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { StrategyTokenSection } from "./token-section";
import GradientButton from "components/buttons/gradient";
import { useRouter } from "next/navigation";

interface StrategyCardProps {
  strategy: YCStrategy;
}

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  // The user that created the strategy
  const { address, userName, profilePic, socialMedia, verified } = useYCUser({
    userAddress: strategy.creator?.address as `0x${string}`,
  });

  // Modal provider
  const router = useRouter();
  const routeToStrategy = () => {
    router.push(`/strategy/${strategy.id}`);
  };

  return (
    <div className="w-max h-max bg-custom-bcomponentbg rounded-[2rem] flex flex-col items-center justify-start border-[1px] border-custom-themedBorder shadow-sm">
      {verified && <SmallVerified />}
      <div className="bg-gradient-to-r from-custom-yclb/10 to-custom-ycy/10 w-full h-[30%] rounded-t-[2rem] flex flex-row gap-5 pl-4 pr-5 py-4 mobile:py-2.5">
        <div className="flex flex-row items-center w-full justify-between px-1 gap-4 mobile:justify-start mobile:gap-4 smallLaptop:gap-12">
          <div className="flex flex-row items-center gap-1.5">
            <WrappedImage
              src={profilePic}
              width={38}
              height={38}
              className="rounded-full border-[2px] border-custom-border"
            />
            <div className="flex flex-col w-[100%] mt-0.5">
              <WrappedText className="mobile:hidden">{userName}</WrappedText>
              <WrappedText
                fontColor="custom-off cursor-pointer hover:text-custom-offhover transition duration-200 ease-in-out mt-[-3px] laptop:hidden overflow-hidden truncate "
                fontSize={10}
              >
                {(socialMedia.twitter && socialMedia.twitter.handle) ||
                  (address && sliceAddress(address))}
              </WrappedText>
            </div>
          </div>
          <WrappedText fontStyle="medium" fontSize={16} className="">
            APY: 200%
          </WrappedText>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start w-full h-full py-6 px-6 gap-1">
        <StrategyTokenSection
          token={strategy.depositToken}
          network={strategy.network}
        />
        <div className="gap-0 w-full flex flex-col justify-center items-center">
          <Section
            fields={{
              "TVL ": formatMoney(
                strategy.depositToken?.formatDecimals(strategy.tvl) || 0
              ),
              Title: strategy.title,
              Created: "5 Days Ago",
              Protocols: (
                <div className="flex flex-row items-center  gap-[0.05rem]">
                  <div className="flex flex-row items-center justify-center pl-[20px]">
                    {filterDupes(strategy.steps).map((step, i, arr) => {
                      return i <= 1 ? (
                        <WrappedImage
                          src={step.protocol.logo}
                          width={22}
                          height={22}
                          className="rounded-full ml-[-6px] border-[2px] border-custom-bcomponentbg"
                          style={{
                            zIndex: arr.length - i,
                          }}
                          key={i}
                        />
                      ) : null;
                    })}
                  </div>
                  {filterDupes(strategy.steps).length > 2 ? (
                    <WrappedText fontSize={14}>
                      {"+" +
                        (filterDupes(strategy.steps).length - 2).toString()}
                    </WrappedText>
                  ) : null}
                </div>
              ),
            }}
            showLines={true}
            fontSize={12}
            sectionsClassname={"gap-3 mb-0 justify-start "}
            titlesClassname={"text-opacity-25"}
            divisorClassname=" mb-[0.5rem] mt-[0.5rem]"
          ></Section>
          <GradientButton
            className="mt-4 rounded-[0.9rem] pl-[6rem] pr-[6rem] pt-[0.5rem] pb-[0.5rem] ml-[0px] max-w-[100px] "
            onClick={() => {
              routeToStrategy();
            }}
            style={{
              maxWidth: "200px"
            }}
          >
            <WrappedText
              fontSize={14}
              fontColor={"inherit"}
              fontStyle={"bold"}
              className="text-elipsis overflow-visible"
              style={{
                textOverflow: "visible",
              }}
            >
              Enter Vault
            </WrappedText>
          </GradientButton>
        </div>
      </div>
    </div>
  );
};