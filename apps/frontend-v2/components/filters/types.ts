import { MouseEvent, RefObject } from "react";
import {
  FilterConfig,
  BaseFilter,
} from "utilities/hooks/general/useFilters/types";

export interface FilterBoxProps {
  filters: number;
  onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => any;
  className?: string;
}
export interface FiltersMenuProps<V, T extends BaseFilter<V>> {
  filters: FilterConfig<V, T>[];
  parentRef: RefObject<HTMLElement | undefined>;
  addFilter: (filter: FilterConfig<V, T>) => any;
  modifyFilter: (
    filter: FilterConfig<V, T>,
    newFilter?: FilterConfig<V, T>
  ) => any;
  usedFilters: FilterConfig<V, T>[];
}
