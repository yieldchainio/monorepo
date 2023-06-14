/**
 * A simple "X" button
 */

import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import { ImageProps } from "components/wrappers/types";

export const EXButton = ({
  onClick,
  width = 20,
  height = 20,
  className,
}: BaseComponentProps & Partial<ImageProps>) => {
  return (
    <WrappedImage
      src={{
        dark: "/icons/x-light.svg",
        light: "/icons/x-dark.svg",
      }}
      width={width}
      height={height}
      className={
        className +
        " " +
        "opacity-50 cursor-pointer hover:opacity-80 transition duration-200 ease-in-out  "
      }
      onClick={onClick}
    />
  );
};
