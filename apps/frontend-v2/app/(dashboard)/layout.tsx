"use client";
import "../../css/globals.css";
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
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { StrategyCard } from "components/cards/strategy";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  STRATEGIES_FILTERS,
  STRATEGIES_SEARCHBOX_INPUT_NAME,
} from "../constants";
import { BackdropColor } from "components/backdrop-color";
import { SlideShow } from "components/slideshow";

import { useModals } from "utilities/hooks/stores/modal";
import { StrategyModal } from "components/strategy-modal";
import { useShallowRouter } from "utilities/hooks/general/useShallowRouter";

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

  /**
   * Use the ``useShallowRouter`` hook in order to mimic routing
   * for strategies' pages.
   * // TODO: Fucking make that shit work in its own dynamic path.
   * // TODO: IT shouldnt be here. This is an unfortunate last resort
   */

  // The modals state for us to push into
  const modals = useModals();

  useShallowRouter((pathname: string) => {
    // Return immediatly if the pathname does not include the word strategy
    if (!pathname.includes("strategy")) return;

    // Get the ID
    const stratID = pathname.split("/strategy")[1];

    // Push a strategy modal into the root if it does not exist already
    if (stratID && !modals.exists(stratID))
      modals.push((modalKey: number) => {
        return {
          id: stratID,
          activeOn: [`/${stratID}`],
          component: (
            <StrategyModal
              strategyID={stratID.split("/")[1]}
              modalKey={modalKey}
              callbackRoute={"/"}
            ></StrategyModal>
          ),
        };
      });
  });

  // Return the component
  return (
    <>
      <div className="w-full h-full bg-custom-bg absolute text-custom-textColor flex flex-col z-0">
        <BackdropColor color="#3BC7F4" />
        <BackdropColor
          color="#FE0d"
          top={"top-[70vh]"}
          left={"left-[-110%]"}
          className="bg-opacity-10"
        />
        <BackdropColor
          color="#2EE1F0"
          top={"top-[220vh]"}
          left={"left-[10%]"}
          className="bg-opacity-10"
          blur="blur-[400px]"
        />
        <BrowseHeroSection
          filters={filters}
          strategies={strategies}
          setFilteredStrategies={setFilteredStrategies}
          setSelectedNetworks={setSelectedNetworks}
          networks={networks}
          setFilters={setFilters}
        />
        <div className="flex flex-col gap-[300px] mt-16 items-start pb-12">
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
          <StrategiesGrid
            strategies={filteredStrategies.filter(
              (strategy) => strategy.tvl > 30000
            )}
            title={"All Vaults"}
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
    <div className="flex flex-col gap-8 mt-[15vh] mx-auto items-center w-[100%] h-full ">
      <div className="flex flex-col items-center">
        <WrappedText fontSize={72} fontStyle="black">
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
                      .includes(lowerCasedInput) ||
                    item.rawSteps
                      .map((step) => step.protocol_details)
                      .find((protocol) =>
                        protocol.name.toLowerCase().includes(lowerCasedInput)
                      )
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
    <div className="flex flex-col gap-4 pl-0 w-full h-max z-10 ">
      <div className=" flex flex-row items-center justify-center">
        <WrappedText fontSize={22} className="">
          {title}
        </WrappedText>
      </div>
      <SlideShow
        slidesToShow={strategies.length < 4 ? strategies.length : 4}
        slidesPerRow={1}
        slidesToScroll={1}
        arrows={true}
        dots={true}
        className="items-center justify-center  gap-0"
        responsive={[
          {
            breakpoint: 1760,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 1183,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
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
          {
            breakpoint: 720,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
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

/**
 * A grid  section for the strategy cards
 */

const StrategiesGrid = ({
  strategies,
  title,
}: {
  strategies: YCStrategy[];
  title: string;
}) => {
  return (
    <div className="w-full h-max flex flex-col items-center justify-center z-1 gap-6">
      <div className=" flex flex-row items-center justify-center">
        <WrappedText fontSize={22} className="">
          {title}
        </WrappedText>
      </div>
      <div className="grid grid-cols-4 gap-32  laptop:grid-cols-3 mobile:grid-cols-1 tablet:grid-cols-2">
        {strategies
          // .filter((strategy, i) => strategy.verified === true)
          .map((strategy, i, arr) => {
            return <StrategyCard strategy={strategy} key={i} />;
          })}
      </div>
    </div>
  );
};
