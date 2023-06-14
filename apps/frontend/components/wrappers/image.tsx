"use client";
import Image from "next/image";
import { useTheme } from "utilities/hooks/stores/theme";
import { ImageSkeleton } from "./skeleton";
import { useState } from "react";
import { ImageProps } from "./types";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

const WrappedImage = ({
  src,
  alt,
  width = 24,
  height = 24,
  className,
  onClick,
  style,
  wheelable = true,
}: ImageProps) => {
  // State to track whether we fetch the color or not.
  const [fetchedColor, setFetchedColor] = useState<boolean>(false);

  const theme = useTheme((state) => state.theme);

  if (!src) return <ImageSkeleton width={width} height={height} />;
  return (
    <>
      <Image
        width={width}
        height={height}
        src={typeof src == "string" ? src : src[theme]}
        alt={alt || ""}
        className={
          "select-none text-custom-textColor" + (" " + className || "")
        }
        onClick={() => onClick && onClick()}
        style={style || {}}
        data-wheelable={wheelable}
      />
    </>
  );
};

export default WrappedImage;
