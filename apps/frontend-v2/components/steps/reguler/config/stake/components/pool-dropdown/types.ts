/**
 * Types for the pool dropdown
 */

import { YCFunc } from "@yc/yc-models";
import { DropdownProps } from "components/dropdown/types";
import { BaseComponentProps } from "components/types";
import { StepSizing } from "utilities/classes/step/types";

export interface PoolsDropdownProps extends BaseComponentProps {
  functions: YCFunc[];
  choice?: YCFunc | null;
  setChoice: (func: YCFunc) => void;
  dropdownProps?: Partial<DropdownProps>;
  portal?: HTMLElement;
  size: StepSizing;
}

export type Pool = {
  stake: YCFunc;
  rewards: YCFunc;
};
