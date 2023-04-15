/**
 * Medium component of completed step
 */

import { forwardRef } from "react";
import { CompleteStepProps, CompleteStepSizedProps } from "../../types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { CompleteStepOptions } from "../../components/options";
import {
  InflowTokenBundle,
  OutflowTokenBundle,
} from "components/tokens/bundle/step";

export const MediumCompleteStep = forwardRef<
  HTMLDivElement,
  CompleteStepSizedProps
>(({ step, style, ...props }: CompleteStepSizedProps, ref) => {
  return (
    <div
      className="w-[327px] h-[96px] flex flex-col justify-between px-4 py-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder animate-stepPopup transition duration-200 ease-in-out"
      style={style}
      ref={ref}
      {...props}
    >
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row items-center justify-center gap-2">
          <WrappedImage
            src={step.protocol?.logo}
            className="rounded-full"
            width={26}
            height={26}
          />
          <div className="py-1 px-2 rounded-lg bg-custom-componentbg border-[1px] border-custom-themedBorder">
            <WrappedText fontSize={12}>{step.action?.name}</WrappedText>
          </div>
        </div>
        <CompleteStepOptions step={step} onClick={props.onClick} />
      </div>
      <div className="flex flex-row justify-between w-full pl-1">
        <div className="flex flex-row gap-2 items-center justify-center">
          <WrappedText>In:</WrappedText>
          <InflowTokenBundle tokens={step.inflows} />
        </div>
        <div className="flex flex-row gap-2 items-center justify-center">
          <WrappedText>Out:</WrappedText>
          <OutflowTokenBundle tokens={step.outflows} />
        </div>
      </div>
    </div>
  );
});
