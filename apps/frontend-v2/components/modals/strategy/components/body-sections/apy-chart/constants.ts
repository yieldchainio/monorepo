
/**
 * Milliseconds in a day (used in calcs)
 */
export const msPerDay = 24 * 60 * 60 * 1000;

/**
 * The timeframes for the chart
 */
export const APY_CHART_TIMEFRAMES: {
  label: string;
  daysBack: number | "all";
}[] = [
  {
    label: "ALL",
    daysBack: "all" as "all",
  },
  {
    label: "7D",
    daysBack: 7,
  },
  {
    label: "1M",
    daysBack: 30,
  },
  {
    label: "3M",
    daysBack: 90,
  },
  {
    label: "6M",
    daysBack: 183,
  },
  {
    label: "1Y",
    daysBack: 365,
  },
];
