/**
 * Constants in the scope of the root "/" page
 */

import { YCStrategy } from "@yc/yc-models";
import {
  BooleanFilter,
  FilterInstance,
  FilterTypes,
  RangeFilter,
} from "utilities/hooks/general/useFilters/types";

// Filters for the strategies
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
  callback: (item: YCStrategy) => item.creator?.verified,
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

export const STRATEGIES_SEARCHBOX_INPUT_NAME = "strategies_searchbox_input";

export const STRATEGIES_FILTERS = [
  ONLY_VERIFIED_CREATORS,
  ONLY_VERIFIED_VAULTS,
  TVL_RANGE,
];
