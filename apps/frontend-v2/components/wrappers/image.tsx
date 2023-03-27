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
  width,
  height,
  className,
  onClick,
  style,
}: ImageProps) => {
  // State to track whether we fetch the color or not.
  const [fetchedColor, setFetchedColor] = useState<boolean>(false);

  const theme = useTheme((state) => state.theme);

  if (!src) return <ImageSkeleton width={width} height={height} />;
  return (
    <>
      {/* {setColors && !fetchedColor && (
        <Palette src={typeof src == "string" ? src : src[theme]}>
          {({ data, loading, error }) => {
            if (!loading) {
              console.log("Data ser", data);
              setColors(data);
              setFetchedColor(true);
            }
            return <></>;
          }}
        </Palette>
      )} */}
      <Image
        width={width}
        height={height}
        src={typeof src == "string" ? src : src[theme]}
        alt={alt || ""}
        className={className ? "select-none" + " " + className : "select-none"}
        onClick={() => onClick && onClick()}
        style={style || {}}
      />
    </>
  );
};

export default WrappedImage;
