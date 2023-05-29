/**
 * Build the triggers array input
 * @param treeRoot - The tree of the strategy
 * @return Trigger[]
 */
import { TRIGGER_BUILDERS } from "./constants.js";
export function buildTriggers(treeRoot) {
    const triggers = [];
    if (!treeRoot.triggerType)
        throw "Cannot Build Triggers - Root Has No Trigger Type Defined. Trigger Type: " + treeRoot.triggerType;
    const rootTrigger = TRIGGER_BUILDERS[treeRoot.triggerType](treeRoot);
    triggers[0] = rootTrigger;
    return triggers;
}
//# sourceMappingURL=index.js.map