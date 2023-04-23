/**
 * Types for the harvest config
 */

import { YCFunc, YCProtocol } from "@yc/yc-models";
import { DropdownProps } from "components/dropdown/types";
import { BaseComponentProps } from "components/types";

// The data of harvest on the step (for persistnace)
export type HarvestData = {
  func?: YCFunc;
  externallyUnlocked?: boolean;
};

// Props for the positions dropdown
export interface PositionsDropdownProps extends BaseComponentProps {
  // The available harvest functions
  functions: YCFunc[];
  // The current choice
  choice?: YCFunc | null;

  // The choice setter
  setChoice: (func: YCFunc) => void;

  // Optional props for the dropdown
  dropdownProps?: Partial<DropdownProps>;

  // Optional portal (reccomended)
  portal?: HTMLElement;
}

// Position type, used by the positions modal
export type PositionRow = {
  protocol: YCProtocol;
};
