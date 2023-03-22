"use client";
import Image from "next/image";
import { useTheme } from "utilities/stores/theme";
import { ImageSkeleton } from "./skeleton";
import { Palette } from "react-palette";
import { useMemo, useState } from "react";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

export type HexColor = string;
export interface ExtractedColors {
  darkMuted?: HexColor;
  darkVibrant?: HexColor;
  lightMuted?: HexColor;
  lightVibrant?: HexColor;
  muted?: HexColor;
  vibrant?: HexColor;
}

export interface ImageProps {
  src?:
    | string
    | {
        light: string;
        dark: string;
      }
    | null;
  width: number;
  height: number;
  className?: string;
  alt?: string;
  getColor?: boolean;
  setColors?: (colors: ExtractedColors) => any;
  onClick?: () => any;
}

const WrappedImage = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
  setColors,
}: ImageProps) => {
  if (!src) return <ImageSkeleton width={width} height={height} />;

  // State to track whether we fetch the color or not.
  const [fetchedColor, setFetchedColor] = useState<boolean>(false);

  const theme = useTheme((state) => state.theme);

  return (
    <>
      {setColors && !fetchedColor && (
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
      )}
      <Image
        width={width}
        height={height}
        src={typeof src == "string" ? src : src[theme]}
        alt={alt || ""}
        className={className ? "select-none" + " " + className : "select-none"}
        onClick={() => onClick && onClick()}
      />
    </>
  );
};

export default WrappedImage;
