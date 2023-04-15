/**
 * Types for the step options hook
 *
 * @param step - The Step instance that we go off off
 *
 * all others are booleans that can enforce to NOT use any of them even if condition is true
 */

import { Step } from "utilities/classes/step";

export interface UseStepOptionsProps {
  step: Step;
  expand?: boolean;
  deleteAble?: boolean;
  edit?: boolean;
  minimize?: boolean;
}
