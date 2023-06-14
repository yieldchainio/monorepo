/**
 * Custom text arg input
 */

import WrappedInput from "components/wrappers/input";
import { CustomInputProps } from "../../types";

export const CustomTextInput = ({
  setValue,
  style,
  className,
}: CustomInputProps<string>) => {
  return (
    <WrappedInput
      type="text"
      width="w-full"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
