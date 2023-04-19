/**
 * A "Mini" version of a dropdown, using a tooltip (``<InfoProvider />``) with custom trigger
 */
import { InfoProvider } from "components/info-providers";
import { TooltipDropdownProps } from "./types";
import { DropdownOption } from "components/dropdown/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { ToolTipDirection } from "components/info-providers/types";
import { useMemo } from "react";
import { useDropdownEvent } from "utilities/hooks/general/useDropdownEvent";

export const TooltipDropdown = ({
  options,
  children,
  handleChoice,
  body,
  portal,
}: TooltipDropdownProps) => {
  const { handleMenuOpen, setHandleMenuClose } = useDropdownEvent();

  /**
   * Memoize body contents
   */
  const bodyContents = useMemo(() => {
    if (body) return body;
    return (
      <div className="absolute flex flex-col gap-2 items-center justify-start py-1 px-0 bg-custom-bcomponentbg rounded-lg border-custom-themedBorder shadow-sm">
        {options.map((option: DropdownOption, i: number) => {
          return (
            <div>
              <InfoProvider
                contents={option.data.description || option.text}
                direction={ToolTipDirection.RIGHT}
                key={i}
                portal={portal}
              >
                <div
                  className="flex flex-row gap-1 items-start justify-start bg-white bg-opacity-0 hover:bg-opacity-10 px-6 rounded-lg py-2 w-full transitiion duration-200 ease-in-out cursor-pointer"
                  onClick={() => {
                    if (option.data.handler) option.data.handler();
                    handleChoice(option.data);
                  }}
                >
                  {option.image && (
                    <WrappedImage src={option.image} width={12} height={12} />
                  )}
                  <WrappedText>{option.text}</WrappedText>
                </div>
              </InfoProvider>
            </div>
          );
        })}
      </div>
    );
  }, [body]);

  return (
    <InfoProvider
      trigger="onClick"
      direction={ToolTipDirection.BOTTOM}
      handleCustomOpen={handleMenuOpen}
      handleCustomClose={() => {}}
      setCloseHandler={setHandleMenuClose}
      contents={bodyContents}
      className="bg-transparent p-0 "
      portal={portal}
      overrideDefaultComponent
    >
      {children}
    </InfoProvider>
  );
};
