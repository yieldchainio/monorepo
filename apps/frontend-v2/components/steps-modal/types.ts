/**
 * types for the steps modal
 */

import { YCClassifications, YCStep, YCStrategy } from "@yc/yc-models";
import { CanvasProps } from "components/canvas/types";
import { BaseComponentProps } from "components/types";
import { RefObject } from "react";
import { Step } from "utilities/classes/step";
import { useStepsOptions } from "utilities/hooks/yc/useSteps/types";

// What the useSteps props expect
export interface useStepsProps {
  root?: Step | null;
  strategy?: YCStrategy;
  context?: YCClassifications;
}
export interface StepsModalProps extends CanvasProps, useStepsProps {
  wrapperProps?: BaseComponentProps;
  options?: useStepsOptions;
  comparisonCallback?: () => void;
  canvasID?: string;
  baseContainer?: React.ReactNode;
  baseContainerRef?: RefObject<HTMLElement | undefined | null> | null;
  baseRootStep?: Step | null;
  writeable?: boolean;
  seedContainerOnClick?: () => void;
}
