/**
 * A small complete trigger step component
 * @param step - A ``Step`` instance
 */

import WrappedImage from "components/wrappers/image";
import { StepProps } from "../../../types";
import WrappedText from "components/wrappers/text";
import { forwardRef, useMemo } from "react";
import { StepOptions } from "../../../components/options";
import { BaseNode } from "components/steps/components/node";
import { TRIGGER_NAMES_TO_COMPONENTS, TriggerVisual } from "../../constants";

export const SmallCompleteTrigger = forwardRef<HTMLDivElement, StepProps>(
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
    return (
      <BaseNode
        className="justify-between px-2 "
        style={style}
        ref={ref}
        {...props}
        width="246px"
        height="56px"
        step={step}
        triggerComparison={triggerComparison}
        canvasID={canvasID}
      >
        <div className="flex flex-row gap-2 items-center justify-start w-[80%] ">
          <div className="flex items-center justify-center p-3 bg-custom-componentbg border-[1px] border-custom-themedBorder dark:border-0 rounded-large w-[30%] max-w-[42px]">
            <WrappedImage src={step.triggerIcon} width={16} height={16} />
          </div>
          <div className="flex flex-col  items-start justify-center w-[60%] overflow-hidden">
            <WrappedText fontSize={13} className="truncate">
              {step.triggerType}
            </WrappedText>
            <WrappedText
              fontSize={10}
              className="text-opacity-40 truncate w-[100%]"
            >
              {step.triggerDescription}
            </WrappedText>
          </div>
        </div>
        <div className="translate-x-[-35%]">{additionalVisual}</div>
        <div className="flex flex-col h-full py-1 justify-start ">
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
