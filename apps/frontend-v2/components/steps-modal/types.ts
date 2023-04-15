/**
 * types for the steps modal
 */

import { YCClassifications, YCStep, YCStrategy } from "@yc/yc-models";
import { CanvasProps } from "components/canvas/types";
import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";

// What the useSteps props expect
export interface useStepsProps {
  root?: YCStep | null;
  strategy?: YCStrategy;
  context?: YCClassifications;
}
export interface StepsModalProps extends CanvasProps, useStepsProps {
  wrapperProps?: BaseComponentProps;
}
