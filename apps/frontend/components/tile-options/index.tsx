/**
 * A "Tiles" options component
 */

import { DropdownMenuOptions } from "components/dropdown/types";
import WrappedText from "components/wrappers/text";
import { useState } from "react";

export const TileOptions = ({
  options,
  className,
  style,
  defaultChosenIdx = 0,
  setChoice,
}: Omit<DropdownMenuOptions, "parentRef"> & {
  defaultChosenIdx?: number;
  setChoice: (idx: number) => any;
}) => {
  const [chosenIdx, setChosenIdx] = useState(defaultChosenIdx);

  const handleClick = (idx: number) => {
    setChosenIdx(idx);
    setChoice(idx);
  };

  return (
    <div
      className={
        "w-full flex flex-row items-center justify-start shadow-custom-textColor border-[1px] border-custom-border divide-x divide-custom-border bg-custom-bcomponentbg rounded-md " +
        " " +
        (className || "")
      }
    >
      {options.map((option, i) => {
        return (
          <div
            className={
              "flex flex-row items-center justify-center px-10 py-3 bg-custom-textColor bg-opacity-0  transition duration-200 ease-in-out " +
              " " +
              (i == options.length - 1
                ? "rounded-tr-inherit rounded-br-inherit"
                : i == 0
                ? "rounded-tl-inherit rounded-bl-inherit"
                : "") +
              (i == chosenIdx
                ? " bg-opacity-5"
                : " cursor-pointer hover:bg-opacity-10")
            }
            onClick={() => {
              if (chosenIdx != i) handleClick(i);
            }}
          >
            <WrappedText className={chosenIdx == i ? "" : "text-opacity-70"}>
              {option.text}
            </WrappedText>
          </div>
        );
      })}
    </div>
  );
};
