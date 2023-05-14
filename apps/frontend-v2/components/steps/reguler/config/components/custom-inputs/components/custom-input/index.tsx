/**
 * Switch case to return custom input based on type of argument
 */

import { CustomBooleanInput } from "../../inputs/boolean";
import { CustomNumberInput } from "../../inputs/number";
import { CustomTextInput } from "../../inputs/text";
import { CustomInputProps } from "../../types";

export const SingleCustomInput = ({
  argumentType,
  ...props
}: CustomInputProps<any> & { argumentType: string }) => {
  if (argumentType.includes("int")) return <CustomNumberInput {...props} />;
  if (argumentType.includes("string")) return <CustomTextInput {...props} />;
  if (argumentType.includes("bool")) return <CustomBooleanInput {...props} />;
  return null;
};
