/**
 * Custom boolean arg input
 */

import { Switch } from "components/switches/base";
import { CustomInputProps } from "../../types";
import { ReactNode, useEffect, useState } from "react";
import { RegulerButton } from "components/buttons/reguler";
import WrappedText from "components/wrappers/text";
import WrappedImage from "components/wrappers/image";

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

  const OnChild = (
    <WrappedImage src={"/icons/green-checkmark.svg"} width={16} height={16} />
  );
  const OffChild = (
    <WrappedImage src={"/icons/red-x.svg"} width={16} height={16} />
  );

  return (
    <RegulerButton
      style={{
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        // borderColor: "var(--themed-border)",
      }}
      onClick={() => setValue(!value)}
    >
      {value ? OnChild : OffChild}
    </RegulerButton>
  );
};
