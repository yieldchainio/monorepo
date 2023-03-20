import { v4 as uuidv4 } from "uuid";
// Types of filters (For easy indexing)
export enum FilterTypes {
  BOOLEAN,
  RANGE,
  OPTIONS,
  STRING,
}

// The base filter (has a type + callback)
export interface BaseFilter<T> {
  type: FilterTypes;
  callback: (item: T, ...args: any) => any;
}

// A boolean filter (on/off)
export interface BooleanFilter<T> extends BaseFilter<T> {
  type: FilterTypes.BOOLEAN;
  callback: (item: T, config: BooleanFilter<T>) => any;
}

// A range filter (i.e 10,000 to 15,000)
export interface RangeFilter<T> extends BaseFilter<T> {
  type: FilterTypes.RANGE;
  callback: (item: T, config: RangeFilter<T>) => any;
  top: number;
  bottom: number;
}

export interface OptionsFilter<T> extends BaseFilter<T> {
  type: FilterTypes.OPTIONS;
  callback: (item: T, selectedOptions: any[]) => any;
}

export interface StringFilter<T> extends BaseFilter<T> {
  type: FilterTypes.STRING;
  callback: (item: T, config: StringFilter<T>) => any;
  input: string;
}
export interface FilterConfig<V, T extends BaseFilter<V>> {
  id: string;
  callback: T["callback"];
  type: T["type"];
  name: string;
  defaultAdded?: boolean;
  hidden?: boolean;
  loose?: boolean;
}

export interface UseFilterProps<V, T extends BaseFilter<V>> {
  items: V[];
  filters: Array<FilterConfig<V, T> & T>;
  setter?: (arg: V[]) => any;
  stringifier?: (item: V[]) => string;
}

export class FilterInstance<V, T extends BaseFilter<V>>
  implements FilterConfig<V, T>
{
  // ID of the filter (auto gen by us using uuid)
  readonly id: string;
  // The callback function for the filter
  callback: T["callback"];

  // The type of the filter
  type: T["type"];

  // the name/title of it
  name: string;

  // Whether this is added by default
  defaultAdded: boolean;

  // Whether this will be hidden in the main filter menu
  hidden: boolean;

  // Whether this filter is loose (Should be replaced each time)
  loose: boolean;

  // any other args that may be in the filter
  [index: string]: any; //index signature

  constructor(
    filterConfig: Omit<FilterConfig<V, T>, "id"> & T & { id?: string }
  ) {
    this.callback = filterConfig["callback"];
    this.name = filterConfig["name"];
    this.type = filterConfig["type"];
    this.defaultAdded = filterConfig.defaultAdded || false;
    this.hidden = filterConfig.hidden || false;
    this.loose = filterConfig.loose || false;
    this.id = filterConfig.id || uuidv4();
    for (const [key, value] of Object.entries(filterConfig)) {
      if (key !== ("id" || "callback" || "name" || "type")) {
        this[key] = value;
      }
    }
  }
}

export const isRangeFilter = (
  filter: RangeFilter<any> | BaseFilter<any>
): filter is RangeFilter<any> => {
  return "top" in filter && "bottom" in filter;
};
