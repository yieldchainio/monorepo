/**
 * A medium complete trigger step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { StepProps } from "../../../types";
import WrappedText from "components/wrappers/text";
import { forwardRef, useMemo } from "react";
import { StepOptions } from "../../../components/options";
import { BaseNode } from "components/steps/components/node";
import { TRIGGER_NAMES_TO_COMPONENTS, TriggerVisual } from "../../constants";

/* eslint-disable react/display-name */
export const MediumCompleteTrigger = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Memoize the persisted visual from step's data
     */
    const additionalVisual = useMemo(() => {
      const Visual = TRIGGER_NAMES_TO_COMPONENTS[step.triggerType as string] as
        | TriggerVisual
        | undefined;

      if (Visual)
        return <Visual step={step} triggerComparison={triggerComparison} />;
    }, [step, step.data.trigger, step.triggerType]);

    // Return JSX
    return (
      <BaseNode
        className="justify-between px-4 py-4 "
        style={style}
        ref={ref}
        {...props}
        width="327px"
        height="96px"
        step={step}
        triggerComparison={triggerComparison}
        canvasID={canvasID}
      >
        <div className="flex flex-row gap-2 items-center justify-start">
          <div className="flex items-center justify-center p-3 bg-custom-componentbg border-[1px] border-custom-themedBorder dark:border-0  rounded-large">
            <WrappedImage src={step.triggerIcon} width={24} height={24} />
          </div>
          <div className="flex flex-col gap-1 items-start justify-start">
            <WrappedText fontSize={14}>{step.triggerType}</WrappedText>
            <WrappedText fontSize={11} className="text-opacity-40">
              {step.triggerDescription}
            </WrappedText>
          </div>
        </div>
        <div className="w-[25%] p-4">{additionalVisual}</div>
        <div className="flex flex-col h-full py-0 justify-start ">
          <StepOptions
            canvasID={canvasID}
            step={step}
            triggerComparison={triggerComparison}
          />
        </div>
      </BaseNode>
    );
  }
);
