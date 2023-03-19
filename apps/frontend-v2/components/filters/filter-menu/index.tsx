/**
 * A dropdown menu for filters,
 * has different type of rows for different typeo of filters (booleans, ranges, options, etc)
 */

import DropdownMenu from "components/dropdown/menu";
import { ChangeEvent } from "react";
import {
  BaseFilter,
  FilterTypes,
} from "utilities/hooks/general/useFilters/types";
import Slider from "rc-slider";

import { FiltersMenuProps } from "../types";

export const FiltersMenu = <V, T extends BaseFilter<V>>({
  addFilter,
  modifyFilter,
  filters,
  parentRef,
  usedFilters,
}: FiltersMenuProps<V, T>) => {
  return (
    <DropdownMenu
      options={filters.map((filter) => {
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
                  console.log("the change event checked", e.target.checked);
                  e.target.checked ? addFilter(filter) : modifyFilter(filter);
                }}
              />
            ) : filter.type === FilterTypes.RANGE ? (
              <></>
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
      className="w-[400px] gap-0 left-[-320px]"
    />
  );
};
