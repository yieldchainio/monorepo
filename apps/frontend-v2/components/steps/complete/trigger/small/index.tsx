/**
 * A small complete trigger step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { CompleteStepSizedProps } from "../../types";
import WrappedText from "components/wrappers/text";
import { forwardRef } from "react";
import { CompleteStepOptions } from "../../components/options";

export const SmallCompleteTrigger = forwardRef<
  HTMLDivElement,
  CompleteStepSizedProps
>(
  (
    { step, style, triggerComparison, ...props }: CompleteStepSizedProps,
    ref
  ) => {
    return (
      <div
        className="w-[246px] h-[56px] flex flex-row items-center justify-between px-2 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder transition duration-200 ease-in-out animate-stepPopup"
        style={style}
        ref={ref}
        {...props}
      >
        <div className="flex flex-row gap-2 items-center justify-start w-[80%] ">
          <div className="flex items-center justify-center p-3 bg-custom-componentbg border-[1px] border-custom-themedBorder dark:border-0 rounded-large w-[30%] max-w-[42px]">
            <WrappedImage src={step.triggerIcon} width={16} height={16} />
          </div>
          <div className="flex flex-col  items-start justify-center w-[60%] overflow-hidden">
            <WrappedText fontSize={13} className="truncate">
              {step.triggerName}
            </WrappedText>
            <WrappedText
              fontSize={10}
              className="text-opacity-40 truncate w-[100%]"
            >
              {step.triggerDescription}
            </WrappedText>
          </div>
        </div>
        {/* <div className="bg-red-500">Hey Ser What is Up</div> */}
        <div className="flex flex-col h-full py-1 justify-start ">
          <CompleteStepOptions
            step={step}
            triggerComparison={triggerComparison}
          />
        </div>
      </div>
    );
  }
);