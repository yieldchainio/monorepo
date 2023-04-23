/**
 * Base component for all trigger configs
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { BaseNode } from "components/steps/components/node";
import WrappedText from "components/wrappers/text";
import { ActionConfigButtons } from "components/steps/reguler/config/components/buttons";
import { StepOptions } from "components/steps/components/options";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";

export const BaseTriggerConfig = forwardRef<
  HTMLDivElement,
  StepProps & {
    width: `${number}${string}`;
    height: `${number}${string}`;
    canContinue?: true | string;
    handleComplete: () => void;
  }
>(
  (
    {
      children,
      width,
      height,
      className = "flex-col ",
      style,
      step,
      triggerComparison,
      canContinue,
      canvasID,
      handleComplete,
      ...props
    }: StepProps & {
      width: `${number}${string}`;
      height: `${number}${string}`;
      canContinue?: true | string;
      handleComplete: () => void;
    },
    ref
  ) => {
    /**
     * Get a portal to our canvas for tooltips
     */
    const canvasPortal = useElementPortal(canvasID);

    // Return JSX
    return (
      <BaseNode
        width={width}
        height={height}
        className={(className || "") + " " + "py-6 px-6 z-[100]"}
        style={style}
        step={step}
        triggerComparison={triggerComparison}
        {...props}
        ref={ref}
        canvasID={canvasID}
      >
        <div className="flex flex-row items-center justify-between self-start w-full">
          <div className="flex flex-row items-center justify-start gap-1 self-start ">
            <WrappedText className="text-opacity-50">Trigger:</WrappedText>
            <WrappedText className="">{step.triggerName}</WrappedText>
          </div>
          <StepOptions
            canvasID={canvasID}
            step={step}
            triggerComparison={triggerComparison}
          />
        </div>
        {children}
        <ActionConfigButtons
          step={step}
          triggerComparison={triggerComparison}
          canContinue={canContinue}
          portal={canvasPortal}
          handleComplete={handleComplete}
          cancellable={false}
        />
      </BaseNode>
    );
  }
);
