export interface Section<T> {
  label: string;
  callback: (arg: T) => any;
}
export interface TableProps<T> {
  sections: Section<T>[];
  items: T[];
}
