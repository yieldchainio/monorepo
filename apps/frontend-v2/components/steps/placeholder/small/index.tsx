/**
 * A small placeholder step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";

export const EmptySmallStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    /**
     * Switch case for the sizing
     */
    return (
      <div
        className="w-[246px] h-[56px] flex flex-row items-center justify-start gap-2 px-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder transition duration-200 ease-in-out animate-stepPopup"
        style={style}
        ref={ref}
        {...props}
      >
        Add Step
      </div>
    );
  }
);
