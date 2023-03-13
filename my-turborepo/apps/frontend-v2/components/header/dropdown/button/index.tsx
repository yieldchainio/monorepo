import Image from "next/image";
import React, { ForwardedRef, MutableRefObject, useState } from "react";
import { DropdownOption, data, DropdownProps } from "../types";
import "../../../../css/globals.css";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";

// The props for the dropdown component
interface DropdownButtonProps extends Omit<DropdownProps, "menuComponent"> {
  onClick: (options: DropdownOption[]) => any;
  choice: data;
}

/**
 * @notice
 * DropdownButton
 * A component that is a button
 */
const DropdownButton = React.forwardRef(
  (
    { options, choice, onClick, choiceHandler }: DropdownButtonProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <>
        <div
          className="w-[178px] overflow-hidden h-max bg-custom-dropdown bg-opacity-80 flex items-center justify-between border-[#47474B] border-[1px] rounded-xl py-3 px-4 gap-4 select-none cursor-pointer hover:bg-opacity-70 hover:border-[#4F4F55] transition duration-200 ease-in-out"
          onClick={() => onClick(options)}
          ref={ref}
        >
          <div className="flex gap-2.5 items-center">
            {choice?.image && (
              <WrappedImage
                src={choice.image}
                alt=""
                width={24}
                height={24}
                className="rounded-[50%]"
              />
            )}
            <WrappedText
              className="text-custom-textColor truncate whitespace-nowrap"
              fontSize={16}
              fontStyle={"reguler"}
            >
              {choice.text}
            </WrappedText>
          </div>
          <WrappedImage
            src="/icons/dropdown-arrow.svg"
            alt=""
            width={20}
            height={20}
          />
        </div>
      </>
    );
  }
);

export default DropdownButton;
