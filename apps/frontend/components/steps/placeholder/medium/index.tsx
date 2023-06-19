/**
 * A medium placeholder step
 */

import { DashedGradientBorder } from "components/gradient-border/dashed";
import { StepProps } from "components/steps/types";
import WrappedText from "components/wrappers/text";
import { forwardRef, useContext } from "react";
import { Step } from "utilities/classes/step";
import { StepType } from "utilities/classes/step/types";
import { StepContext, useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const EmptyMediumStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step, style, triggerComparison } = useStepContext();

    /**
     * Switch case for the sizing
     */
    return (
      <DashedGradientBorder
        width="327px"
        height="96px"
        heavyColor="var(--yc-lb)"
        lightColor="var(--yc-yellow)"
        childrenContainerClassname="flex flex-col items-center justify-center"
        style={{ ...style, position: "absolute" }}
        globalClassname="group bg-custom-dimmed bg-opacity-0 hover:bg-opacity-30 transition duration-200"
        onClick={() => {
          const newstep = new Step(
            {
              type: StepType.STEP,
              state: "initial",
            },
            true
          );

          newstep.parent = step.parent;

          step.parent?.addChild(newstep, true);

          triggerComparison();
          props?.onClick?.();
        }}
        className="opacity-60"
        ref={ref}
      >
        <WrappedText
          fontSize={18}
          fontStyle="bold"
          fontColor="transparent"
          className="bg-clip-text bg-gradient-to-r from-custom-ycllb to-custom-ycy dark:from-custom-yclb dark:to-custom-ycy drop-shadow-sm  group-hover:scale-[1.05] transition duration-200 ease-in-out will-change-transform"
        >
          + Add Step
        </WrappedText>
      </DashedGradientBorder>
    );
  }
);
