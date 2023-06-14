/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing, StepType } from "utilities/classes/step/types";
import { StepProps } from "../types";
import { SmallCompleteStep } from "./complete/small";
import { MediumCompleteStep } from "./complete/medium";
import { forwardRef } from "react";
import { RegulerCompleteStep } from "./complete";
import { EmptyStep } from "../placeholder";
import { RegulerChooseAction } from "./initial";
import { ActionConfig } from "./config";

/* eslint-disable react/display-name */
export const RegulerStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, triggerComparison, style, canvasID, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding step component depending on state type
     */

    switch (step.state) {
      case "empty":
        return (
          <EmptyStep
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );

      case "initial":
        return (
          <RegulerChooseAction
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );

      case "config":
        return (
          <ActionConfig
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );

      case "complete":
        return (
          <RegulerCompleteStep
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );
    }
  }
);
