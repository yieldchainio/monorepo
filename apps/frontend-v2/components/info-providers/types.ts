import { YCProtocol, YCToken } from "@yc/yc-models";
import { BaseComponentProps } from "components/types";
import { CSSProperties } from "react";

// The possible directions
export enum ToolTipDirection {
  LEFT = 0,
  TOP = 1,
  BOTTOM = 2,
  RIGHT = 3,
}

// The props for the tooltip / infoprovider
export interface InfoProviderProps extends BaseComponentProps {
  contents: React.ReactNode;
  direction?: ToolTipDirection;
  visibilityOverride?: boolean;
  style?: CSSProperties;
  delay?: number;
  trigger?: "onHover" | "onClick";
  overrideDefaultComponent?: boolean;
  setVisibilityHandler?: (visibilityHandler: () => void) => void;
  handleCustomOpen?: () => void;
  handleCustomClose?: () => void;
  setCloseHandler?: (closeHandler: () => void) => void;
  portal?: HTMLElement;
}

// Protocols Provider props
export interface ProtocolsProviderProps extends BaseComponentProps {
  protocols: YCProtocol[];
}

// Tokens provider props
export interface TokensProviderProps extends BaseComponentProps {
  tokens: YCToken[];
}
