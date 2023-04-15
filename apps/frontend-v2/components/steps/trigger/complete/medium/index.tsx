/**
 * A medium complete trigger step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { StepProps } from "../../../types";
import WrappedText from "components/wrappers/text";
import { forwardRef } from "react";
import { CompleteStepOptions } from "../../../components/options";

export const MediumCompleteTrigger = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    return (
      <div
        className="w-[327px] h-[96px] flex flex-row justify-between px-4 py-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder animate-stepPopup transition duration-200 ease-in-out"
        style={style}
        ref={ref}
        {...props}
      >
        <div className="flex flex-row gap-2 items-center justify-start">
          <div className="flex items-center justify-center p-3 bg-custom-componentbg border-[1px] border-custom-themedBorder dark:border-0  rounded-large">
            <WrappedImage src={step.triggerIcon} width={24} height={24} />
          </div>
          <div className="flex flex-col gap-1 items-start justify-start">
            <WrappedText fontSize={14}>{step.triggerName}</WrappedText>
            <WrappedText fontSize={11} className="text-opacity-40">
              {step.triggerDescription}
            </WrappedText>
          </div>
        </div>
        <div className="w-[25%] ">{step.triggerVisuals}</div>
        <div className="flex flex-col h-full py-0 justify-start ">
          <CompleteStepOptions
            step={step}
            triggerComparison={triggerComparison}
          />
        </div>
      </div>
    );
  }
);
