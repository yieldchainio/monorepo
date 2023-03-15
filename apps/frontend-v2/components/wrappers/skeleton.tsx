/**
 * A skeleton component
 */

interface ImageProps {
  width: number;
  height: number;
  className?: string;
}
interface TextProps {
  fontSize: number;
  className?: string;
}
export const ImageSkeleton = ({ width, height, className }: ImageProps) => {
  return (
    <div
      className={
        "w-[24px] bg-custom-skeleton rounded-full overflow-hidden animate-pulse"
      }
    ></div>
  );
};

export const TextSkeleton = ({ fontSize, className }: TextProps) => {
  return (
    <div
      className={`font-[${fontSize}px] h-[${fontSize}px] bg-custom-skeleton rounded-sm overflow-hidden animate-pulse truncate`}
    ></div>
  );
};
