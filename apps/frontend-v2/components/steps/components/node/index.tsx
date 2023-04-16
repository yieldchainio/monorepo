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
import { forwardRef, useEffect } from "react";
import { StepProps } from "components/steps/types";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";

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
      step.resize(step.size);

      return () => {
        step.defaultDimensions = DefaultDimensions;
      };
    }, [height, width]);

    // Return the node
    return (
      <>
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
