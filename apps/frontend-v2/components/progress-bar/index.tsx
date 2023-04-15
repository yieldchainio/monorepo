/**
 * An incremental steps progress bar
 */

import { useMemo } from "react";
import { IncrementalProgressBarProps, ProgressStep } from "./types";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import WrappedImage from "components/wrappers/image";

export const IncrementalProgressBar = ({
  color,
  steps,
  className,
  style,
}: IncrementalProgressBarProps) => {
  return (
    <div
      className={
        "flex flex-row gap-1.5 items-center justify-center transition duration-200 ease-in-out" +
        " " +
        (className || "")
      }
      style={style}
    >
      {steps.map((step, i) => {
        return (
          <>
            {<ProgressStep color={color} step={step.progressStep} />}
            {i !== steps.length - 1 ? (
              <ProgressStepLine color={color} state={step.progressStep.state} />
            ) : null}
          </>
        );
      })}
    </div>
  );
};

/**
 * A Component for the circle of the step
 */

const ProgressStep = ({
  color,
  step,
}: {
  color: string;
  step: ProgressStep;
}) => {
  /**
   * Memoize classname
   */
  const className = useMemo(() => {
    if (step.state === "not_complete") return "bg-custom-dimmed";
    if (step.state === "active") return color + " " + "scale-[1.25]";
    return color;
  }, [color, step.state]);
  return (
    <InfoProvider contents={step.label} direction={ToolTipDirection.TOP}>
      <div
        className={
          "w-[24px] h-[24px] rounded-full flex flex-row items-center justify-center transition duration-200 ease-in-out p-[3px]" +
          " " +
          className
        }
      >
        {step.state === "active" && (
          <WrappedImage src={step.image} width={18} height={18} />
        )}
      </div>
    </InfoProvider>
  );
};

/**
 * A component for the line of the step
 */

const ProgressStepLine = ({
  color,
  state,
}: {
  color: string;
  state: "complete" | "not_complete" | "active";
}) => {
  /**
   * Memoize styles
   */
  const className = useMemo(() => {
    if (state === "complete") return color;
    return "bg-custom-dimmed";
  }, [state, color]);
  return (
    <div
      className={
        "h-[3px] w-[10%] transition duration-200 ease-in-out flex flex-row justify-start bg-custom-dimmed"
      }
    >
      <div className={"w-full h-full animate-fill" + " " + className}></div>
    </div>
  );
};
