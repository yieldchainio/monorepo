/**
 * A section for the buttons of a config
 */

import { StepProps } from "components/steps/types";
import { CancelButton } from "./cancel";
import { DoneButton } from "./done";
import { useMemo } from "react";
import { StepSizing } from "utilities/classes/step/types";

export const ActionConfigButtons = ({
  className,
  style,
  step,
  triggerComparison,
  canContinue,
  portal,
  handleComplete,
}: StepProps & {
  canContinue?: true | string;
  portal?: HTMLElement;
  handleComplete: () => void;
}) => {
  /**
   * Memo some styling
   */
  const memoStyle = useMemo(
    () =>
      step.size === StepSizing.SMALL
        ? {
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
          }
        : {
            width: "100%",
            marginTop: "auto",
          },
    []
  );
  // Return the JSX
  return (
    <div
      className={
        "self-start w-full flex flex-row gap-2 items-center" +
        " " +
        (className || "")
      }
      style={{ ...memoStyle, ...style }}
    >
      <CancelButton step={step} triggerComparison={triggerComparison} />
      <DoneButton
        step={step}
        triggerComparison={triggerComparison}
        canContinue={canContinue}
        portal={portal}
        handler={handleComplete}
      />
    </div>
  );
};
