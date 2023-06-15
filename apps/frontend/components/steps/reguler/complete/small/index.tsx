/**
 * A small complete step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { StepProps } from "../../../types";
import WrappedText from "components/wrappers/text";
import {
  InflowTokenBundle,
  OutflowTokenBundle,
} from "components/tokens/bundle/step";
import { forwardRef, useMemo } from "react";
import { StepOptions } from "../../../components/options";
import { BaseNode } from "components/steps/components/node";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";

/* eslint-disable react/display-name */
export const SmallCompleteStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Get a portal to the canvas (for tooltips of tokens)
     */
    const canvasPortal = useElementPortal(canvasID);

    /**
     * Memoizing for performance
     */
    const inflowsComponent = useMemo(() => {
      if (!step.inflows.length) return null;
      return <InflowTokenBundle tokens={step.inflows} portal={canvasPortal} />;
    }, [step.inflows, step.inflows.length]);

    const outflowsComponent = useMemo(() => {
      if (!step.outflows.length) return null;
      return (
        <OutflowTokenBundle tokens={step.outflows} portal={canvasPortal} />
      );
    }, [step.outflows, step.outflows.length, canvasPortal]);

    // Return the component
    return (
      <BaseNode
        width={"246px"}
        height={"56px"}
        ref={ref}
        style={style}
        {...props}
        className="gap-2 px-4"
        step={step}
        triggerComparison={triggerComparison}
        canvasID={canvasID}
      >
        <WrappedImage
          src={step.protocol?.logo}
          width={22}
          height={22}
          className="rounded-full"
        />
        <div className="flex flex-row w-[70%] items-center gap-2 bg-custom-componentbg px-3 rounded-lg  py-0.5 border-[1px] border-custom-themedBorder">
          <WrappedText fontSize={12} className="w-[60%] truncate">
            {step.action?.name}
          </WrappedText>
          <div className="flex flex-row items-center justify-between w-full ">
            {inflowsComponent}
            {outflowsComponent}
          </div>
        </div>
        <StepOptions
          canvasID={canvasID}
          step={step}
          onClick={props.onClick}
          triggerComparison={triggerComparison}
        />
      </BaseNode>
      // <div
      //   className="w-[246px] h-[56px] flex flex-row items-center justify-start gap-2 px-4 bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder transition duration-200 ease-in-out animate-stepPopup"
      //   style={style}
      //   ref={ref}
      //   {...props}
      // >

      // </div>
    );
  }
);