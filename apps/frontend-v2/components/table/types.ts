import { CSSProperties } from "react";

export interface Section<T> {
  label: string | React.ReactNode;
  callback: (arg: T, i: number) => any;
  labelCallback?: (label: string) => React.ReactNode
  style?: CSSProperties
}
export interface TableProps<T> {
  sections: Section<T>[];
  items: T[];
  columnsGap?: string;
  rowsGap?: string;
  
}
