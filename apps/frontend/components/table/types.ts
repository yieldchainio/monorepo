import { BaseComponentProps } from "components/types";
import { CSSProperties } from "react";

export interface Section<T> {
  label: string | React.ReactNode;
  callback: (arg: T, i: number) => any;
  labelCallback?: (label: string) => React.ReactNode
  style?: CSSProperties
}
export interface TableProps<T> extends BaseComponentProps {
  sections: Section<T>[];
  items: T[];
  columnsGap?: string;
  rowsGap?: string;
  labelsStyle?: CSSProperties
  
}
