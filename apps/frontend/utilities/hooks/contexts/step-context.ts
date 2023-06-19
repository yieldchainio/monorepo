import { CSSProperties, createContext, useContext } from "react";
import { Step } from "utilities/classes/step";
export const StepContext = createContext<{
  step: Step;
  triggerComparison: () => void;
  style?: CSSProperties;
}>({
  step: new Step(),
  triggerComparison: () => {},
  style: {},
});


export const useStepContext = () => {
  const stepContext = useContext(StepContext)
  return stepContext
}