/**
 * Constants for the trigger components
 */

import { JsxElement } from "typescript";
import { DepositTriggerToken } from "./components/visuals/deposit-token";
import { StepProps } from "../types";

export type TriggerVisual = ({
  step,
  triggerComparison,
}: StepProps) => JSX.Element;

/**
 * Mapping names => visual components. On a step, there is a data attribute - This constant
 * mapping is used to retreive the visual components of whatever the value of "visual" is under
 * "trigger"
 */

export const TRIGGER_NAMES_TO_COMPONENTS: Record<string, TriggerVisual> = {
  Deposit: DepositTriggerToken,
};
