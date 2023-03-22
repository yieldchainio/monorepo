import { useEffect, useId, useRef, useState } from "react";
import { useCustomEventListener } from "react-custom-events";
import { BaseEventData, EventTypes } from "types/events";
import { useFilters } from "utilities/hooks/general/useFilters";
import {
  BaseFilter,
  FilterConfig,
  UseFilterProps,
} from "utilities/hooks/general/useFilters/types";
import { FilterBox } from "./box";
import { FiltersMenu } from "./menu";

export interface FilterModification {}

/**
 * The main Filter component, renders our @uses FilterBox, @uses FilterMenu.
 * Responsible for sharing filter state
 */

export const Filter = <V, T extends BaseFilter<V>>({
  filters,
  setter,
  items,
  stringifier,
}: UseFilterProps<V, T>) => {
  // The used filters. We get a list of filters which the user
  // can choose from, add / remove as they wish
  const [usedFilters, setUsedFilters] = useState<Array<FilterConfig<V, T> & T>>(
    filters.filter((filter) => filter.defaultAdded === true)
  );

  useEffect(() => {
    const newArr = [...usedFilters];
    console.log("Old Filters ARR:", newArr);
    for (const filter of filters) {
      if (filter.defaultAdded) {
        const existingIndex = usedFilters.findIndex(
          (_filter) => _filter.id == filter.id
        );
        if (existingIndex == undefined) newArr.push(filter);
        else if (filter.loose) {
          newArr.splice(existingIndex, 1, filter);
        }
      }
    }
    console.log("New Filters ARR:", newArr);
    setUsedFilters(newArr);
  }, [filters]);

  /**
   * @uses useFilters() custom hook.
   * @notice there's no need for us to use the return value as we pass on a setter
   */
  useFilters<V, T>({
    items,
    filters: usedFilters,
    setter,
    stringifier,
  });

  // Track whether the dropdown is open or not
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // UUID for the menu logic
  const UUID = useId();

  useCustomEventListener<BaseEventData>(
    EventTypes.MENU_OPEN,
    (data: BaseEventData) => data.id !== UUID && setMenuOpen(false)
  );

  // Ref of the filter box, for the menu to be appended underneath it
  const boxRef = useRef<HTMLDivElement>(null);

  // Function to add a filter
  const addFilter = (filter: FilterConfig<V, T> & T) => {
    const newArr = [...usedFilters];
    newArr.push(filter);
    setUsedFilters(newArr);
  };

  // Function to modify/remove a filter
  const modifyFilter = (
    filter: FilterConfig<V, T> & T,
    newFilter?: FilterConfig<V, T> & T
  ) => {
    // Find the index of it within the array of used filters
    const existingIndex = usedFilters.findIndex(
      (_filter) => _filter.id == filter.id
    );

    // If it does not exist, we return
    if (existingIndex === undefined) return;

    // if it does, we check if the new filter is defined.
    // if it is, we splice the array at the index and insert the new filter.
    // otherwise, we just remove the filter

    // New array (to trigger re-render)
    const newArr = [...usedFilters];

    // if not new filter, remove
    if (!newFilter) newArr.splice(existingIndex, 1);
    // else, remove & append new filter
    else newArr.splice(existingIndex, 1, { ...newFilter });

    // set the new used filters array
    setUsedFilters(newArr);
  };

  // Return the components
  return (
    <div className="relative">
      <FilterBox
        filters={usedFilters.length}
        onClick={(e) => {
          setMenuOpen(!menuOpen);
        }}
        ref={boxRef}
        className={"bg-custom-bg border-custom-themedBorder"}
      />
      {menuOpen && (
        <FiltersMenu
          filters={filters}
          parentRef={boxRef}
          addFilter={addFilter}
          modifyFilter={modifyFilter}
          usedFilters={usedFilters}
        />
      )}
    </div>
  );
};
