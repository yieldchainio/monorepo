"use client";

import WrappedText from "components/wrappers/text";
import { ChangeEvent } from "react";
import WrappedInput from "components/wrappers/input";
import { Sticky } from "components/wrappers/sticky";
import { NetworksChipsSection } from "components/networks-section";
import { Filter } from "components/filters";
import {
  BooleanFilter,
  FilterInstance,
  FilterTypes,
  RangeFilter,
} from "utilities/hooks/general/useFilters/types";
import { YCStrategy } from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import Slider from "rc-slider";

/**
 * Filters for the strategies
 */
const ONLY_VERIFIED_VAULTS: FilterInstance<
  YCStrategy,
  BooleanFilter<YCStrategy>
> = new FilterInstance<YCStrategy, BooleanFilter<YCStrategy>>({
  callback: (item: YCStrategy, bool: boolean) => item.verified,
  name: "Verified Vaults",
  type: FilterTypes.BOOLEAN,
});

const ONLY_VERIFIED_CREATORS: FilterInstance<
  YCStrategy,
  BooleanFilter<YCStrategy>
> = new FilterInstance<YCStrategy, BooleanFilter<YCStrategy>>({
  callback: (item: YCStrategy, bool: boolean) => item.creator?.isVerified,
  name: "Verified Creators",
  type: FilterTypes.BOOLEAN,
});

const TVL_RANGE: FilterInstance<
  YCStrategy,
  RangeFilter<YCStrategy>
> = new FilterInstance<YCStrategy, RangeFilter<YCStrategy>>({
  callback: (item: YCStrategy, bottom: number, top: number) =>
    item.tvl <= top && item.tvl >= bottom,
  name: "TVL Range",
  type: FilterTypes.RANGE,
});

const STRATEGIES_FILTERS = [
  ONLY_VERIFIED_CREATORS,
  ONLY_VERIFIED_VAULTS,
  TVL_RANGE,
];

export default function Home() {
  const strategies = useYCStore((state) => state.context.YCstrategies);
  return (
    <div className="w-full h-full bg-custom-bg absolute text-custom-textColor flex flex-col">
      <div
        className={
          "absolute w-[30vw] h-[30vh] blur-[200px] top-[20vh] left-[100%] bg-[#3BC7F4] dark:bg-[#FFF576]"
        }
      ></div>
      <div className="flex flex-col gap-8 mt-[15vh] mx-auto items-center w-full h-auto">
        <div className="flex flex-col items-center">
          <WrappedText fontSize={78} fontStyle="black">
            Browse
          </WrappedText>
          <WrappedText
            fontSize={20}
            fontStyle="reguler"
            className="text-opacity-40"
          >
            Browse, search for & earn from strategies
          </WrappedText>
        </div>
        <Sticky
          heightToFix={{ viewportHeight: 15 }}
          className="w-full items-center flex flex-col top-[10vh] gap-5"
        >
          <WrappedInput
            fontSize={16}
            fontStyle={"reguler"}
            onChange={(e: ChangeEvent) => null}
            className="w-full"
            placeholder="Search for a vault ID, token, or protocol name"
          />
          <div className=" w-full h-[100px] flex flex-row items-center justify-start">
            <NetworksChipsSection />
            <Filter
              filters={STRATEGIES_FILTERS}
              items={strategies}
              stringifier={(items) =>
                JSON.stringify(items.map((item) => item.toString()))
              }
            />
          </div>
        </Sticky>
      </div>
    </div>
  );
}
