/**
 * A searchable dropdown menu
 */

import { BaseComponentProps } from "components/types";
import {
  CSSProperties,
  ForwardedRef,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { TextProps } from "components/wrappers/types";
import SmallLoader from "components/loaders/small";
import { MediaScreenSizes } from "utilities/hooks/styles/useMediaBreakpoints";
import WrappedInput from "components/wrappers/input";
import { useFilters } from "utilities/hooks/general/useFilters";
import {
  FilterInstance,
  FilterTypes,
  StringFilter,
} from "utilities/hooks/general/useFilters/types";
import { DropdownMenuOptions, DropdownOption } from "components/dropdown/types";

// The component
export const SearchableDropdownMenu = forwardRef<
  HTMLDivElement,
  DropdownMenuOptions
>(
  (
    {
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
      style,
      ...props
    }: DropdownMenuOptions,
    ref
  ) => {
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
    const baseStyle: CSSProperties = useMemo(() => {
      if (
        (window.innerWidth <= MediaScreenSizes.TABLET ||
          modalBehaviour == "always") &&
        modalBehaviour !== "never"
      )
        return {
          width: `${
            (parentRef?.current?.getBoundingClientRect().width || 0) + 2
          }px`,
        };
      else
        return {
          width: `${
            (parentRef?.current?.getBoundingClientRect().width || 0) + 2
          }px`,
          position: "absolute",
          top: "60px",
        };
    }, [window.innerWidth]);

    // User's search input
    const [input, setInput] = useState<string>("");

    // Get a string filter instance
    const searchFilter = useMemo(() => {
      return new FilterInstance<DropdownOption, StringFilter<DropdownOption>>({
        callback: (item, config) => {
          const lowerCasedInput = config.input.toLowerCase();
          return item.text?.toLowerCase().includes(lowerCasedInput);
        },
        input,
        name: "DROPDOWN_SEARCH_INPUT",
        type: FilterTypes.STRING,
      });
    }, [input]);

    // Filter the options
    const filteredOptions = useFilters({
      items: options,
      filters: [searchFilter],
    });

    return (
      <div
        className={
          "relative bg-custom-darkSubbg rounded-xl px-2.5 py-3 flex flex-col z-1000000000 border-[0.5px] border-custom-themedBorder animate-popup overflow-hidden " +
          " " +
          (className || "")
        }
        {...props}
        style={{ ...baseStyle, ...style }}
        data-wheelable={false}
      >
        <div
          className="absolute z-10 bg-custom-darkSubbg top-[0px] pt-3 pr-2 w-[97%]"
          data-wheelable={false}
        >
          <WrappedInput
            onChange={(e) => setInput(e.target.value)}
            showGlass={false}
          />
        </div>
        <div
          className="flex flex-col gap-0.5 overflow-y-scroll scrollbar-hide pt-12"
          data-wheelable={false}
        >
          {filteredOptions.map((option: DropdownOption, i: number) => {
            return (
              <div
                className={
                  "flex flex-row items-center gap-5 bg-custom-bcomponentbg bg-opacity-[0] rounded-large hover:bg-opacity-70 hover:scale-[1.03] cursor-pointer transition duration-200 ease-in-out justify-between" +
                  " " +
                  (optionProps?.wrapperClassname || "") +
                  " " +
                  (focusedChoice === i && choiceFocusClass
                    ? choiceFocusClass
                    : " ")
                }
                key={i}
                data-wheelable={false}
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
                  data-wheelable={false}
                >
                  {option.image && (
                    <WrappedImage
                      src={option.image as string}
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
                  JSON.stringify(loading.data) ==
                    JSON.stringify(option.data) && (
                    <SmallLoader color={option.data?.color} className="mb-1" />
                  )}
              </div>
            );
          })}
        </div>

        {children}
      </div>
    );
  }
);
