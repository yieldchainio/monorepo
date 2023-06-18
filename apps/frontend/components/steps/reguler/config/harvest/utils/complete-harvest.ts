/**
 * Finallize the harvest configuration
 */

import { YCClassifications, YCFunc, YCProtocol } from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { HarvestData } from "../types";
import { changeStepState } from "components/steps/utils/handle-state-change";

export function completeHarvest(step: Step) {
  // Shorthand for the data
  const data = step.data?.harvest as HarvestData;

  // Assert that the harvest function must be chosen
  if (!data.func)
    throw "Cannot Complete Harvest - You Did Not Choose A Position!";

  const func = new YCFunc(data.func, YCClassifications.getInstance());

  // Assert that the protocol must exist
  if (!func.address?.protocol)
    throw "Cannot Complete Harvest - Protocol Is Non-Existant.";

  // Set the step's function to it
  if (step.function?.id !== func.id) {
    const customArgs = step.customArguments;
    step.setFunction(func);
    step.customArguments = customArgs;
  }

  // Set the protocol
  step.protocol = func.address.protocol;

  // Clean it from the parent's "unlockedFunctions", if it's there
  if (step.parent?.unlockedFunctions)
    step.parent.unlockedFunctions = step.parent.unlockedFunctions.map(
      (_func) => {
        if (_func.func.id === func.id)
          return {
            func: _func.func,
            used: true,
            customArgs: _func.customArgs,
          };

        return _func;
      }
    );

  // Set step's state to complete (Assuming we may be called by internal funcs directly,
  // without the complete button - it may not be done automatically)
  changeStepState(step, "complete");

  return;
}
