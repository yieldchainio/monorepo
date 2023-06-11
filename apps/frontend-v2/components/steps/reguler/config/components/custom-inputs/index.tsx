/**
 * @notice Component to accpet custom function arguments from the user
 * in a friendly and abstracted manner
 */

import { CustomArgumentsProps } from "./types";

import { StepSizing } from "utilities/classes/step/types";
import WrappedText from "components/wrappers/text";
import { SingleCustomInput } from "./components/custom-input";

export const CustomArgumentInputs = ({
  style,
  step,
  triggerComparison,
  className,
  ...props
}: CustomArgumentsProps) => {
  return (
    <div
      className={
        "absolute flex flex-col items-start justify-start w-[327px] px-8 py-6 gap-0 bg-custom-bcomponentbg shadow-sm rounded-xl border-[1px] border-custom-themedBorder transition duration-200 ease-in-out animate-stepPopup" +
        " " +
        (className || "")
      }
      style={style}
      {...props}
    >
      <div className="flex flex-col items-start justify-start gap-0.5">
        <WrappedText fontSize={16}>Additional Inputs</WrappedText>
        <WrappedText fontSize={10} className="text-opacity-50">
          This Step Requires Some Additional Inputs
        </WrappedText>
      </div>
      <div className="w-full h-full flex flex-col gap-3">
        {step.function?.arguments
          .filter(
            (arg, idx) =>
              arg.isCustom && !step.presetCustomArgsIndices.includes(idx)
          )
          .map((arg, argIdx) => {
            console.log("Step", step.presetCustomArgsIndices);
            return (
              <div className="flex flex-col gap-0 items-start">
                <WrappedText>{arg.name}</WrappedText>
                <WrappedText
                  fontSize={10}
                  className="text-opacity-50 whitespace-pre-wrap"
                >
                  {arg.devNotes}
                </WrappedText>
                <SingleCustomInput
                  argumentType={arg.solidityType}
                  setValue={(value: any) => {
                    step.setCustomArg(argIdx, value);
                    triggerComparison();
                  }}
                  value={step.customArguments[argIdx]}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
