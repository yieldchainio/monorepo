/**
 * @notice
 * A base node component used by all others as the main div,
 *
 * it is pretty generic, letting you to customize some stuff about it's size and etc.
 *
 * Main benefit here is not anything about step resizing or anything like that (It's managed
 * by the consumer, not us - we are just a plain css & html div), but rather adding universe
 * functionallity.
 *
 * Like (conditionally-added) child adders, and etc.
 */

import { BaseComponentProps } from "components/types";
import { forwardRef, useCallback, useEffect } from "react";
import { StepProps } from "components/steps/types";
import {
  DefaultDimensions,
  StepSizing,
  StepType,
} from "utilities/classes/step/types";
import { PlusCircle } from "../plus-circle";
import { InfoProvider } from "components/info-providers";
import { Step } from "utilities/classes/step";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";

export const BaseNode = forwardRef<
  HTMLDivElement,
  StepProps & {
    width: `${number}${string}`;
    height: `${number}${string}`;
  }
>(
  (
    {
      children,
      width,
      height,
      className,
      style,
      step,
      triggerComparison,
      canvasID,
      ...props
    }: StepProps & {
      width: `${number}${string}`;
      height: `${number}${string}`;
    },
    ref
  ) => {
    /**
     * @notice
     *
     * We have a useEffect running each time our dimensions (width/height)
     * change. Each time this runs, it resizes the Step's instance
     * based on it, assuming it is not the default widths/height
     */

    useEffect(() => {
      step.defaultDimensions = {
        ...step.defaultDimensions,
        [step.size]: {
          width: parseInt(width),
          height: parseInt(height),
        },
      };

      step.resize(step.size, undefined, true);
    }, [height, width]);

    // Return the node
    return (
      <>
        {step.writeable &&
          step.state == "complete" &&
          step.children.length &&
          step.children[0].state !== "empty" && (
            <ChildAdders
              height={height}
              width={width}
              style={style}
              step={step}
              triggerComparison={triggerComparison}
              canvasID={canvasID}
            />
          )}
        <div
          className={
            "flex flex-row items-center justify-start  bg-custom-bcomponentbg absolute shadow-sm rounded-xl border-[1px] border-custom-themedBorder transition duration-200 ease-in-out animate-stepPopup" +
            " " +
            (className || "")
          }
          style={{ width: width, height: height, ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

/**
 * A component containing the child adding buttons
 */

const ChildAdders = ({
  width,
  height,
  style,
  step,
  canvasID,
  triggerComparison,
}: StepProps & {
  width: `${number}${string}`;
  height: `${number}${string}`;
}) => {
  /**
   * Memoize the function to add a new child
   */
  const addChild = useCallback(() => {
    step.addChild(
      new Step(
        {
          type: StepType.STEP,
          state: "initial",
        },
        true
      )
    );

    triggerComparison();
  }, [step]);

  /**
   * Get the canvas portal for the tooltip
   */
  const canvasPortal = useElementPortal(canvasID);

  return (
    <div className="" style={{ ...style, zIndex: 0, position: "relative" }}>
      <InfoProvider contents="Add Step +" delay={300} portal={canvasPortal}>
        <PlusCircle
          style={{
            zIndex: 2,
            position: "absolute",
            left: `${parseInt(width) / 2}px`,
            top: `${parseInt(height) / 2}px`,
          }}
          className="translate-x-[-40%] translate-y-[-50%] hover:translate-x-[-30%]"
          onClick={addChild}
        />
      </InfoProvider>
      <InfoProvider contents="Add Step +" delay={300} portal={canvasPortal}>
        <PlusCircle
          style={{
            zIndex: 2,
            position: "absolute",
            left: `-${parseInt(width) / 2}px`,
            top: `${parseInt(height) / 2}px`,
          }}
          className="translate-x-[-59%] translate-y-[-50%] hover:translate-x-[-70%]"
          onClick={addChild}
        />
      </InfoProvider>
    </div>
  );
};
