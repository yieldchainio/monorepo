/**
 * Finallize the harvest configuration
 */

import { YCClassifications, YCProtocol } from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { HarvestData } from "../types";

export const completeHarvest = (step: Step) => {
  // Shorthand for the data
  const data = step.data?.harvest as HarvestData;

  // Assert that the harvest function must be chosen
  if (!data.func)
    throw "Cannot Complete Harvest - You Did Not Choose A Position!";

  // Assert that the protocol must exist
  if (!data.func.address?.protocol)
    throw "Cannot Complete Harvest - Protocol Is Non-Existant.";

  // Set the step's function to it
  step.function = data.func;

  // Set the protocol
  step.protocol = data.func.address.protocol;

  // Clean it from the parent's "unlockedFunctions", if it's there
  if (step.parent?.unlockedFunctions)
    step.parent.unlockedFunctions = step.parent.unlockedFunctions.map(
      (func) => {
        if (func.func.id === data.func?.id)
          return {
            func: func.func,
            used: true,
          };

        return func;
      }
    );

  // Set step's state to complete (Assuming we may be called by internal funcs directly,
  // without the complete button - it may not be done automatically)
  step.state = "complete";

  return;
};
