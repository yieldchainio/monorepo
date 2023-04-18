/**
 * A generic implementation of the "Done" button on action configs
 */

import GradientButton from "components/buttons/gradient";
import { InfoProvider } from "components/info-providers";
import { StepProps } from "components/steps/types";
import { useMemo } from "react";
import { StepSizing } from "utilities/classes/step/types";

export const DoneButton = ({
  className,
  style,
  step,
  triggerComparison,
  canContinue = true,
}: StepProps & {
  canContinue?: true | string;
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
          step.state = "complete";
          triggerComparison();
        }}
      >
        {step.size == StepSizing.SMALL ? "+" : "Done"}
      </GradientButton>
    ) : (
      <InfoProvider contents={canContinue}>
        <div className="w-[30%] cursor-auto">
          <GradientButton
            className="opacity-40 pointer-events-none  "
            style={{
              width: "100%",
              padding: step.size == StepSizing.SMALL ? "0.25rem" : undefined,
              ...style,
            }}
            onClick={() => {
              step.state = "complete";
              triggerComparison();
            }}
          >
            {step.size == StepSizing.SMALL ? "+" : "Done"}
          </GradientButton>
        </div>
      </InfoProvider>
    );
  }, [canContinue]);

  // Return the JSX
  return btnComponent;
};
