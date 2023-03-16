import { TextSkeleton } from "./skeleton";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

interface TextProps {
  children: string | undefined;
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
  children,
  fontSize = 14,
  fontStyle = "reguler",
  fontFamily = "athletics",
  fontColor = "custom-textColor",
  onClick,
  select = Selection.allow,
  className = "",
}: TextProps) => {
  if (children === undefined)
    return <TextSkeleton fontSize={fontSize} className={className} />;
  return (
    <div
      className={`${
        "text-" +
        `[${fontSize.toString()}px]` +
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
      {children}
    </div>
  );
};

export default WrappedText;
