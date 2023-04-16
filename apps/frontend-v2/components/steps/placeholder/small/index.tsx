/**
 * A small placeholder step
 */

import { DashedGradientBorder } from "components/gradient-border/dashed";
import { StepProps } from "components/steps/types";
import WrappedText from "components/wrappers/text";
import { forwardRef } from "react";
import { Step } from "utilities/classes/step";
import { StepType } from "utilities/classes/step/types";

export const EmptySmallStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    /**
     * Switch case for the sizing
     */
    return (
      <DashedGradientBorder
        width="256px"
        height="56px"
        heavyColor="var(--yc-lb)"
        lightColor="var(--yc-yellow)"
        childrenContainerClassname="flex flex-col items-center justify-center"
        style={{ ...style, position: "absolute" }}
        globalClassname="group bg-custom-dimmed bg-opacity-0 hover:bg-opacity-30 transition duration-200"
        dashSize={6}
        dashSpace={8}
        onClick={() => {
          step.parent?.addChild(
            new Step({
              type: StepType.STEP,
              state: "initial",
            })
          );

          triggerComparison();
        }}
      >
        <WrappedText
          fontSize={14}
          fontStyle="bold"
          fontColor="transparent"
          className="bg-clip-text bg-gradient-to-r from-custom-ycllb to-custom-ycy dark:from-custom-yclb dark:to-custom-ycy drop-shadow-sm group-hover:scale-[1.1] transition duration-200 ease-in-out will-change-transform"
        >
          + Add Step
        </WrappedText>
      </DashedGradientBorder>
    );
  }
);
