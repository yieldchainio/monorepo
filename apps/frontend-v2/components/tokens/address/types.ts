import { YCToken } from "@yc/yc-models";
import { TextProps } from "components/wrappers/types";

/**
 * Types for the token address component
 */
export interface TokenAddressProps {
  token: YCToken;
  textProps?: Partial<TextProps>;
}
