"use client";

import WrappedText from "components/wrappers/text";
import { ChangeEvent, useEffect, useState } from "react";
import WrappedInput from "components/wrappers/input";
import { Sticky } from "components/wrappers/sticky";
import { ChipsSection } from "components/chips-section";
import { Filter } from "components/filters";
import {
  BooleanFilter,
  FilterInstance,
  FilterTypes,
  OptionsFilter,
  RangeFilter,
  StringFilter,
} from "utilities/hooks/general/useFilters/types";
import { YCNetwork, YCStrategy } from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import { StrategyCard } from "components/cards/strategy-card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * Static filters for the strategies
 */
const ONLY_VERIFIED_VAULTS: FilterInstance<
  YCStrategy,
  BooleanFilter<YCStrategy>
> = new FilterInstance<YCStrategy, BooleanFilter<YCStrategy>>({
  callback: (item: YCStrategy) => item.verified,
  name: "Verified Vaults",
  type: FilterTypes.BOOLEAN,
});

const ONLY_VERIFIED_CREATORS: FilterInstance<
  YCStrategy,
  BooleanFilter<YCStrategy>
> = new FilterInstance<YCStrategy, BooleanFilter<YCStrategy>>({
  callback: (item: YCStrategy) => item.creator?.isVerified,
  name: "Verified Creators",
  type: FilterTypes.BOOLEAN,
});

const TVL_RANGE: FilterInstance<
  YCStrategy,
  RangeFilter<YCStrategy>
> = new FilterInstance<YCStrategy, RangeFilter<YCStrategy>>({
  callback: (item: YCStrategy, config: RangeFilter<YCStrategy>) =>
    item.tvl <= config.top && item.tvl >= config.bottom,
  id: "tvl_range",
  name: "TVL Range",
  type: FilterTypes.RANGE,
  top: 1000000,
  bottom: 0,
  defaultAdded: true,
});

const STRATEGIES_SEARCHBOX_INPUT_NAME = "strategies_searchbox_input";

const STRATEGIES_FILTERS = [
  ONLY_VERIFIED_CREATORS,
  ONLY_VERIFIED_VAULTS,
  TVL_RANGE,
];

export default function Home() {
  // Retreive the strategies from the context
  const strategies = useYCStore((state) => state.context.YCstrategies);

  // Retreive the networks to spread into the chips section, for filtering
  const networks = useYCStore((state) => state.context.YCnetworks);

  // A state for the filtered strategies
  const [filteredStrategies, setFilteredStrategies] = useState<YCStrategy[]>(
    []
  );

  // All of the filters - the static ones and the dynamic ones
  const [filters, setFilters] =
    useState<FilterInstance<any, any>[]>(STRATEGIES_FILTERS);

  // Keeping track of selected networks for filtering (not in dropdown)
  const [selectedNetworks, setSelectedNetworks] =
    useState<YCNetwork[]>(networks);

  // useEffect updating the filters when the selected networks are update
  useEffect(() => {
    const newArr = [...filters].filter(
      (filter) => filter.id !== "dashboard_selected_networks"
    );
    newArr.push(
      new FilterInstance<YCStrategy, OptionsFilter<YCStrategy, YCNetwork>>({
        id: "dashboard_selected_networks",
        name: "dashboard_selected_networks",
        hidden: true,
        defaultAdded: true,
        loose: true,
        type: FilterTypes.OPTIONS,
        callback: (item: YCStrategy, config: OptionsFilter<YCStrategy>) =>
          config.selectedOptions.find(
            (network: YCNetwork) => network.chainid == item.network?.chainid
          ),
        selectedOptions: selectedNetworks,
      })
    );
    setFilters(newArr);
  }, [selectedNetworks]);
  return (
    <div className="w-full h-full bg-custom-bg absolute text-custom-textColor flex flex-col z-0">
      <div
        className={
          "absolute w-[100vw] h-[50vh] blur-[200px] top-[12vh] left-[100%] bg-[#3BC7F4] dark:bg-[#FFF576] z-0"
        }
      ></div>
      <div className="flex flex-col gap-8 mt-[15vh] mx-auto items-center w-[100%] h-full bg-red-500">
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
          className="w-full items-center flex flex-col top-[10vh] gap-5 z-20"
        >
          <WrappedInput
            fontSize={16}
            fontStyle={"reguler"}
            // We add a filter onchange to filter by the input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newArr = [...filters].filter(
                (filter: FilterInstance<any, any>) =>
                  filter.id !== STRATEGIES_SEARCHBOX_INPUT_NAME
              );
              newArr.push(
                new FilterInstance<YCStrategy, StringFilter<YCStrategy>>({
                  id: STRATEGIES_SEARCHBOX_INPUT_NAME,
                  type: FilterTypes.STRING,
                  name: STRATEGIES_SEARCHBOX_INPUT_NAME,
                  hidden: true,
                  input: e.target.value,
                  defaultAdded: true,
                  loose: true,
                  callback: (
                    item: YCStrategy,
                    config: StringFilter<YCStrategy>
                  ) => {
                    const lowerCasedInput = config.input.toLowerCase();
                    return (
                      item.address.toLowerCase().includes(lowerCasedInput) ||
                      item.creator?.username
                        .toLowerCase()
                        .includes(lowerCasedInput) ||
                      item.title.toLowerCase().includes(lowerCasedInput) ||
                      item.depositToken?.symbol
                        .toLowerCase()
                        .includes(lowerCasedInput) ||
                      item.depositToken?.name
                        .toLowerCase()
                        .includes(lowerCasedInput)
                    );
                  },
                })
              );
              setFilters(newArr);
            }}
            className="w-full"
            placeholder="Search for a vault ID, token, or protocol name"
          />
          <div className="w-[70%] h-max flex flex-row items-center justify-between z-1 ">
            <div className="">
              <ChipsSection<YCNetwork>
                setter={setSelectedNetworks}
                items={networks}
              />
            </div>
            <div className="">
              <Filter
                filters={filters}
                items={strategies}
                stringifier={(items) =>
                  JSON.stringify(items.map((item) => item.toString()))
                }
                setter={setFilteredStrategies}
              />
            </div>
          </div>
        </Sticky>
      </div>
      <div className="flex flex-col gap-4 pl-20 pr-12 w-full h-max z-10 ">
        <WrappedText fontSize={22}>Verified Vaults</WrappedText>
        <Slider
          slidesToShow={
            filteredStrategies.length < 6 ? filteredStrategies.length : 6
          }
          slidesPerRow={1}
          slidesToScroll={1}
          arrows={true}
          dots={true}
          customPaging={function (i) {
            if (i % 2 === 0)
              return (
                <div
                  className="w-[20px] h-[6px] mt-10"
                  style={{
                    backgroundColor: "rgba(255,255,255)",
                  }}
                ></div>
              );
            else return <></>;
          }}
          dotsClass={"slick-dots slick-thumb"}
          nextArrow={<CustomArrow />}
          className="items-center justify-center"
          responsive={[
            {
              breakpoint: 1760,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 1183,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 890,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true,
              },
            },
          ]}
        >
          {filteredStrategies.map((strategy, i) => {
            return <StrategyCard strategy={strategy} key={i} />;
          })}
        </Slider>

        {/* <div className="flex flex-row w-full h-full gap-7 justify-start px-5 pt-16"></div> */}
      </div>
    </div>
  );
}

const CustomArrow = (props: any) => {
  const { className, style, onClick } = props;
  return <div className={className} style={style} onClick={onClick} />;
};
