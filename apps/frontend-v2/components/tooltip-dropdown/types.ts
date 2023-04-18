/**
 * Types for the tooltip dropdown
 */

import { data } from "@yc/yc-models";
import { DropdownOption } from "components/dropdown/types";
import { BaseComponentProps } from "components/types";

export interface TooltipDropdownProps extends BaseComponentProps {
  options: Omit<DropdownOption, "children">[];
  handleChoice: (choice: data) => void;
  body?: React.ReactNode;
}
