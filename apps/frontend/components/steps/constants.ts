/**
 * All step-related constants consumed by the app
 */

import { StepState, StepType } from "utilities/classes/step/types";

/**
 * The config object of a deposit trigger
 */

export const DEPOSIT_TRIGGER_CONFIG = {
  type: StepType.TRIGGER,
  state: "complete" as StepState,
  triggerType: "Deposit",
  triggerDescription: "When A Vault Deposit Happens",
  triggerIcon: {
    dark: "/icons/deposit-light.svg",
    light: "/icons/deposit-dark.svg",
  },
};
