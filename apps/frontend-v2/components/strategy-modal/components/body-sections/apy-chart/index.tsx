/**
 * A chart showcasing a strategy's APY (Annual Percentage Yield) over time.
 */

import { InterModalSection } from "../../general/modal-section";
import {
  ResponsiveContainer,
  AreaChart,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { YCStrategy } from "@yc/yc-models";
import "../../../../../css/globals.css";
import { Themes, useTheme } from "utilities/hooks/stores/theme";
import { useEffect, useState } from "react";
import WrappedText from "components/wrappers/text";
import { YCStatistic } from "@yc/yc-models/src/core/strategy/statistic";
import { format } from "date-fns";

import { ChartTimeframes } from "./components/timeframes";
import { APY_CHART_TIMEFRAMES } from "./constants";

export const ApyChart = ({ strategy }: { strategy?: YCStrategy }) => {
  // We use the theme state manually here due to the retardedness of this lib
  const { theme } = useTheme();

  // State for the color
  const [chartColor, setChartColor] = useState(
    theme == Themes.DARK ? "#ffffff" : "#000000"
  );

  // Reset the color state based on theme
  useEffect(() => {
    setChartColor(theme == Themes.DARK ? "#ffffff" : "#000000");
  }, [theme]);

  /**
   * We filter the APY chart based on timeframes.
   * The state is saved as days since the current moment.
   * So if u wanted to see 1 month APY performance, it would be saved as 30 days.
   *
   * If you wanted to see 1 day apy performance, it would be saved as 0.07 or smth like that
   */
  const [filteredStatistics, setFilteredStatistics] = useState(
    strategy?.statistics
  );

  return (
    <InterModalSection
      height="h-[30%]"
      paddingX="px-0"
      className="pb-0 overflow-hidden"
    >
      <div className="w-full h-full pt-2 rounded-xl flex flex-col items-end">
        <ChartTimeframes
          timeframes={APY_CHART_TIMEFRAMES}
          items={strategy?.statistics || []}
          setter={setFilteredStatistics}
        />
        <ResponsiveContainer width="100%" height="100%" className="mt-1">
          <AreaChart data={filteredStatistics}>
            <defs>
              <linearGradient id="color" x1={0} x2={0} y1={1} y2={1}>
                <stop
                  offset={"0%"}
                  stopColor={chartColor}
                  stopOpacity={0.4}
                ></stop>
                <stop
                  offset={"75%"}
                  stopColor={chartColor}
                  stopOpacity={0.07}
                ></stop>
              </linearGradient>
            </defs>
            <Area dataKey="apy" stroke={chartColor} fill="url(#color)"></Area>
            <YAxis
              dataKey="apy"
              axisLine={false}
              tickLine={false}
              tickCount={6}
              tickFormatter={(apy: number) => `${apy}%`}
              tick={{ fontSize: "10px" }}
            />
            <CartesianGrid opacity={0.1} vertical={false} />
            <Tooltip
              content={
                <CustomTooltip<YCStatistic[]> data={filteredStatistics} />
              }
              wrapperStyle={{ outline: "none" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* <div className="relative flex flex-row justify-end">
        <ChartTimeframes
          timeframes={APY_CHART_TIMEFRAMES}
          items={strategy?.statistics || []}
          setter={setFilteredStatistics}
        />
      </div> */}
    </InterModalSection>
  );
};

/**
 * A custom tooltip wrapper for the chart
 */

const CustomTooltip = <T extends any[]>({
  payload,
  label,
  active,
  data,
}: {
  payload?: T;
  label?: number;
  active?: boolean;
  data?: T;
}) => {
  // If it's not currently active return null so that it is not visible
  if (!active || !payload || label == undefined || !data) return null;

  return (
    <div className="flex flex-col bg-custom-componentbg shadow-md px-3 py-1.5 z-[100000] w-max h-max rounded-xl border-1 border-custom-border outline-none ">
      <WrappedText>{"APY: " + `${payload[0].value}%`}</WrappedText>
      <WrappedText fontSize={10}>
        {format(new Date(data[label].timestamp), "MMM do")}
      </WrappedText>
    </div>
  );
};
