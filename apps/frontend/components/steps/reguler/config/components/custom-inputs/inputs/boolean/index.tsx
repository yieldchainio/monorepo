/**
 * Custom boolean arg input
 */

import { Switch } from "components/switches/base";
import { CustomInputProps } from "../../types";
import { useEffect, useState } from "react";

export const CustomBooleanInput = ({
  setValue,
  style,
  value,
}: CustomInputProps<boolean>) => {
  const [trueOrFalse, setTrueOrFalse] = useState(value);
  useEffect(() => {
    if (value !== null) {
      setTrueOrFalse(value);
    }
  }, [value]);

  useEffect(() => {
    if (value == null) setValue(false);
  }, []);

  return (
    <Switch
      handler={(on: boolean) => setValue(on)}
      overridingState={trueOrFalse}
    >
      {value ? (
        <div className="rounded-full w-full h-full bg-green-500"></div>
      ) : (
        <div className="rounded-full w-full h-full bg-black bg-opacity-50"></div>
      )}
    </Switch>
  );
};
