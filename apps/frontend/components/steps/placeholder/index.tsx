/**
 * A placeholder step used to add children to a parent step
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useContext } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { EmptySmallStep } from "./small";
import { EmptyMediumStep } from "./medium";
import { StepContext, useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const EmptyStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Switch case for the sizing
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return <EmptySmallStep ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <EmptyMediumStep ref={ref} {...props} />;
    }
  }
);
