/**
 * A tooltip modal allowing the user to edit a step's inflow percentages
 */

import { InfoProvider } from "components/info-providers";
import { StepProps } from "components/steps/types";
import WrappedImage from "components/wrappers/image";
import WrappedInput from "components/wrappers/input";
import WrappedText from "components/wrappers/text";
import { forwardRef } from "react";

export const TokenPercentageModal = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    return (
      <div className="w-[120px] h-[180px]flex flex-col bg-custom-componentbg rounded-md border-[1px] border-custom-themedBorder py-4 px-4 gap-6">
        <div className="flex flex-row items-center justify-start w-full">
          <WrappedText>Edit Distribution</WrappedText>
        </div>
        <div className="flex flex-col w-full h-full overflow-scroll scrollbar-hide">
          {step.outflows.map((token) => {
            // Get the current percentage from the step's mapping
            const currPercentage = step.tokenPercentages.get(token.id);

            // Assert that it must be defined if it is an outflow
            if (!currPercentage)
              throw (
                "Token Percentage Modal ERR: Outflow Does Not Have Current Percentage! Token ID: " +
                token.id
              );

            // Get the available percentage
            const { available } = step.parent?.availableAndEvenPercentage(
              token
            ) || { available: null };

            if (!available)
              throw (
                "Token Percnetage Modal ERR: Available Percentage Is Falsy. Token ID: " +
                token.id
              );

            return (
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <WrappedImage src={token.logo} width={20} height={20} />
                  <WrappedText>{token.symbol}</WrappedText>
                </div>
                <div className="flex flex-row items-center justify-start">
                  <WrappedInput
                    type="number"
                    style={{
                      width: "50%",
                    }}
                  ></WrappedInput>
                  <WrappedText>{"/ " + available.toString()}</WrappedText>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
