/**
 * Types for the complete step components
 */

import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";
import { StepSizing } from "utilities/classes/step/types";

export interface CompleteStepProps extends BaseComponentProps {
  step: Step;
  triggerComparison: () => void;
}

export interface CompleteStepSizedProps extends BaseComponentProps {
  step: Step;
  triggerComparison: () => void;
}
