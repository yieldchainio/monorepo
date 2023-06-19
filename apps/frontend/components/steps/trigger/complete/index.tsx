/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing, StepType } from "utilities/classes/step/types";
import { StepProps } from "../../types";
import { forwardRef } from "react";
import { SmallCompleteTrigger } from "./small";
import { MediumCompleteTrigger } from "./medium";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const TriggerCompleteStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Switch case to return corresponding step component depending on type & size
     */

    /**
     * Switch case to return corresponding complete component depending on size
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallCompleteTrigger ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumCompleteTrigger ref={ref} {...props} />;
    }
  }
);
