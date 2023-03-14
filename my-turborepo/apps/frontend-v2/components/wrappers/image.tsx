"use client";
import Image from "next/image";
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
  return (
    <Image
      width={width}
      height={height}
      src={
        typeof src == "string"
          ? src
          : typeof window != "undefined" &&
            document.documentElement.className.includes("dark")
          ? src.dark
          : src.light
      }
      alt={alt || ""}
      className={className || ""}
      onClick={() => onClick && onClick()}
    />
  );
};

export default WrappedImage;
