/**
 * A simple modal containing a canvas, displaying steps
 */

import { Canvas } from "components/canvas";
import { StepsModalProps } from "./types";
import { CompleteStep } from "components/steps/complete";
import { Step } from "utilities/classes/step";

export const StepsModal = ({
  canvasDimensions,
  rootStep,
  style,
  className,
  parentStyle,
  utilityButtons,
  wrapperProps,
  ...props
}: StepsModalProps) => {
  return (
    <div className="w-full z-[-1] mx-auto" onClick={props.onClick} {...wrapperProps}>
      <Canvas
        size={canvasDimensions}
        childrenWrapper={<div className="relative w-max h-max mx-auto"></div>}
        style={style}
        className={className}
        parentStyle={parentStyle}
        utilityButtons={utilityButtons}
      >
        {rootStep?.map<React.ReactNode>((step: Step) => {
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
            />
          );
        })}
      </Canvas>
    </div>
  );
};
