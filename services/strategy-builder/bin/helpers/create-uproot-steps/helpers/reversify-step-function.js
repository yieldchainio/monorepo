/**
 * Reversify a step's function
 * @param step - The step to reversify
 */
import { YCClassifications } from "@yc/yc-models";
export function reversifyTreeFunctions(tree) {
    tree.map((step) => reversifyStepFunction(step));
}
export function reversifyStepFunction(step) {
    const reverseFunction = step.function?.counterFunction;
    if (!reverseFunction) {
        if (step.function?.outflows.length || 0 > 0)
            console.error("Cannot Build Uproot Strategy - Got a step w/o counter function, nor empty outflows whilst reverisfying. Step: ", step);
        // Left as is :)
        step.function = step.function;
        step.outflows = step.function?.outflows || [];
        step.inflows = step.function?.inflows || [];
    }
    else {
        const newArgs = step.function &&
            YCClassifications.getInstance().rawFunctions.find((func) => func.id == step.function?.id)?.copy_args
            ? step.function?.arguments
            : null;
        step.function = reverseFunction;
        if (newArgs)
            step.function.setArguments(newArgs);
        reversifyFlows(step);
    }
    step.action = step.function?.actions[0] || step.action;
}
function reversifyFlows(step) {
    const functionOutflows = step.function?.outflows || [];
    const functionInflows = step.function?.inflows || [];
    const stepOutflows = [...step.outflows];
    const stepInflows = [...step.inflows];
    if (functionOutflows.length == 0) {
        step.outflows = stepInflows;
    }
    if (functionInflows.length == 0) {
        step.inflows = stepOutflows;
    }
}
//# sourceMappingURL=reversify-step-function.js.map