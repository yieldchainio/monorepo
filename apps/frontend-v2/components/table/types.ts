export interface Section<T> {
  label: string | React.ReactNode;
  callback: (arg: T, i: number) => any;
  labelCallback?: (label: string) => React.ReactNode
}
export interface TableProps<T> {
  sections: Section<T>[];
  items: T[];
  columnsGap?: string;
  rowsGap?: string;
  
}
