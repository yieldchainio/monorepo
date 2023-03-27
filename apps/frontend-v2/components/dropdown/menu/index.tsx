import { DropdownMenuOptions, DropdownOption } from "../types";
import { BaseComponentProps } from "components/types";
import { RefObject, useState } from "react";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { TextProps } from "components/wrappers/types";
import SmallLoader from "components/loaders/small";
/**
 * @notice
 * A component for the dropdown menu,
 * @param options - the @DropdownOption array of options to display.
 * @param handler - the function to call when an option is chosen
 */

("justify-start");

// The component
const DropdownMenu = ({
  options,
  handler,
  parentRef,
  className,
  optionProps,
  optionText,
  hideOptionText = "laptop:hidden",
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
      className={
        `${
          "w-[" + `${parentRef.current?.getBoundingClientRect().width}` + "px]"
        } bg-custom-bcomponentbg rounded-xl px-2.5 py-3 flex flex-col gap-0.5 absolute top-[60px] left-[0px] z-100 border-1 border-custom-border animate-popup overflow-hidden` +
        " " +
        `left-[${parentRef.current?.getBoundingClientRect().left}` +
        (" " + className || "")
      }
    >
      {options.map((option: DropdownOption, i: number) => {
        return (
          <div
            className={
              "flex flex-row items-center gap-5 bg-custom-dropdown bg-opacity-[0] rounded-lg hover:bg-opacity-50 hover:scale-[1.03] cursor-pointer transition duration-200 ease-in-out justify-between" +
              " " +
              (optionProps?.wrapperClassname || "")
            }
            key={i}
          >
            <div
              className={
                "flex items-center w-full py-2.5 px-2.5 gap-2 laptop:justify-center" +
                  " " +
                  optionProps?.className || ""
              }
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

              <span className="">
                {optionText ? (
                  optionText(option, i)
                ) : (
                  <WrappedText
                    className={
                      "truncate" +
                      " " +
                      hideOptionText +
                      " " +
                      (optionProps?.textClassname || "")
                    }
                    fontStyle="reguler"
                    fontSize={16}
                    {...optionProps?.textProps}
                  >
                    {option.text}
                  </WrappedText>
                )}
              </span>
              {option.children}
            </div>
            {typeof loading !== "boolean" &&
              JSON.stringify(loading.data) == JSON.stringify(option.data) && (
                <SmallLoader color={option.data.color} className="mb-1" />
              )}
          </div>
        );
      })}
    </div>
  );
};
export default DropdownMenu;
