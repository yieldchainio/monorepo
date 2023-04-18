/**
 * Types for tokens bundle component
 */

import { YCToken } from "@yc/yc-models";
import { BaseComponentProps } from "components/types";
import { ImageProps } from "components/wrappers/types";

export interface TokensBundleProps extends BaseComponentProps {
  tokens: YCToken[];
  maxImages?: number;
  imageProps?: ImageProps;
  margin?: number;
  tooltipEnabled?: boolean;
}
