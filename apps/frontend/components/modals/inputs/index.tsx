/**
 * Modal Component To Receive Inputs
 */

import { RegulerButton } from "components/buttons/reguler";
import { BaseModalChildProps } from "components/types";
import WrappedInput from "components/wrappers/input";
import WrappedText from "components/wrappers/text";
import { InputProps } from "components/wrappers/types";
import { useState } from "react";

type Item<T> = [value: T, setter: (item: T) => void];

export const InputsModal = ({
  inputs,
  onClick,
  style,
  closeModal,
  className,
  onConfirm,
}: {
  inputs: Array<{
    value: any;
    setter: any;
    title: string;
    description?: (value: any) => string;
    type?: "text" | "number";
    inputProps?: InputProps;
    condition?: (value: any) => string | true;
  }>;
  onConfirm?: () => void;
} & BaseModalChildProps) => {
  return (
    <div
      className={
        "flex flex-col items-center justify-start rounded-lg bg-custom-darkSubbg px-12 py-16 gap-6 w-[50%] h-max overflow-hidden" +
        " " +
        className
      }
      onClick={onClick}
      style={style}
    >
      <WrappedText fontStyle="bold" fontSize={32}>
        Fill In The Inputs Below
      </WrappedText>
      {inputs.map((input, i) => {
        return (
          <SingleInput
            title={input.title}
            setter={(newValue: any) => {
              input.setter(newValue);
            }}
            description={input.description}
            type={input.type || "text"}
            inputProps={input.inputProps}
          />
        );
      })}

      <RegulerButton onClick={() => {
        closeModal?.()
        onConfirm?.()
      }}>Confirm</RegulerButton>
    </div>
  );
};

const SingleInput = ({
  title,
  description,
  setter,
  inputProps,
  type,
}: {
  title: string;
  description?: (value: any) => string;
  setter: (value: any) => void;
  type: "text" | "number";
  inputProps?: InputProps;
}) => {
  const [val, setVal] = useState<string>("");

  return (
    <div className="flex flex-col items-start justify-start w-full gap-3">
      <div className="flex flex-col items-start justify-start w-full gap-1">
        <WrappedText fontSize={12} className="ml-1">
          {title}
        </WrappedText>
        <WrappedInput
          onChange={(e) => {
            setVal(e.target.value);
            setter(e.target.value);
          }}
          showGlass={false}
          type={type}
          {...(inputProps || {})}
        />
      </div>
      {description && (
        <WrappedText
          fontSize={13}
          className="text-opacity-70 ml-1 whitespace-pre-wrap"
        >
          {description(val)}
        </WrappedText>
      )}
    </div>
  );
};
