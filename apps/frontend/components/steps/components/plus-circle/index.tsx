/**
 * A plus circle component, used to add additional childs on steps
 */

import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import { ImageProps } from "components/wrappers/types";
import { forwardRef } from "react";

/* eslint-disable react/display-name */
export const PlusCircle = forwardRef<
  HTMLDivElement,
  BaseComponentProps & Partial<ImageProps>
>(
  (
    {
      style,
      className,
      onClick,
      width = 20,
      height = 20,
      ...props
    }: BaseComponentProps & Partial<ImageProps>,
    ref
  ) => {
    return (
      <div
        className={
          "bg-custom-bcomponentbg rounded-full p-1 flex items-center justify-center hover:bg-custom-dimmed transition duration-200 ease-in-out shadow-md w-max h-max cursor-pointer" +
          " " +
          (className || "")
        }
        style={style}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        <WrappedImage
          src="/icons/plus-circle.svg"
          width={width}
          height={height}
          className="rounded-full"
        />
      </div>
    );
  }
);
