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
        "bg-custom-skeleton rounded-full overflow-hidden animate-pulse"
      }
      style={{
        width: width,
        height: height,
      }}
    ></div>
  );
};

const TextWidth: Record<number, string> = {
  4: "w-[0.02rem]",
  5: "w-[0.03rem]",
  6: "w-[0.04rem]",
  7: "w-[0.05rem]",
  8: "w-[0.06rem]",
  9: "w-[0.07rem]",
  10: "w-[0.08rem]",
  11: "w-[0.08rem]",
  12: "w-[0.09rem]",
  13: "w-[0.1rem]",
  14: "w-[0.06rem]",
  15: "w-[0.15rem]",
  16: "w-[0.22rem]",
  17: "w-[0.34rem]",
  18: "w-[0.42rem]",
  19: "w-[0.56em]",
};

const getTextWidth = (fontSize: number): string => {
  const width = TextWidth[fontSize];
  if (!width && fontSize > 0) return getTextWidth(fontSize - 1);
  return width;
};

export const TextSkeleton = ({ fontSize, className }: TextProps) => {
  return (
    <div
      className={
        `bg-custom-skeleton rounded-xl overflow-hidden animate-pulse truncate w-[100px] h-[20px] px-10` +
        " " +
        (getTextWidth(fontSize) || "w-[0.5rem]")
      }
      style={{
        height: `${fontSize}px`,
        marginTop: `${fontSize / 7}px`,
        marginBottom: `${fontSize / 7}px`,
      }}
    ></div>
  );
};
