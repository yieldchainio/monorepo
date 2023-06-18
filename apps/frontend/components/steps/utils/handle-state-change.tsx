/**
 * Handle a step state change
 */

import { YCToken } from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { useLogs } from "utilities/hooks/stores/logger";
import { useModals } from "utilities/hooks/stores/modal";
import { EnsureDroppedChildren } from "../components/modals/ensure-intents/ensure-dropped-children";
import { StepState } from "utilities/classes/step/types";

export function changeStepState(step: Step, newState: StepState) {
  const { unavailableOutflows, droppedChildren } =
    step.simulateSetState(newState);

  if (unavailableOutflows.length)
    handleInvalidOutflowCompliance(unavailableOutflows);

  if (droppedChildren.length)
    handleInvalidDroppedChildren(droppedChildren, step, newState);

  if (!droppedChildren.length && !unavailableOutflows.length)
    step.setState(newState);
}

/**
 * Push a confirmation modal to ensure user wants to chagne state,
 * even with dropped children
 */
function handleInvalidDroppedChildren(
  childrenToDrop: Step[],
  step: Step,
  newState: StepState
) {
  const modals = useModals.getState();
  modals.lazyPush(
    <EnsureDroppedChildren
      childrenToDrop={childrenToDrop}
      newState={newState}
      step={step}
    />
  );
}

/**
 * Throw an error if a step cannot be completed due to missing inflows
 * in it's parent step to it's outflows
 */
function handleInvalidOutflowCompliance(unavailableOutflows: YCToken[]) {
  const logs = useLogs.getState();
  logs.throwError(
    "Invalid Step - Unavailable flows:" +
      unavailableOutflows.map((token, i) => (i == 0 ? "" : ", ") + token.symbol)
  );
}
