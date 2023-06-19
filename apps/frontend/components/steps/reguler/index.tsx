/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing, StepType } from "utilities/classes/step/types";
import { StepProps } from "../types";
import { SmallCompleteStep } from "./complete/small";
import { MediumCompleteStep } from "./complete/medium";
import { forwardRef, useContext } from "react";
import { RegulerCompleteStep } from "./complete";
import { EmptyStep } from "../placeholder";
import { RegulerChooseAction } from "./initial";
import { ActionConfig } from "./config";
import { StepContext, useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const RegulerStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    /**
     * Switch case to return corresponding step component depending on state type
     */

    const { step } = useStepContext();

    switch (step.state) {
      case "empty":
        return <EmptyStep ref={ref} {...props} />;

      case "initial":
        return <RegulerChooseAction ref={ref} {...props} />;

      case "config":
        return <ActionConfig ref={ref} {...props} />;

      case "complete":
        return <RegulerCompleteStep ref={ref} {...props} />;
    }
  }
);
