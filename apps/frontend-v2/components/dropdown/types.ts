import { RegulerButtonProps } from "components/buttons/reguler";
import { TextProps } from "components/wrappers/text";
import { DropdownMenuOptions } from "./menu";

/**
 * @types for the dropdown's components and it's users.
 */
export type data = any;
export interface DropdownOption<T = any> {
  text: string;
  children?: Array<React.ReactElement | null>;
  image?: string;
  data: T;
}

export interface DropdownHandlerProps {
  [x: string]: any;
  options?: DropdownOption[];
  handler?: () => any;
}

export interface DropdownProps {
  options: DropdownOption[];
  choice?: DropdownOption;
  children?: React.ReactNode;
  onClick?: (options: DropdownOption[]) => any;
  choiceHandler?:
    | ((_choice: DropdownOption) => Promise<any>)
    | ((_choice: DropdownOption) => any);
  closeOnChoice?: boolean;
  buttonProps?: RegulerButtonProps;
  menuProps?: Partial<DropdownMenuOptions>;
  textProps?: Omit<TextProps, "children">;
}
