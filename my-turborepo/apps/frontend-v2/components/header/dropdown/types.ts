/**
 * @types for the dropdown's components and it's users.
 */
export type data = any;
export interface DropdownOption {
  text: string;
  image?: string;
  data: data;
}

export interface DropdownHandlerProps {
  [x: string]: any;
  options?: DropdownOption[];
  handler?: () => any;
}

export interface DropdownProps {
  options: DropdownOption[];
  choice?: DropdownOption;
  MenuComponent?: JSX.Element;
  onClick?: (options: DropdownOption[]) => any;
  choiceHandler?:
    | ((_choice: DropdownOption) => Promise<any>)
    | ((_choice: DropdownOption) => any);
}
