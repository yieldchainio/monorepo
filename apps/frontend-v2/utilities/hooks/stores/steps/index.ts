/**
 * @notice
 * useSteps()
 * A custom store hook for manipulating steps trees data
 */

import { create } from "zustand";
import { Step } from "utilities/classes/step";
import { StepsStore } from "./types";
import { Dimensions, StepSizing } from "utilities/classes/step/types";

/**
 * @notice
 * @hook useSteps()
 * used to store global steps instances as a tree
 */

export const useSteps = (root: Step | null) => {
  return create<StepsStore>((set, get) => ({
    /**
     * The root step
     */
    rootStep: root,

    /**
     * triggerComparison
     * @notice
     * alot of the steps methods will be called on the step instance itself for:
     *
     * 1) Ease of use - it's much more object-oriented to just do ``myStep.addChild(new Step())`` than do:
     * stepsStore.addChild(myStep.id, new Step()).
     *
     * 2) Its much more efficient - if we were to implement this function on the store itself, we would need to do an entire
     * tree iteration each time we would like to add a child (aka ```rootStep.find((step) => step.id === _stepId...)```).
     * whilst with a manual manipulation you access the node directly.
     *
     * And therefore, this function will be used to make a state change and trigger a comparison for it's users, which will
     * rerender whatever they need with the new state
     */

    triggerComparison: () => {
      set((state) => ({ rootStep: get().rootStep }));
    },

    /**
     * resizeAll
     * @param newSize - a StepSizing field for the enumerable size to set (This will not override manually-resized nodes)
     * @param dimensions - the dimensions to input (Optional)
     * @param forceResize - if specified to true, will forcefully resize all of the steps as if it was a manual resize
     */
    resizeAll: (
      newSize: StepSizing,
      dimensions?: Dimensions | null,
      forceResize: boolean = false
    ) => {
      // Do a .each iteration and resize with provided parameters
      get().rootStep?.each((step: Step) =>
        step.resize(newSize, dimensions, forceResize)
      );
    },

    /**
     * populatePositions
     * @uses .graph() on the root step instance,
     * which @uses D3 to populate x & y positions on the instances to draw a tree
     *
     * @param baseNodeSize - StepSizing enumerable proprety to decide the base sizing for the nodes (if they don't have one already, so like
     * a default sizing)
     * @param baseDimensions - Optional, manual width & height dimensions if the default ones do not fit the component's requirments.
     */
    populatePositions: (
      baseNodeSize: StepSizing,
      baseDimensions?: Dimensions
    ) => {
      get().rootStep?.graph(baseNodeSize, baseDimensions);
    },

    /**
     * setRootStep
     * @notice
     *
     * Set the root step to some step.
     *
     * Since the rootStep can be initiated to null, this may be required.
     */
    setRootStep: (newRootStep: Step) => {
      set((state) => ({
        rootStep: newRootStep,
      }));
    },
  }));
};
