/**
 * Reversify a step's function
 * @param step - The step to reversify
 */

import { YCArgument, YCClassifications, YCStep } from "@yc/yc-models";

export function reversifyTreeFunctions(tree: YCStep) {
  tree.map((step) => reversifyStepFunction(step));
}

export function reversifyStepFunction(step: YCStep) {
  const reverseFunction = step.function?.counterFunction;
  if (!reverseFunction) {
    if (step.function?.outflows.length || 0 > 0)
      console.error(
        "Cannot Build Uproot Strategy - Got a step w/o counter function, nor empty outflows whilst reverisfying. Step: ",
        step
      );

    // Left as is :)
    step.function = step.function;
  } else {
    const newArgs: YCArgument[] | null =
      step.function &&
      YCClassifications.getInstance().rawFunctions.find(
        (func) => func.id == step.function?.id
      )?.copy_args
        ? step.function?.arguments
        : null;

    step.function = reverseFunction;
    if (newArgs) step.function.setArguments(newArgs);
  }

  step.action = step.function?.actions[0] || step.action;

  step.outflows = step.function?.outflows || [];
  step.inflows = step.function?.inflows || [];
}
