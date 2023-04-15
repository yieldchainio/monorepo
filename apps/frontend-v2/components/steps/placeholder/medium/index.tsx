/**
 * A medium placeholder step
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";

export const EmptyMediumStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    /**
     * Switch case for the sizing
     */
    return (
      <div
        className="w-[327px] h-[96px] flex flex-col justify-between px-4 py-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder animate-stepPopup transition duration-200 ease-in-out"
        style={style}
        ref={ref}
        {...props}
      >
        Add Step
      </div>
    );
  }
);
