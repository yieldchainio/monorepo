import { useEffect, useState } from "react";
import { BaseFilter, UseFilterProps } from "./types";
import { safeToJSON } from "@yc/yc-models";

/**
 * A custom hook for using filters,
 * accepts two parameters:
 *
 * @param items - The initial array of items to filter
 * @param filters - @uses FilterConfig, has a callback function responsiblel for the filtering,
 * as well as a type (@uses FilterTypes )
 * @param setter - Optional. A setter function to use each time we re-filter the array, with the result.
 */

export const useFilters = <V, T extends BaseFilter<V>>({
  items,
  filters,
  setter,
  stringifier = (_items: V[]) =>
    JSON.stringify(
      _items.map((_item) =>
        JSON.stringify(_item, (key, value) => {
          return typeof value === "bigint" ? value.toString() : value;
        })
      ),
      (key, value) => {
        return typeof value === "bigint" ? value.toString() : value;
      }
    ),
}: UseFilterProps<V, T>) => {
  // A state for the filtered array
  const [filteredItems, setFilteredItems] = useState<V[]>([]);

  // a useEffect that runs each time either the items, filters or setter changes.
  // Responsible for filtering the array of items using the callback, setting our state
  // and (if provided) setting it through the setter as well
  useEffect(() => {
    console.log("Change!!!!! Filters: ", safeToJSON(filters));
    // Init the new array
    let newArr = [...items];

    // Filter the array through an iteration on each one of the callbacks
    for (const filter of filters) {
      // Invoke the filter's callback
      newArr = newArr.filter((item) => filter.callback(item, filter));
    }

    // Finally, set the states
    setFilteredItems(newArr);
    if (setter) setter(newArr);

    // We stringify them all so that we actually detect a change in them
  }, [
    stringifier(items),
    JSON.stringify(filters.map((filter) => JSON.stringify(safeToJSON(filter)))),
    JSON.stringify(setter),
  ]);

  // Return our filtlered items
  return filteredItems;
};
