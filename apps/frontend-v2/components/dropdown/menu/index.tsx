import { DropdownOption, data } from "../types";
import Image from "next/image";
import { BaseComponentProps } from "components/types";
import { MutableRefObject, RefObject, useState } from "react";
import { useRef } from "react";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import SmallLoader from "components/loaders/small";
import { hexColors } from "configs/styles/colors";
/**
 * @notice
 * A component for the dropdown menu,
 * @param options - the @DropdownOption array of options to display.
 * @param handler - the function to call when an option is chosen
 */

// Props Interface
interface DropdownMenuOptions extends BaseComponentProps {
  options: DropdownOption[];
  handler: (_option: DropdownOption) => any;
  parentRef: RefObject<HTMLElement | undefined>;
}

// Colors

const loaderColors: Record<string, `fill-${string}`> = {
  "#FF0000": "fill-[#FF0000]",
  "#0000FF": "fill-[#0000FF]",
  "#FFFF00": "fill-[#FFFF00]",
  "#A020F0": "fill-[#A020F0]",
  "#00FFFF": "fill-[#00FFFF]",
};

// The component
const DropdownMenu = ({
  options,
  handler,
  parentRef,
  className,
}: DropdownMenuOptions) => {
  // IF we are loading a choice rn or not
  const [loading, setLoading] = useState<boolean | DropdownOption>(false);

  // Called when a choice is made
  const choiceHandler = async (option: DropdownOption) => {
    setLoading(option);
    await handler(option);
    setLoading(false);
  };

  return (
    <div
      className={`${
        "w-[" + `${parentRef.current?.getBoundingClientRect().width}` + "px]"
      } bg-custom-bcomponentbg rounded-xl px-2.5 py-3 flex flex-col gap-0.5 absolute top-[60px] left-[0px] z-100 border-1 border-[#2D2D31] animate-popup overflow-hidden`}
    >
      {options.map((option: DropdownOption) => {
        return (
          <div className="flex flex-row justify-between items-center gap-3 bg-custom-dropdown bg-opacity-[0] rounded-lg hover:bg-opacity-50 hover:scale-[1.03] cursor-pointer transition duration-200 ease-in-out">
            <div
              className="flex items-center w-full py-2.5 px-2 gap-2"
              onClick={async () => await choiceHandler(option)}
            >
              {option.image && (
                <WrappedImage
                  src={option.image}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-[50%]"
                />
              )}

              <WrappedText
                className="truncate"
                fontStyle="reguler"
                fontSize={16}
              >
                {option.text}
              </WrappedText>
            </div>
            {typeof loading !== "boolean" &&
              JSON.stringify(loading.data) == JSON.stringify(option.data) && (
                <SmallLoader
                  color={loaderColors[option.data.color] || "fill-custom-ycy"}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};
export default DropdownMenu;
