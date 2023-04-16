import { Step } from "utilities/classes/step";
import { Dimensions, StepSizing } from "utilities/classes/step/types";

// The interface for the global store, which stores mapped IDs to StepsStores
export interface StepsStore {
  rootStep: Step | null;
  triggerComparison: () => void;
  resizeAll: (
    newSize: StepSizing,
    dimensions?: Dimensions | null,
    forceResize?: boolean
  ) => void;
  populatePositions: (
    baseNodeSizing: StepSizing,
    baseDimensions?: Dimensions
  ) => void;
  setRootStep: (newRootStep: Step) => void;
}

export enum UseStepsActions {
  TRIGGER_COMPARISON = "trigger_comparison",
  RESIZE_ALL = "resize_all",
  POPULATE_POSITIONS = "populate_positions",
  SET_ROOT_STEP = "set_root_step",
}

export type BaseActionPayload = { type: UseStepsActions };
export type UseStepsActionsPayloads =
  | { type: UseStepsActions.SET_ROOT_STEP; rootStep: Step }
  | { type: UseStepsActions.TRIGGER_COMPARISON }
  | {
      type: UseStepsActions.POPULATE_POSITIONS;
      baseNodeSizing: StepSizing;
      baseDimensions?: Dimensions;
    }
  | {
      type: UseStepsActions.RESIZE_ALL;
      newSize: StepSizing;
      dimensions?: Dimensions | null;
      forceResize?: boolean;
    };

export interface useStepsOptions {
  stateSetter?: () => void;
  initialSize?: StepSizing;
  comparisonCallback?: () => void;
}
