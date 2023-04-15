/**
 * A simple modal containing a canvas, displaying steps
 */

import { Canvas } from "components/canvas";
import { StepsModalProps } from "./types";
import { CompleteStep } from "components/steps/complete";
import { Step } from "utilities/classes/step";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";
import { useSteps } from "utilities/hooks/yc/useSteps";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useState } from "react";

export const StepsModal = ({
  style,
  className,
  parentStyle,
  utilityButtons,
  wrapperProps,
  strategy,
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
      strategy?.rootStep
        ? Step.fromDBStep({ step: strategy.rootStep.toJSON(), context })
        : null,
      strategy,
      context,
      {
        stateSetter: () => setDummyState(!dummyState),
      }
    );
  // Handler for resizing the nodes based on zoom
  const handleZoom = (zoom: number) => {
    if (zoom > 1.1)
      resizeAll(StepSizing.MEDIUM, DefaultDimensions[StepSizing.MEDIUM], false);
    else
      resizeAll(StepSizing.SMALL, DefaultDimensions[StepSizing.SMALL], false);
  };

  console.log(
    "Steps Modal ReRenderered!",
    stepsState.rootStep?.children[0].position
  );

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
        {stepsState.rootStep?.map<React.ReactNode>((step: Step) => {
          return (
            <CompleteStep
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
