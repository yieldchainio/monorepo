"use client";
import Image from "next/image";
import { useTheme } from "utilities/stores/theme";
import { ImageSkeleton } from "./skeleton";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

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
  onClick?: () => any;
}

const WrappedImage = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
}: ImageProps) => {
  if (!src) return <ImageSkeleton width={width} height={height} />;

  const theme = useTheme((state) => state.theme);

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
