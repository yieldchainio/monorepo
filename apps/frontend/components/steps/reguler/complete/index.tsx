/**
 * Reguler Step Complete component.
 *
 * returns correct UI component based on sizing
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallCompleteStep } from "./small";
import { MediumCompleteStep } from "./medium";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const RegulerCompleteStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Switch case to return corresponding complete component depending on size
     */
    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallCompleteStep ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumCompleteStep ref={ref} {...props} />;
    }
  }
);
