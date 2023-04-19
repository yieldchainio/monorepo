/**
 * Medium component of completed step
 */

import { forwardRef } from "react";
import { StepProps } from "../../../types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { StepOptions } from "../../../components/options";
import {
  InflowTokenBundle,
  OutflowTokenBundle,
} from "components/tokens/bundle/step";
import { BaseNode } from "components/steps/components/node";

export const MediumCompleteStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    return (
      <BaseNode
        className="flex-col justify-between px-4 py-4"
        style={style}
        ref={ref}
        {...props}
        width="327px"
        height="96px"
        step={step}
        triggerComparison={triggerComparison}
        canvasID={canvasID}
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
          <StepOptions
            canvasID={canvasID}
            step={step}
            onClick={props.onClick}
            triggerComparison={triggerComparison}
          />
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
      </BaseNode>
    );
  }
);
