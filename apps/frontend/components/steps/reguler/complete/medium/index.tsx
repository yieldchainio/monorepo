/**
 * Medium component of completed step
 */

import { forwardRef, useMemo } from "react";
import { StepProps } from "../../../types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { StepOptions } from "../../../components/options";
import {
  InflowTokenBundle,
  OutflowTokenBundle,
} from "components/tokens/bundle/step";
import { BaseNode } from "components/steps/components/node";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const MediumCompleteStep = forwardRef<HTMLDivElement, any>(
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
    }, [step.inflows, step.inflows.length, canvasPortal]);

    const outflowsComponent = useMemo(() => {
      if (!step.outflows.length) return null;
      return (
        <OutflowTokenBundle tokens={step.outflows} portal={canvasPortal} />
      );
    }, [step.outflows, step.outflows.length, canvasPortal]);

    // Return JSX
    return (
      <BaseNode
        className="flex-col justify-between px-4 py-4"
        ref={ref}
        {...props}
        width="327px"
        height="96px"
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
          <StepOptions onClick={props.onClick} />
        </div>
        <div className="flex flex-row justify-between w-full pl-1">
          <div className="flex flex-row gap-2 items-center justify-center">
            <WrappedText>In:</WrappedText>
            {inflowsComponent}
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <WrappedText>Out:</WrappedText>
            {outflowsComponent}
          </div>
        </div>
      </BaseNode>
    );
  }
);
