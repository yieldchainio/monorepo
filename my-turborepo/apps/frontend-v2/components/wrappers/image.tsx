import Image from "next/image";
import { ImageSkeleton } from "./skeleton";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

interface ImageProps {
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
}

const WrappedImage = ({ src, alt, width, height, className }: ImageProps) => {
  if (!src) return <ImageSkeleton width={width} height={height} />;
  return (
    <Image
      width={width}
      height={height}
      src={
        typeof src == "string"
          ? src
          : document.documentElement.className.includes("dark")
          ? src.dark
          : src.light
      }
      alt={alt || ""}
      className={className || ""}
    />
  );
};

export default WrappedImage;
