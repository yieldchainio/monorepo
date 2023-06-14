/**
 * Types for the complete step components
 */

import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";
import { StepSizing } from "utilities/classes/step/types";

export interface StepProps extends BaseComponentProps {
  step: Step;
  triggerComparison: () => void;
  canvasID?: string;
}
