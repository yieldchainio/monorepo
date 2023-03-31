/**
 * A chart showcasing a strategy's APY (Annual Percentage Yield) over time.
 */

import { InterModalSection } from "../../general/modal-section";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { YCStrategy } from "@yc/yc-models";
import "../../../../../css/globals.css";
import { Themes, useTheme } from "utilities/hooks/stores/theme";
import { useEffect, useState } from "react";

export const ApyChart = ({ strategy }: { strategy?: YCStrategy }) => {
  console.log("Statistics", strategy?.statistics);
  const { theme } = useTheme();
  const [chartColor, setChartColor] = useState(
    theme == Themes.DARK ? "#ffffff" : "#000000"
  );
  useEffect(() => {
    setChartColor(theme == Themes.DARK ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <InterModalSection height="h-[30%]" paddingX="px-0" className="pt-6 pb-0">
      <ResponsiveContainer width="150%" height="100%" className="mt-1">
        <AreaChart data={strategy?.statistics}>
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
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </InterModalSection>
  );
};
