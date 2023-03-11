import { DropdownOption, data } from "../types";
import Image from "next/image";
import { BaseComponentProps } from "components/types";
import { MutableRefObject, RefObject } from "react";
import { useRef } from "react";
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

// The component
const DropdownMenu = ({
  options,
  handler,
  parentRef,
  className,
}: DropdownMenuOptions) => {
  return (
    <div
      className={`${
        "w-[" + `${parentRef.current?.getBoundingClientRect().width}` + "px]"
      } bg-[#1C1D1D] rounded-xl px-2.5 py-3 flex flex-col gap-0.5 absolute top-[60px] left-[0px] z-100 border-1 border-[#2D2D31]`}
    >
      {options.map((option: DropdownOption) => (
        <div
          className="flex bg-[#272828] bg-opacity-0 items-center w-full py-2.5 px-2 gap-2 rounded-lg hover:bg-opacity-80 hover:scale-[1.03] cursor-pointer transition duration-200 ease-in-out"
          onClick={() => handler(option)}
        >
          {option.image && (
            <Image
              src={option.image}
              alt=""
              width={24}
              height={24}
              className="rounded-[50%]"
            />
          )}
          <div className="font-athletics text-custom-text-color text-ellipsis">
            {option.text}
          </div>
        </div>
      ))}
    </div>
  );
};
export default DropdownMenu;
