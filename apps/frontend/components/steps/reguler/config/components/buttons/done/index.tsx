/**
 * A generic implementation of the "Done" button on action configs
 */

import { YCToken } from "@yc/yc-models";
import GradientButton from "components/buttons/gradient";
import { InfoProvider } from "components/info-providers";
import { StepProps } from "components/steps/types";
import { changeStepState } from "components/steps/utils/handle-state-change";
import { useMemo } from "react";
import { Step } from "utilities/classes/step";
import { StepSizing } from "utilities/classes/step/types";

export const DoneButton = ({
  className,
  style,
  step,
  triggerComparison,
  canContinue = true,
  portal,
  handler,
}: StepProps & {
  canContinue?: true | string;
  portal?: HTMLElement;
  handler: () => void;
}) => {
  /**
   * Memoize The button to continue, based on whether it is enabled or not
   */

  const btnComponent = useMemo(() => {
    return canContinue === true ? (
      <GradientButton
        className=""
        style={{
          width: "30%",
          padding: step.size == StepSizing.SMALL ? "0.25rem" : undefined,
          ...style,
        }}
        onClick={() => {
          handler();
          changeStepState(step, "complete");

          triggerComparison();
        }}
      >
        {step.size == StepSizing.SMALL ? "+" : "Done"}
      </GradientButton>
    ) : (
      <InfoProvider contents={canContinue} portal={portal}>
        <div className="w-[30%] cursor-auto">
          <GradientButton
            className="opacity-40 pointer-events-none  "
            style={{
              width: "100%",
              padding: step.size == StepSizing.SMALL ? "0.25rem" : undefined,
              ...style,
            }}
            onClick={() => {
              handler();
              changeStepState(step, "complete");
              triggerComparison();
            }}
          >
            {step.size == StepSizing.SMALL ? "+" : "Done"}
          </GradientButton>
        </div>
      </InfoProvider>
    );
  }, [canContinue, handler]);

  // Return the JSX
  return btnComponent;
};
