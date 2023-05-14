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

export const BaseActionConfig = forwardRef<
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

    const requiresCustomInputs = useMemo(() => {
      if (step.customArguments.length > 0) return true;
      return false;
    }, [step.customArguments.length]);

    const canComplete = useMemo(() => {
      if (canContinue == "string")
        return canContinue;

      if (step.customArguments.some((arg) => arg == null))
        return "Complete Custom Inputs To Continue";
      return true;
    }, [canContinue, step.customArguments]);

    console.log("Can Complete", canComplete)

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
          style={style}
          step={step}
          triggerComparison={triggerComparison}
          {...props}
          ref={ref}
          canvasID={canvasID}
        >
          <div className="flex flex-row items-center justify-between self-start w-full">
            <div className="flex flex-row items-center justify-start gap-1 self-start ">
              <WrappedText className="text-opacity-50">Action:</WrappedText>
              <WrappedText className="">{step.action?.name}</WrappedText>
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
            canContinue={canComplete}
            portal={canvasPortal}
            handleComplete={handleComplete}
          />
        </BaseNode>
      </>
    );
  }
);
