/**
 * A wrapper for the ```WrappedImage```, for token logos.
 *
 * Token logos are often used throughout the app, and some of them do not
 * have a background color... Which makes it very ugly.
 */

import WrappedImage from "components/wrappers/image";
import { ImageProps } from "components/wrappers/types";

export const TokenLogo = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
  style,
}: ImageProps) => {
  return (
    <div className="w-max h-max bg-custom-bcomponentbg rounded-full p-[0.3rem]">
      <div className="bg-custom-bg w-max h-max rounded-full p-1">
        <WrappedImage
          src={src}
          width={width}
          height={height}
          className="rounded-full"
        />
      </div>
    </div>
  );
};
