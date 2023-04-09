/**
 * A "Mini" version of a dropdown, using a tooltip (``<InfoProvider />``) with custom trigger
 */
import { InfoProvider } from "components/info-providers";
import { TooltipDropdownProps } from "./types";
import { ChildrenProvider } from "components/internal/render-children";
import { DropdownOption } from "components/dropdown/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { ToolTipDirection } from "components/info-providers/types";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { BaseEventData, EventTypes } from "types/events";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import { useDropdownEvent } from "utilities/hooks/general/useDropdownEvent";

export const TooltipDropdown = ({
  options,
  children,
  handleChoice,
}: TooltipDropdownProps) => {
  const { handleMenuOpen, setHandleMenuClose } = useDropdownEvent();

  return (
    <InfoProvider
      trigger="onClick"
      direction={ToolTipDirection.BOTTOM}
      handleCustomOpen={handleMenuOpen}
      handleCustomClose={() => {}}
      setCloseHandler={setHandleMenuClose}
      contents={
        <div className="flex flex-col gap-2 items-center justify-start py-1 px-0 bg-custom-bcomponentbg rounded-lg ">
          {options.map((option: DropdownOption, i: number) => {
            return (
              <InfoProvider
                contents={option.data.description || option.text}
                direction={ToolTipDirection.RIGHT}
                key={i}
              >
                <div
                  className="flex flex-row gap-1 items-start justify-start bg-white bg-opacity-0 hover:bg-opacity-10 px-6 rounded-lg py-2 w-full transitiion duration-200 ease-in-out cursor-pointer"
                  onClick={() => {
                    handleChoice(option.data);
                  }}
                >
                  {option.image && (
                    <WrappedImage src={option.image} width={12} height={12} />
                  )}
                  <WrappedText>{option.text}</WrappedText>
                </div>
              </InfoProvider>
            );
          })}
        </div>
      }
      className="bg-transparent p-0 "
    >
      {children}
    </InfoProvider>
  );
};
