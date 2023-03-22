/**
 * A dropdown menu for filters,
 * has different type of rows for different typeo of filters (booleans, ranges, options, etc)
 */

import DropdownMenu from "components/dropdown/menu";
import { ChangeEvent } from "react";
import {
  BaseFilter,
  FilterConfig,
  FilterTypes,
  isRangeFilter,
  RangeFilter,
} from "utilities/hooks/general/useFilters/types";
import { RangeSlider } from "components/slider";

import { FiltersMenuProps } from "../types";

const getDefaultRangeValues = <T extends BaseFilter<any>>(
  rangeFilter: FilterConfig<any, RangeFilter<any>> & RangeFilter<any>,
  usedFilters: FilterConfig<any, T>[]
): [number, number] => {
  const existingFilter = usedFilters.find(
    (_filter) => _filter.id == rangeFilter.id
  );

  if (!existingFilter) return [rangeFilter.bottom, rangeFilter.top];
  const filter = existingFilter as unknown as RangeFilter<any>;

  return [filter.bottom, filter.top];
};

export const FiltersMenu = <V, T extends BaseFilter<V>>({
  addFilter,
  modifyFilter,
  filters,
  parentRef,
  usedFilters,
}: FiltersMenuProps<V, T>) => {
  return (
    <DropdownMenu
      options={filters
        .filter((filter) => filter.hidden !== true)
        .map((filter) => {
          console.log("filter ser", filter);
          return {
            text: filter.name + ":",
            data: {
              filter: filter,
            },
            children: [
              filter.type === FilterTypes.BOOLEAN ? (
                <input
                  className="form-checkbox w-[15px] h-[15px] bg-custom-componentbg text-custom-componentbg focus:ring-0 focus:ring-offset-0 accent-gray-500 rounded-[4px]  ring-[0.5px] ring-custom-textColor ring-opacity-30 transition duration-200 ease-in-out"
                  type={"checkbox"}
                  defaultChecked={
                    !!usedFilters.find((_filter) => _filter.id === filter.id)
                  }
                  // When the box is checked/unchecked, we either
                  // add the filter or remove it, accordingly
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.target.checked ? addFilter(filter) : modifyFilter(filter);
                  }}
                />
              ) : filter.type === FilterTypes.RANGE && isRangeFilter(filter) ? (
                <RangeSlider
                  range={[filter.bottom, filter.top]}
                  defaultValues={getDefaultRangeValues(filter, usedFilters)}
                  onChange={(arg: number[]) => {
                    const newFilter = { ...filter };
                    newFilter.bottom = arg[0];
                    newFilter.top = arg[1];
                    modifyFilter(filter, newFilter);
                  }}
                />
              ) : null,
            ],
          };
        })}
      optionProps={{
        wrapperClassname:
          " bg-blue-900 justify-start hover:bg-opacity-[5%] hover:scale-[1] will-change-transform",
        textClassname: "text-[12px]",
        className: " gap-5 justify-between w-full",
      }}
      handler={() => null}
      parentRef={parentRef}
      className="w-[100%] translate-x-[-20%] will-change-transform"
    />
  );
};
