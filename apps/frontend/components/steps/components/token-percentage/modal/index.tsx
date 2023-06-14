/**
 * A tooltip modal allowing the user to edit a step's inflow percentages
 */

import { InfoProvider } from "components/info-providers";
import { StepProps } from "components/steps/types";
import WrappedImage from "components/wrappers/image";
import WrappedInput from "components/wrappers/input";
import WrappedText from "components/wrappers/text";
import { forwardRef } from "react";
import { useDropdownEvent } from "utilities/hooks/general/useDropdownEvent";

/* eslint-disable react/display-name */
export const TokenPercentageModal = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    return (
      <div
        className="cursor-default overflow-hidden absolute h-[220px] w-[200px] flex flex-col bg-custom-componentbg rounded-md border-[1px] border-custom-themedBorder shadow-md py-4 px-4 gap-6 z-[1000]"
        style={style}
      >
        <div className="flex flex-row items-center justify-start w-full">
          <WrappedText>Edit Distribution</WrappedText>
        </div>
        <div className="flex flex-col w-full h-full overflow-scroll scrollbar-hide gap-2">
          {step.outflows.map((token, i) => {
            // Get the current percentage from the step's mapping
            const currPercentage = step.tokenPercentages.get(token.id);

            // Assert that it must be defined if it is an outflow
            if (!currPercentage)
              throw (
                "Token Percentage Modal ERR: Outflow Does Not Have Current Percentage! Token ID: " +
                token.id
              );

            // Get the available percentage
            const { available, even } = step.parent?.availableAndEvenPercentage(
              token,
              [],
              step.id
            ) || {
              available: null,
            };

            if (!available)
              throw (
                "Token Percnetage Modal ERR: Available Percentage Is Falsy. Token ID: " +
                token.id
              );

            return (
              <div
                className="flex flex-row items-center justify-between"
                key={`${i}_${token.id}`}
              >
                <div className="flex flex-row items-center gap-[0.35rem] ">
                  <WrappedImage
                    src={token.logo}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <WrappedText className="leading-none">
                    {token.symbol + " :"}
                  </WrappedText>
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <WrappedInput
                    style={{
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      backgroundColor: "var(--subbg)",
                      paddingLeft: "8px",
                    }}
                    width="w-[50px]"
                    showGlass={false}
                    type="number"
                    placeholder={even.toString()}
                    onChange={(e) => {
                      step.editTokenPercentage(
                        token,
                        parseFloat(e.target.value)
                      );
                    }}
                    defaultValue={step.tokenPercentages
                      .get(token.id)
                      ?.percentage?.toString()}
                    max={available}
                    min={0.1}
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
