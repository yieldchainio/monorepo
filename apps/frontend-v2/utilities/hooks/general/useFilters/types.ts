import { v4 as uuidv4 } from "uuid";
// Types of filters (For easy indexing)
export enum FilterTypes {
  BOOLEAN,
  RANGE,
}

// The base filter (has a type + callback)
export interface BaseFilter<T> {
  type: FilterTypes;
  callback: (item: T, ...args: any) => any;
}

// A boolean filter (on/off)
export interface BooleanFilter<T> extends BaseFilter<T> {
  type: FilterTypes.BOOLEAN;
  callback: (item: T, bool: boolean) => any;
}

// A range filter (i.e 10,000 to 15,000)
export interface RangeFilter<T> extends BaseFilter<T> {
  type: FilterTypes.RANGE;
  callback: (item: T, bottom: number, top: number) => any;
}

export interface FilterConfig<V, T extends BaseFilter<V>> {
  id: string;
  callback: T["callback"];
  type: T["type"];
  name: string;
}

export interface UseFilterProps<V, T extends BaseFilter<V>> {
  items: V[];
  filters: FilterConfig<V, T>[];
  setter?: (arg: V[]) => any;
  stringifier?: (item: V[]) => string;
}

export class FilterInstance<V, T extends BaseFilter<V>>
  implements FilterConfig<V, T>
{
  readonly id: string;
  callback: T["callback"];
  type: T["type"];
  name: string;
  constructor(filterConfig: Omit<FilterConfig<V, T>, "id">) {
    this.callback = filterConfig["callback"];
    this.name = filterConfig["name"];
    this.type = filterConfig["type"];
    this.id = uuidv4();
  }
}
