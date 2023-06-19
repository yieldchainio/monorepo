/**
 * A Head Config component for the Stake action, renders diff components by size.
 */

import { StepProps } from "components/steps/types";
import { forwardRef } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallStakeConfig } from "./small";
import { MediumStakeConfig } from "./medium";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const StakeConfig = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();

    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallStakeConfig ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumStakeConfig ref={ref} {...props} />;
    }
  }
);
