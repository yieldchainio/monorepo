export interface BaseComponentProps<T = any> {
  className?: string;
  breakpoints?: BreakPoint<T>;
}

export type BreakPoint<T> = T & {
  width: number;
};

export type ReactChildrenArray = (
  | string
  | number
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactFragment
  | React.ReactPortal
)[];
