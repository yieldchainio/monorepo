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
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const SmallCompleteStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Get a portal to the canvas (for tooltips of tokens)
     */
    const canvasPortal = useCanvasPortal();

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
        {...props}
        className="gap-2 px-4"
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
        <StepOptions step={step} onClick={props.onClick} />
      </BaseNode>
    );
  }
);
