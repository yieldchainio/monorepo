/**
 * @types for the dropdown's components and it's users.
 */
export type data = any;
export interface DropdownOption<T = any> {
  text: string;
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
}
