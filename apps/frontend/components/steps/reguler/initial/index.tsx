/**
 * A Head component for the reguler step's "Choose Action", renders out different components
 * based on size
 */

import { StepProps } from "components/steps/types";
import { forwardRef, useContext } from "react";
import { StepSizing } from "utilities/classes/step/types";
import { SmallChooseAction } from "./small";
import { MediumChooseAction } from "./medium";
import {
  StepContext,
  useStepContext,
} from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const RegulerChooseAction = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();

    switch (step.size) {
      case StepSizing.SMALL:
        return <SmallChooseAction ref={ref} {...props} />;

      case StepSizing.MEDIUM:
        return <MediumChooseAction ref={ref} {...props} />;
    }
  }
);
