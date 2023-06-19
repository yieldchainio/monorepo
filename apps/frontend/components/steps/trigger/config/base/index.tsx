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
import { BaseComponentProps } from "components/types";
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const BaseTriggerConfig = forwardRef<
  HTMLDivElement,
  BaseComponentProps & {
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
      canContinue,
      handleComplete,
      ...props
    }: BaseComponentProps & {
      width: `${number}${string}`;
      height: `${number}${string}`;
      canContinue?: true | string;
      handleComplete: () => void;
    },
    ref
  ) => {
    const { step } = useStepContext();

    // Return JSX
    return (
      <BaseNode
        width={width}
        height={height}
        className={(className || "") + " " + "py-6 px-6 z-[100]"}
        {...props}
        ref={ref}
      >
        <div className="flex flex-row items-center justify-between self-start w-full">
          <div className="flex flex-row items-center justify-start gap-1 self-start ">
            <WrappedText className="text-opacity-50">Trigger:</WrappedText>
            <WrappedText className="">{step.triggerType}</WrappedText>
          </div>
          <StepOptions />
        </div>
        {children}
        <ActionConfigButtons
          canContinue={canContinue}
          handleComplete={handleComplete}
          cancellable={false}
        />
      </BaseNode>
    );
  }
);
