/**
 * A small complete step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { CompleteStepSizedProps } from "../types";
import WrappedText from "components/wrappers/text";
import {
  InflowTokenBundle,
  OutflowTokenBundle,
} from "components/tokens/bundle/step";
import { forwardRef } from "react";

export const SmallCompleteStep = forwardRef<
  HTMLDivElement,
  CompleteStepSizedProps
>(({ step, style, ...props }: CompleteStepSizedProps, ref) => {
  return (
    <div
      className="w-[216px] h-[56px] flex flex-row items-center justify-start gap-2 px-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl"
      style={style}
      ref={ref}
      {...props}
    >
      <WrappedImage
        src={step.protocol?.logo}
        width={22}
        height={22}
        className="rounded-full"
      />
      <div
        className="flex flex-row w-[100%] items-center gap-2 bg-custom-componentbg px-3 rounded-lg  py-0.5 border-[1px] border-custom-themedBorder"
        onClick={() => console.log(step.outflows)}
      >
        <WrappedText fontSize={12} className="w-[60%] truncate">
          {step.action?.name}
        </WrappedText>
        <div className="flex flex-row items-center justify-between w-full ">
          {!step.inflows.length ? null : (
            <InflowTokenBundle
              tokens={step.inflows.map((flow) => flow.token)}
            />
          )}
          {!step.outflows.length ? null : (
            <OutflowTokenBundle
              tokens={step.outflows.map((flow) => flow.token)}
            />
          )}
        </div>
      </div>
    </div>
  );
});
