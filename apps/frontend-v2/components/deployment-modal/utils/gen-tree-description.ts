/**
 * getStepsTreeDescription
 * Returns a verbal description of a tree of Step instances
 */

import { Step } from "utilities/classes/step";
import { StepType } from "utilities/classes/step/types";
import { FlowDirection } from "@prisma/client";
import { YCToken } from "@yc/yc-models";
import { HARVEST_ID } from "components/steps/reguler/constants";

export const getStepsTreeDescription = (
  seedRootStep: Step,
  treeRootStep: Step
) => {
  const seedDescription = seedRootStep
    .map((step) => {
      switch (step.type) {
        case StepType.TRIGGER:
          return getTriggerDescription(step);

        case StepType.STEP:
          return getActionDescription(step);

        default:
          return "";
      }
    })
    .join("");

  const treeDescription = treeRootStep
    .map((step) => {
      switch (step.type) {
        case StepType.TRIGGER:
          return getTriggerDescription(step);

        case StepType.STEP:
          return getActionDescription(step);

        default:
          return "";
      }
    })
    .join("");

  return [seedDescription, treeDescription];
};

// ==============
//    HELPERS
// ==============

// Map tokens to list of token symbols
const stringifyFlows = (flows: YCToken[]) =>
  flows
    .map((token) => token.symbol)
    .join(", ");

/**
 * Per action description getters
 */

const ACTION_IDS_TO_DESCRIPTORS: Record<string, (step: Step) => string> = {
  "dc5c5c0a-e594-4974-8a46-829a76a95fa7": (step: Step) =>
    `Harvest ${stringifyFlows(step.inflows)} From ${stringifyFlows(
      step.function?.dependencyFunction?.outflows || []
    )} Position On ${step.protocol?.name}. `,

  "62bb7a58-6e0c-4b11-90ce-d416bd3dd10f": (step: Step) =>
    `Stake ${stringifyFlows(step.outflows)} On ${
      step.protocol?.name
    }, Get ${stringifyFlows(step.inflows)}. `,

  "1fd39f5f-d1f0-40f8-afe1-58dd4eb815bf": (step: Step) =>
    `LP ${stringifyFlows(step.outflows)} On ${
      step.protocol?.name
    }, Get ${stringifyFlows(step.inflows)}. `,

  "c947f5bf-004f-40e6-b859-dd28c7fac0b0": (step: Step) =>
    `Swap ${stringifyFlows(step.outflows)} For ${stringifyFlows(
      step.inflows
    )}. `,
};

const getTriggerDescription = (step: Step) => {
  return `On ${step.triggerName}, `;
};

const getActionDescription = (step: Step) => {
  return step.action?.id
    ? ACTION_IDS_TO_DESCRIPTORS[step.action?.id](step)
    : "";
};
