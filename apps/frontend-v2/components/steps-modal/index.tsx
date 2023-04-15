/**
 * A simple modal containing a canvas, displaying steps
 */

import { Canvas } from "components/canvas";
import { StepsModalProps } from "./types";
import { Step } from "utilities/classes/step";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";
import { useSteps } from "utilities/hooks/yc/useSteps";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useMemo, useState } from "react";
import { HeadStep } from "components/steps";

export const StepsModal = ({
  style,
  className,
  parentStyle,
  utilityButtons,
  wrapperProps,
  strategy,
  options,
  root,
  ...props
}: StepsModalProps) => {
  /**
   * We get the global context instance from the store, to pass onto the useSteps hook
   */
  const context = useYCStore((state) => state.context);

  /**
   * Some Dummy State to trigger a comparison on graphs
   */
  const [dummyState, setDummyState] = useState<boolean>(false);

  /**
   * We instantiate the useSteps hook with the provided root step, and the optional strategy & context.
   *
   * The useSteps hook orchestrates the state management of the steps tree, auto-graphs them on state
   * changes and provides us with utility functions.
   *
   * A strategy & context may be optionally provided if this is a ready strategy that is looking to display
   * it's steps, but the strategy hasnt loaded yet - So the hook will handle getting it's root step into
   * a Step instance.
   */
  const { stepsState, canvasDimensions, resizeAll, triggerComparison } =
    useSteps(
      root
        ? root
        : strategy?.rootStep
        ? Step.fromDBStep({
            step: strategy.rootStep.toJSON(),
            context,
            iStepConfigs: { size: options?.initialSize },
          })
        : null,
      strategy,
      context,
      {
        stateSetter: () => setDummyState(!dummyState),
        ...(options || {}),
      }
    );
  // Handler for resizing the nodes based on zoom
  const handleZoom = (zoom: number) => {
    if (zoom > 1.1)
      resizeAll(StepSizing.MEDIUM, DefaultDimensions[StepSizing.MEDIUM], false);
    else
      resizeAll(StepSizing.SMALL, DefaultDimensions[StepSizing.SMALL], false);
  };

  // Root step (memoized)
  const rootStep = useMemo(() => {
    console.log("Returning This Rootstep from memo: ", stepsState.rootStep);
    return stepsState.rootStep;
  }, [
    // stepsState,
    stepsState.rootStep,
    // JSON.stringify(stepsState.rootStep?.toJSON()),
  ]);

  return (
    <div
      className="w-full z-[-1] mx-auto"
      onClick={props.onClick}
      {...wrapperProps}
    >
      <Canvas
        size={canvasDimensions}
        childrenWrapper={<div className="relative w-max h-max mx-auto"></div>}
        style={style}
        className={className}
        parentStyle={parentStyle}
        utilityButtons={utilityButtons}
        setters={{
          zoom: handleZoom,
        }}
      >
        {rootStep?.map<React.ReactNode>((step: Step) => {
          return (
            <HeadStep
              step={step}
              style={{
                left: step.position.x,
                top: step.position.y,
                marginLeft: "auto",
                marginRight: "auto",
                transform: "translateX(-50%)",
              }}
              key={step.id}
              triggerComparison={triggerComparison}
            />
          );
        })}
      </Canvas>
    </div>
  );
};
