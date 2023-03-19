"use client";
import Image from "next/image";
import { useTheme } from "utilities/stores/theme";
import { ImageSkeleton } from "./skeleton";
import { usePalette } from "react-palette";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

export type HexColor = `#${number}${number}${number}${number}${string}`;
export interface ExtractedColors {
  darkMuted: HexColor;
  darkVibrant: HexColor;
  lightMuted: HexColor;
  lightVibrant: HexColor;
  muted: HexColor;
  vibrant: HexColor;
}

export interface ImageProps {
  src:
    | string
    | {
        light: string;
        dark: string;
      };
  width: number;
  height: number;
  className?: string;
  alt?: string;
  color?: string;
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
  color,
  setColors,
}: ImageProps) => {
  if (!src) return <ImageSkeleton width={width} height={height} />;

  const theme = useTheme((state) => state.theme);
  // const {
  //   data: colors,
  //   loading,
  //   error,
  // } = color
  //   ? color
  //   : setColors
  //   ? usePalette(typeof src == "string" ? src : src[theme])
  //   : { data: null, loading: false, error: null };

  return (
    <Image
      width={width}
      height={height}
      src={typeof src == "string" ? src : src[theme]}
      alt={alt || ""}
      className={className ? "select-none" + " " + className : "select-none"}
      onClick={() => onClick && onClick()}
    />
  );
};

export default WrappedImage;
