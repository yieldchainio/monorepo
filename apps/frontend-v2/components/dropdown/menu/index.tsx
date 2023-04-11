import { DropdownMenuOptions, DropdownOption } from "../types";
import { BaseComponentProps } from "components/types";
import { RefObject, useMemo, useState } from "react";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { TextProps } from "components/wrappers/types";
import SmallLoader from "components/loaders/small";
import { MediaScreenSizes } from "utilities/hooks/styles/useMediaBreakpoints";
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
  children,
  hideOptionText = "",
  modalBehaviour = "auto",
  choiceFocusClass,
  ...props
}: DropdownMenuOptions) => {
  // IF we are loading a choice rn or not
  const [loading, setLoading] = useState<boolean | DropdownOption>(false);

  // Choice focus state
  const [focusedChoice, setFocusedChoice] = useState<number>();

  // Called when a choice is made
  const choiceHandler = async (option: DropdownOption) => {
    setLoading(option);
    await handler(option);
    setLoading(false);
  };

  // Memoize the classname
  const baseClass: string = useMemo(() => {
    if (
      (window.innerWidth <= MediaScreenSizes.TABLET ||
        modalBehaviour == "always") &&
      modalBehaviour !== "never"
    )
      return (
        `${
          "w-[" +
          `${(parentRef.current?.getBoundingClientRect().width || 0) + 2}` +
          "px]"
        } bg-custom-bcomponentbg rounded-xl px-2.5 py-3 flex flex-col gap-0.5  z-100 border-1 border-custom-border animate-popup overflow-hidden overflow-y-scroll  border-[1px] border-custom-border  scrollbar-hide ` +
        (" " + (className || ""))
      );
    else
      return (
        `${"w-max"} bg-custom-bcomponentbg rounded-xl px-2.5 py-3 flex flex-col gap-0.5 absolute top-[60px] left-[0px] z-100 border-1 border-custom-border animate-popup overflow-hidden border-[1px] border-custom-border` +
        " " +
        `left-[${parentRef.current?.getBoundingClientRect().left}` +
        (" " + (className || ""))
      );
  }, [window.innerWidth]);

  return (
    <div className={baseClass} {...props}>
      {options.map((option: DropdownOption, i: number) => {
        return (
          <div
            className={
              "flex flex-row items-center gap-5 bg-custom-dropdown bg-opacity-[0] rounded-lg hover:bg-opacity-50 hover:scale-[1.03] cursor-pointer transition duration-200 ease-in-out justify-between" +
              " " +
              (optionProps?.wrapperClassname || "") +
              " " +
              (focusedChoice === i && choiceFocusClass ? choiceFocusClass : " ")
            }
            key={i}
          >
            <div
              className={
                "flex items-center w-full py-2.5 px-2.5 gap-2" +
                  " " +
                  optionProps?.className || ""
              }
              onClick={async () => {
                setFocusedChoice(i);
                await choiceHandler(option);
              }}
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
      {children}
    </div>
  );
};
export default DropdownMenu;
