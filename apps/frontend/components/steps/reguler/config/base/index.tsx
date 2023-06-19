/**
 * @notice
 * A base component used by the different action configs.
 *
 * This includes the base node, a title of the action, and the done/cancel buttons
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useMemo } from "react";
import { BaseNode } from "components/steps/components/node";
import WrappedText from "components/wrappers/text";
import { ActionConfigButtons } from "../components/buttons";
import { StepOptions } from "components/steps/components/options";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";
import { createPortal } from "react-dom";
import { CustomArgumentInputs } from "../components/custom-inputs";
import { BaseComponentProps } from "components/types";
import { useCanvasPortal } from "utilities/hooks/contexts/canvas-context";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const BaseActionConfig = forwardRef<
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
      style,
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
    const { step, triggerComparison } = useStepContext();
    /**
     * Get a portal to our canvas for tooltips
     */
    const canvasPortal = useCanvasPortal();

    const requiresCustomInputs = useMemo(() => {
      if (step.customArguments.length > 0) {
        if (step.function?.customArgumentsLength == 0) return false;
        if (
          (step.function?.customArgumentsLength || 0) -
            step.presetCustomArgsIndices.length >
          0
        )
          return true;
      }
      return false;
    }, [step.function?.id]);

    const canComplete = useMemo(() => {
      if (canContinue == "string") return canContinue;

      if (step.customArguments.some((arg, i) => arg == null))
        return "Complete Custom Inputs To Continue";

      if (step.customArguments.length == step.presetCustomArgsIndices.length)
        return true;
    }, [canContinue, step.customArguments]);

    // Return JSX
    return (
      <>
        {requiresCustomInputs && (
          <CustomArgumentInputs
            step={step}
            triggerComparison={triggerComparison}
            style={{
              ...style,
              left: ((style?.left || 0) as number) + parseInt(width) * 1.1,
            }}
            {...props}
            className={className}
          ></CustomArgumentInputs>
        )}
        <BaseNode
          width={width}
          height={height}
          className={(className || "") + " " + "py-6 px-6 z-[100]"}
          {...props}
          ref={ref}
        >
          <div className="flex flex-row items-center justify-between self-start w-full">
            <div className="flex flex-row items-center justify-start gap-1 self-start ">
              <WrappedText className="text-opacity-50">Action:</WrappedText>
              <WrappedText className="">{step.action?.name}</WrappedText>
            </div>
            <StepOptions />
          </div>
          {children}
          <ActionConfigButtons
            canContinue={canComplete}
            portal={canvasPortal}
            handleComplete={handleComplete}
          />
        </BaseNode>
      </>
    );
  }
);
