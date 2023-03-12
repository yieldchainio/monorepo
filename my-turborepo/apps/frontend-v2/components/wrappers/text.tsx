import Image from "next/image";
import { ImageSkeleton, TextSkeleton } from "./skeleton";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

interface TextProps {
  text: string;
  fontSize: number;
  fontStyle: string;
  fontColor?: string;
  select?: Selection;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any | void | null;
  fontFamily?: string;
  className?: string;
}

export enum Selection {
  allow = "select-text",
  disallow = "select-none",
}

const WrappedText = ({
  text,
  fontSize = 14,
  fontStyle = "reguler",
  fontFamily = "athletics",
  fontColor = "custom-textColor",
  onClick,
  select = Selection.allow,
  className = "",
}: TextProps) => {
  if (!text) return <TextSkeleton fontSize={fontSize} className={className} />;
  return (
    <div
      className={`${
        "font-" +
        fontSize.toString() +
        " font-" +
        fontFamily +
        " font-" +
        fontStyle +
        " text-" +
        fontColor +
        " " +
        "select-none" +
        " " +
        className
      } `}
      onClick={(e: React.MouseEvent<HTMLElement>) =>
        onClick ? onClick(e) : null
      }
    >
      {text}
    </div>
  );
};

export default WrappedText;
