/**
 * Custom number arg input
 */

import WrappedInput from "components/wrappers/input";
import { CustomInputProps } from "../../types";

export const CustomNumberInput = ({
  setValue,
  style,
  className,
}: CustomInputProps<number>) => {
  return (
    <WrappedInput
      type="number"
      width="w-full"
      onChange={(e) => setValue(parseInt(e.target.value))}
    />
  );
};
