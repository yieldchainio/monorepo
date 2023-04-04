import { Step } from "utilities/classes/step";
import { Dimensions, StepSizing } from "utilities/classes/step/types";

// The interface for the global store, which stores mapped IDs to StepsStores
export interface StepsStore {
  rootStep: Step;
  addChild: (stepID: string, child: Step) => void;
  removeChild: (childID: string) => void;
  resizeAll: (newSize: StepSizing, dimensions?: Dimensions | null) => void;
  populatePositions: (baseDimensions: Dimensions) => void;
  
}
