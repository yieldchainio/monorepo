/**
 * types for the custom args component
 */

import { BaseComponentProps } from "components/types.js";
import { CustomTextInput } from "./inputs/text/index.jsx";
import { CustomNumberInput } from "./inputs/number/index.jsx";
import { CustomBooleanInput } from "./inputs/boolean/index.jsx";
import { CustomDatetimeInput } from "./inputs/datetime/index.jsx";
import { YCArgument } from "@yc/yc-models";
import { StepProps } from "components/steps/types.js";

export interface CustomArgumentsProps extends StepProps {}

export enum CustomInputTypes {
  TEXT = "text",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATETIME = "datetime",
}

export interface CustomInputProps<T> extends BaseComponentProps {
  setValue: (value: T) => void;
  value: T;
}

export const InputTypesToComponents: Record<
  CustomInputTypes,
  (props: CustomInputProps<any>) => JSX.Element
> = {
  [CustomInputTypes.TEXT]: CustomTextInput,
  [CustomInputTypes.NUMBER]: CustomNumberInput,
  [CustomInputTypes.BOOLEAN]: CustomBooleanInput,
  [CustomInputTypes.DATETIME]: CustomDatetimeInput,
};
