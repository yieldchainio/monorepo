import { RegulerButtonProps } from "components/buttons/reguler/types";
import { TextProps } from "components/wrappers/types";

export interface HeaderCatagoryTextProps
  extends RegulerButtonProps,
    Omit<Omit<TextProps, "children">, "onClick"> {
  text: string;
  page: string;
  fontSize?: number;
  fontColor?: string;
}