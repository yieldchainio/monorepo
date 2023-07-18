/**
 * Types for tokens bundle component
 */

import { YCToken } from "@yc/yc-models";
import { BaseComponentProps } from "components/types";
import { ImageProps, TextProps } from "components/wrappers/types";

export interface TokensBundleProps extends BaseComponentProps {
  tokens: YCToken[];
  maxImages?: number;
  imageProps?: Partial<ImageProps>;
  margin?: number;
  tooltipEnabled?: boolean;
  textProps?: Partial<TextProps>;
  showAdditionalText?: boolean;
  showTextIfSingle?: boolean;
  portal?: HTMLElement
}
