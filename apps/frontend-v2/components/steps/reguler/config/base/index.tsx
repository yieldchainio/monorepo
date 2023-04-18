/**
 * @notice
 * A base component used by the different action configs.
 *
 * This includes the base node, a title of the action, and the done/cancel buttons
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { BaseNode } from "components/steps/components/node";
import WrappedText from "components/wrappers/text";
import { ActionConfigButtons } from "../components/buttons";
import { StepOptions } from "components/steps/components/options";

export const BaseActionConfig = forwardRef<
  HTMLDivElement,
  StepProps & {
    width: `${number}${string}`;
    height: `${number}${string}`;
    canContinue?: true | string;
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
      ...props
    }: StepProps & {
      width: `${number}${string}`;
      height: `${number}${string}`;
      canContinue?: true | string;
    },
    ref
  ) => {
    return (
      <BaseNode
        width={width}
        height={height}
        className={(className || "") + " " + "py-6 px-6"}
        style={style}
        step={step}
        triggerComparison={triggerComparison}
        {...props}
        ref={ref}
      >
        <div className="flex flex-row items-center justify-between self-start w-full">
          <div className="flex flex-row items-center justify-start gap-1 self-start ">
            <WrappedText className="text-opacity-50">Action:</WrappedText>
            <WrappedText className="">{step.action?.name}</WrappedText>
          </div>
          <StepOptions step={step} triggerComparison={triggerComparison} />
        </div>
        {children}
        <ActionConfigButtons
          step={step}
          triggerComparison={triggerComparison}
          style={{
            marginTop: "auto",
          }}
          canContinue={canContinue}
        />
      </BaseNode>
    );
  }
);
