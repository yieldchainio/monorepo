/**
 * @notice
 * useSteps()
 * A custom store hook for manipulating steps trees data
 */

import { Step } from "utilities/classes/step";
import { UseStepsActions } from "./types";
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
  options?: {
    stateSetter: () => void;
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
   */
  const initiated = useRef<boolean>(false);
  useEffect(() => {
    if (!initiated.current && context && strategy?.rootStep.children.length) {
      initiated.current = true;
      console.log("Im Running HTe initiation useEffect mister");
      setRootStep(
        Step.fromDBStep({ step: strategy.rootStep.toJSON(), context })
      );
      triggerComparison();
      options?.stateSetter?.();
    }
  }, [strategy?.rootStep?.children?.length]);

  /**
   * A useEffect that triggers the ``graph()`` function on our tree when it should.
   * Also, sets the canvas dimensions (the function's return value)
   */
  useEffect(() => {
    console.log("UseEffect Should graph rerender");
    if (stepsState.rootStep) {
      console.log("Gonna Run Graph");
      setCanvasDimensions(stepsState.rootStep.graph(StepSizing.SMALL));
      triggerComparison();
    } else {
      console.log("Step state root step is undefined!", stepsState.rootStep);
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
