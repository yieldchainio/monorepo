/**
 * Trigger builder for the automation trigger
 * @param root - Root of the tree
 * @return Trigger - Trigger Struct
 */
import { TriggerTypes } from "@yc/yc-models";
import { AbiCoder } from "ethers";
export function buildAutomationTrigger(root) {
    if (!root.data.automation)
        throw "Cannot Build Automation Trigger - Automation Field Undefined On Root";
    console.log("Root Data", root.data);
    const automationPayload = AbiCoder.defaultAbiCoder().encode(["uint256"], [root.data.automation.interval]);
    return {
        triggerType: BigInt(Object.values(TriggerTypes).indexOf(TriggerTypes.AUTOMATION)),
        extraData: automationPayload,
    };
}
//# sourceMappingURL=automation.js.map