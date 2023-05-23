/**
 * Map TriggerType enum => Builder
 */
import { TriggerTypes } from "@yc/yc-models";
import { buildAutomationTrigger } from "./builders/automation.js";
const unsupportedTrigger = (step) => {
    throw "Unsupported Trigger" + step.triggerType;
};
export const TRIGGER_BUILDERS = {
    [TriggerTypes.AUTOMATION]: buildAutomationTrigger,
    [TriggerTypes.DEPOSIT]: unsupportedTrigger,
    [TriggerTypes.WITHDRAWAL]: unsupportedTrigger,
};
//# sourceMappingURL=constants.js.map