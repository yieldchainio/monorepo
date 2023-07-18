/**
 * A simple incrmeneal step progress bar
 */

import { useMemo } from "react";
import { IncrementalProgressBarProps } from "./types";
import { InfoProvider } from "components/info-providers";
import { ToolTipDirection } from "components/info-providers/types";
import WrappedImage from "components/wrappers/image";
import { BaseComponentProps } from "components/types";

export const SimpleIncrementalStepBar = ({
  color = "blue",
  steps,
  className,
  style,
  activeIdx,
  size
}: {
  color?: string;
  steps: Array<string>;
  activeIdx: number;
  size?: `${number}px`
} & BaseComponentProps) => {
  return (
    <div
      className={
        "flex flex-row gap-1.5 items-center justify-center transition duration-200 ease-in-out w-full" +
        " " +
        (className || "")
      }
      style={style}
    >
      {steps.map((stepTitle: string, i: number) => {
        return (
          <>
            {
              <ProgressStep
                color={color}
                step={{
                  status:
                    activeIdx == i
                      ? "active"
                      : activeIdx > i
                      ? "complete"
                      : "not_complete",

                  label: stepTitle,
                }}
                key={i.toString()}
                size={size}
              />
            }
            {i !== steps.length - 1 ? (
              <ProgressStepLine
                color={color}
                state={
                  activeIdx == i
                    ? "active"
                    : activeIdx > i
                    ? "complete"
                    : "not_complete"
                }
                key={`${i}_line`}
              />
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
  size = `24px`,
}: {
  color: string;
  step: { status: "active" | "complete" | "not_complete"; label: string };
  size?: `${number}px`;
}) => {
  /**
   * Memoize classname
   */
  const className = useMemo(() => {
    if (step.status === "not_complete") return "bg-custom-dimmed";
    if (step.status === "active") return color + " " + "scale-[1.25]";
    return color;
  }, [color, step.status]);
  return (
    <InfoProvider contents={step.label} direction={ToolTipDirection.TOP}>
      <div
        className={
          "rounded-full flex flex-row items-center justify-center transition duration-200 ease-in-out p-[3px]" +
          " " +
          className
        }
        style={{
          width: size,
          height: size,
        }}
      ></div>
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
