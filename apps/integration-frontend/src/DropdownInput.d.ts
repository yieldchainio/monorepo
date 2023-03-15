import { DropdownOptions } from "./types";
export default function DropdownInput({ options, choiceHandler, style, textStyle, imgStyle, placeholder, itemStyle, dropdownStyle, }: {
    options: DropdownOptions<any>[];
    choiceHandler: (choice: any) => any;
    style?: Record<any, any>;
    textStyle?: Record<any, any>;
    imgStyle?: Record<any, any>;
    placeholder?: DropdownOptions<any>;
    itemStyle?: Record<any, any>;
    dropdownStyle?: Record<any, any>;
}): JSX.Element;
