/**
 * @notice
 * useSteps()
 * A custom store hook for manipulating steps trees data
 */

import { create } from "zustand";
import { Step } from "utilities/classes/step";
import { StepsStore, UseStepsActions } from "./types";
import { Dimensions, StepSizing } from "utilities/classes/step/types";
import { useEffect, useReducer, useRef } from "react";
import { useStepsReducer } from "./reducer";
import { YCClassifications, YCStrategy } from "@yc/yc-models";

/**
 * @notice
 * @hook useSteps()
 * used to store and manage a tree of @Step 's
 */
export const useSteps = (
  root: Step | null,
  strategy?: YCStrategy,
  context?: YCClassifications
) => {
  /**
   * The state
   */
  const [stepsState, dispatch] = useReducer(useStepsReducer, { rootStep: root });

  const prevState = useRef<{ rootStep: Step | null }>({ rootStep: null });

  // Initiating the step
  const initiated = useRef<boolean>(false);
  useEffect(() => {
    if (!initiated.current && context && strategy?.rootStep.children.length) {
      initiated.current = true;
      setRootStep(
        Step.fromDBStep({ step: strategy.rootStep.toJSON(), context })
      );
    }
  }, [strategy?.rootStep?.children?.length]);

  /**
   * Wrapping actions for ease
   */
  const setRootStep = (newRootStep: Step) => {
    prevState.current = { rootStep: stepsState.rootStep };
    dispatch({ type: UseStepsActions.SET_ROOT_STEP, rootStep: newRootStep });
  };
  const resizeAll = (
    newSize: StepSizing,
    newDimensions?: Dimensions,
    forceResize?: boolean
  ) => {
    prevState.current = { rootStep: stepsState.rootStep };

    dispatch({
      type: UseStepsActions.RESIZE_ALL,
      newSize: newSize,
      dimensions: newDimensions || null,
      forceResize: forceResize,
    });
  };
  const populatePositions = (
    baseNodeSizing: StepSizing,
    baseDimensions?: Dimensions
  ) => {
    prevState.current = { rootStep: stepsState.rootStep };

    dispatch({
      type: UseStepsActions.POPULATE_POSITIONS,
      baseNodeSizing,
      baseDimensions,
    });
  };
  const triggerComparison = () => {
    prevState.current = { rootStep: stepsState.rootStep };

    dispatch({ type: UseStepsActions.TRIGGER_COMPARISON });
  };

  return {
    stepsState,
    prevState,
    setRootStep,
    resizeAll,
    populatePositions,
    triggerComparison,
  };
};