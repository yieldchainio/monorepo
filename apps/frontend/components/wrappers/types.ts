import { BaseComponentProps } from "components/types";
import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Dimensions } from "utilities/classes/step/types";

export interface TextProps {
  children?: string | undefined | null | never[];
  fontSize?: number;
  fontStyle?: string;
  fontColor?: string;
  contentEditable?: "true" | "false";
  select?: Selection;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any | void | null;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  props?: Record<any, any>;
  onInput?: (e: FormEvent<HTMLDivElement>) => any;
  truncate?: "truncate" | "";
  skeletonDimensions?: Dimensions;
}

export enum Selection {
  allow = "select-text",
  disallow = "select-none",
}

export interface InputProps extends Omit<BaseComponentProps, "onClick"> {
  fontSize?: number;
  fontStyle?: string;
  placeholder?: string;
  placeholderClassname?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => any;
  icon?: string | React.ReactNode;
  iconProps?: ImageProps;
  showGlass?: boolean;
  fontColor?: string;
  select?: Selection;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any | void | null;
  fontFamily?: string;
  className?: string;
  width?: `w-${string}`;
  type?: "text" | "number";
  title?: string;
  value?: string;
  defaultValue?: string;
  min?: number;
  max?: number;
  overridingValue?: any;
  step?: `${number}`;
}

export type ImageSrc =
  | string
  | {
      light: string;
      dark: string;
    }
  | null;

export interface ImageProps {
  src: ImageSrc | undefined;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  getColor?: boolean;
  onClick?: (e?: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => any;

  style?: React.CSSProperties;
  wheelable?: boolean;
}
