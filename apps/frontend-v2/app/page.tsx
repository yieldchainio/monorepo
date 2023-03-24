"use client";

import WrappedText from "components/wrappers/text";
import { ChangeEvent, useEffect, useState } from "react";
import WrappedInput from "components/wrappers/input";
import { Sticky } from "components/wrappers/sticky";
import { ChipsSection } from "components/chips-section";
import { Filter } from "components/filters";
import {
  FilterInstance,
  FilterTypes,
  OptionsFilter,
  StringFilter,
} from "utilities/hooks/general/useFilters/types";
import { YCNetwork, YCStrategy } from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import { StrategyCard } from "components/cards/strategy-card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  STRATEGIES_FILTERS,
  STRATEGIES_SEARCHBOX_INPUT_NAME,
} from "./constants";
import { BackdropColor } from "components/backdrop-color";
import { SlideShow } from "components/slideshow";

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

  // Return the component
  return (
    <>
      <div className="w-full h-full bg-custom-bg absolute text-custom-textColor flex flex-col z-0">
        <BackdropColor color="#3BC7F4" />
        <BrowseHeroSection
          filters={filters}
          strategies={strategies}
          setFilteredStrategies={setFilteredStrategies}
          setSelectedNetworks={setSelectedNetworks}
          networks={networks}
          setFilters={setFilters}
        />
        <div className="flex flex-col gap-[100px] mt-16">
          <StrategySlideshow
            strategies={filteredStrategies}
            title={"Verified Vaults"}
          />
          <StrategySlideshow
            strategies={filteredStrategies.filter(
              (strategy) => strategy.tvl > 30000
            )}
            title={"Trending Vaults"}
          />
        </div>
      </div>
    </>
  );
}

/**
 * The top hero section of the page
 */
interface BrowseSectionProps {
  filters: FilterInstance<any, any>[];
  setFilters: (filters: FilterInstance<any, any>[]) => void;
  strategies: YCStrategy[];
  setSelectedNetworks: (networks: YCNetwork[]) => void;
  networks: YCNetwork[];
  setFilteredStrategies: (filteredStrategies: YCStrategy[]) => void;
}
const BrowseHeroSection = ({
  filters,
  setFilters,
  strategies,
  setSelectedNetworks,
  networks,
  setFilteredStrategies,
}: BrowseSectionProps) => {
  return (
    <div className="flex flex-col gap-8 mt-[15vh] mx-auto items-center w-[100%] h-full">
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
        heightToFix={{ viewportHeight: 24 }}
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
  );
};

/**
 * A slideshow strategies section
 */

const StrategySlideshow = ({
  strategies,
  title,
}: {
  strategies: YCStrategy[];
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-4 pl-20 pr-12 w-full h-max z-10 ">
      <WrappedText fontSize={22}>{title}</WrappedText>
      <SlideShow
        slidesToShow={strategies.length < 6 ? strategies.length : 6}
        slidesPerRow={1}
        slidesToScroll={1}
        arrows={true}
        dots={true}
        dotsClass={"slick-dots slick-thumb"}
        className="items-center justify-center  gap-0"
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
        {strategies
          // .filter((strategy, i) => strategy.verified === true)
          .map((strategy, i, arr) => {
            return <StrategyCard strategy={strategy} key={i} />;
          })}
      </SlideShow>
    </div>
  );
};
