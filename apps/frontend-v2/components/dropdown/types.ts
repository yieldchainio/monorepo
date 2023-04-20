import { RegulerButtonProps } from "components/buttons/reguler/types";
import { BaseComponentProps } from "components/types";
import { ImageProps, TextProps } from "components/wrappers/types";
import { CSSProperties, RefObject } from "react";

/**
 * @types for the dropdown's components and it's users.
 */
export type data = any;
export interface DropdownOption<T = any> {
  text?: string;
  children?: Array<React.ReactElement | null>;
  image?: string | null;
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
  imageProps?: ImageProps;
  manualModal?: boolean;
  autoChoice?: boolean;
  disabled?: string | false;
}

export interface DropdownOptionProps {
  wrapperClassname?: string;
  className?: string;
  textClassname?: string;
  textProps?: Partial<TextProps>;
}
// Props Interface
export interface DropdownMenuOptions extends BaseComponentProps {
  options: DropdownOption[];
  handler: (_option: DropdownOption) => any;
  parentRef: RefObject<HTMLElement | undefined>;
  optionProps?: DropdownOptionProps;
  optionText?: (_option: DropdownOption, i?: number) => React.ReactNode;
  hideOptionText?: "laptop:hidden" | "";
  modalBehaviour?: "always" | "never" | "auto";
  choiceFocusClass?: string;
}
