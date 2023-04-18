/**
 * A section for the buttons of a config
 */

import { StepProps } from "components/steps/types";
import { CancelButton } from "./cancel";
import { DoneButton } from "./done";

export const ActionConfigButtons = ({
  className,
  style,
  step,
  triggerComparison,
  canContinue,
}: StepProps & {
  canContinue?: true | string;
}) => {
  // Return the JSX
  return (
    <div
      className={
        "w-full flex flex-row gap-2 items-center" + " " + (className || "")
      }
      style={style}
    >
      <CancelButton step={step} triggerComparison={triggerComparison} />
      <DoneButton
        step={step}
        triggerComparison={triggerComparison}
        canContinue={canContinue}
      />
    </div>
  );
};
