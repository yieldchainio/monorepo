import { BaseComponentProps } from "components/types";
import { MouseEvent, RefObject } from "react";
import {
  FilterConfig,
  BaseFilter,
} from "utilities/hooks/general/useFilters/types";

export interface FilterBoxProps extends BaseComponentProps {
  filters: number;
}
export interface FiltersMenuProps<V, T extends BaseFilter<V>>
  extends BaseComponentProps {
  filters: Array<FilterConfig<V, T> & T>;
  parentRef: RefObject<HTMLElement | undefined>;
  addFilter: (filter: FilterConfig<V, T> & T) => any;
  modifyFilter: (
    filter: FilterConfig<V, T> & T,
    newFilter?: FilterConfig<V, T> & T
  ) => any;
  usedFilters: FilterConfig<V, T>[];
}
