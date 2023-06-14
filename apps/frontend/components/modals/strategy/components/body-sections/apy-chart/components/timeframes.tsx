/**
 * A component for filtering timeframes on the APY chart
 */

import { RegulerButton } from "components/buttons/reguler";
import WrappedText from "components/wrappers/text";
import { useMemo, useState } from "react";
import { useFilters } from "utilities/hooks/general/useFilters";
import {
  ChoiceFilter,
  FilterInstance,
  FilterTypes,
} from "utilities/hooks/general/useFilters/types";
import { msPerDay } from "../constants";

type Timeframe = {
  label: string;
  daysBack: number | `${"all"}`;
};
interface ChartTimeframesProps<T extends { timestamp: string }> {
  items: T[];
  setter: (arg: T[]) => any;
  timeframes: Timeframe[];
}
export const ChartTimeframes = <T extends { timestamp: string }>({
  items,
  setter,
  timeframes,
}: ChartTimeframesProps<T>) => {
  // Keeping track of the "days back" since now to the chosen timeframe
  const [daysBack, setDaysBack] = useState<number | "all">("all");

  // A memoized timeframe filter
  const timeframeFilter = useMemo(() => {
    return new FilterInstance<T, ChoiceFilter<T, number | "all">>({
      name: "TIMEFRAMES_FILTER",
      hidden: true,
      defaultAdded: true,
      loose: true,
      type: FilterTypes.CHOICE,
      callback: (item: T, config: ChoiceFilter<T, number | "all">) => {
        // If we chose "All" then there's no filtering
        if (config.choice == "all") return true;

        // Get the date of the timestamp
        const itemDate = new Date(item.timestamp);

        // Our desired date
        // TODO: When you add real data, update this to use date at time
        // TODO: Of watching chart. Here i used time of last timestamp for
        // TODO: The data to not fuck up when demoing
        const msPerDay = 24 * 60 * 60 * 1000;
        const desiredTime =
          new Date(items[items.length - 1].timestamp).getTime() -
          config.choice * msPerDay;

        // If it happened on/after the date which is the current date
        // minute the "daysBack", it is valid
        if (itemDate.getTime() >= desiredTime) {
          return true;
        }
      },
      choice: daysBack,
    });
  }, [daysBack]);

  // We filter the items and pass on the setter
  useFilters({
    items,
    filters: [timeframeFilter],
    setter: setter,
  });

  // Return the component
  return (
    <div className="flex flex-row px-2 py-1 gap-1.5 bg-transparent z-1000  ">
      {timeframes.map((timeframe, i) => {
        return (
          <RegulerButton
            onClick={() => setDaysBack(timeframe.daysBack)}
            className=" bg-opacity-10 "
            style={{
              padding: "0.35rem",
              borderRadius: "20%",
              minWidth: "28px",
              justifyContent: "center",
            }}
            key={i}
          >
            <WrappedText fontStyle="bold" fontSize={10} className="w-max ">
              {timeframe.label}
            </WrappedText>
          </RegulerButton>
        );
      })}
    </div>
  );
};
