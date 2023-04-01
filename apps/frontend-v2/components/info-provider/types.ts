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
  style?: CSSProperties
}
