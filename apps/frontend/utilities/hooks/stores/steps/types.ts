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
