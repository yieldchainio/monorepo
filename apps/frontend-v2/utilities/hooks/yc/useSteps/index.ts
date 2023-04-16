/**
 * @notice
 * useSteps()
 * A custom store hook for manipulating steps trees data
 */

import { Step } from "utilities/classes/step";
import { UseStepsActions, useStepsOptions } from "./types";
import { Dimensions, StepSizing } from "utilities/classes/step/types";
import { useEffect, useReducer, useRef, useState } from "react";
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
  context?: YCClassifications,
  options: useStepsOptions = {
    initialSize: StepSizing.MEDIUM,
    comparisonCallback: () => null,
  }
) => {
  /**
   * The state
   */
  const [stepsState, dispatch] = useReducer(useStepsReducer, {
    rootStep: root,
  });

  /**
   * State for canvas sizing
   */
  const [canvasDimensions, setCanvasDimensions] = useState<
    undefined | [number, number]
  >();

  // Keeping track of the previous state for comparison reasons (rerender effiency)
  const prevState = useRef<{ rootStep: Step | null }>({ rootStep: null });

  /**
   * If a strategy was provided, we initiate the root step to a new Step instance,
   * using it's root YCStep and the global context.
   *
   * Otherwise, we set initiated to true (if a root step is already existant)
   */
  const initiated = useRef<boolean>(false);
  useEffect(() => {
    if (!stepsState.rootStep) {
      if (context && strategy?.rootStep.children.length) {
        setRootStep(
          Step.fromDBStep({
            step: strategy.rootStep.toJSON(),
            context,
            iStepConfigs: { size: options.initialSize },
          })
        );
        initiated.current = true;
      }
    } else {
      initiated.current = true;
    }
  }, [strategy?.rootStep?.children?.length]);

  /**
   * A useEffect that triggers the ``graph()`` function on our tree when it should.
   * Also, sets the canvas dimensions (the function's return value)
   */
  useEffect(() => {
    if (stepsState.rootStep) {
      populatePositions;
      setCanvasDimensions(
        stepsState.rootStep.graph(
          stepsState.rootStep.size || options.initialSize || StepSizing.SMALL
        )
      );
      triggerComparison();
      options.comparisonCallback?.();
    }
  }, [JSON.stringify(stepsState.rootStep?.toJSON(false))]);

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
    canvasDimensions,
    prevState,
    setRootStep,
    resizeAll,
    populatePositions,
    triggerComparison,
  };
};
