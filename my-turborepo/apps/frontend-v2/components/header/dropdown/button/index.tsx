import Image from "next/image";
import React, { ForwardedRef, MutableRefObject, useState } from "react";
import { DropdownOption, data, DropdownProps } from "../types";
import "../../../../css/globals.css";

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
          className="w-[178px] overflow-hidden h-max bg-custom-header bg-opacity-0 flex items-center justify-between border-[#47474B] border-[0.5px] rounded-xl py-3 px-4 gap-4 select-none cursor-pointer hover:bg-opacity-20 hover:border-[#4F4F55] transition duration-200 ease-in-out"
          onClick={() => onClick(options)}
          ref={ref}
        >
          <div className="flex gap-2.5">
            {choice?.image && (
              <Image
                src={choice.image}
                alt=""
                width={24}
                height={24}
                className="rounded-[50%]"
              />
            )}
            <div className="font-athletics font-custom-text-color truncate">
              {choice?.text}
            </div>
          </div>
          <Image
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
