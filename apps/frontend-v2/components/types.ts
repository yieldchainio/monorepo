import { CSSProperties, MouseEvent } from "react";

export interface BaseComponentProps<T = any> {
  className?: string;
  breakpoints?: BreakPoint<T>;
  children?: React.ReactNode;
  style?: CSSProperties;
  onClick?: (e?: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => any;
}

export interface BaseModalChildProps {
  closeModal?: () => void
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

export interface BaseModalProps {
  modalKey: number;
}
