/**
 * Trigger builder for the automation trigger
 * @param root - Root of the tree
 * @return Trigger - Trigger Struct
 */

import { Trigger, TriggerTypes, YCStep } from "@yc/yc-models";
import { AbiCoder } from "ethers";

export function buildAutomationTrigger(root: YCStep): Trigger {
  if (!root.data.automation)
    throw "Cannot Build Automation Trigger - Automation Field Undefined On Root";

  const automationPayload = AbiCoder.defaultAbiCoder().encode(
    ["uint256"],
    [root.data.automation.interval]
  );

  return {
    triggerType: TriggerTypes.AUTOMATION,
    extraData: automationPayload,
  };
}
