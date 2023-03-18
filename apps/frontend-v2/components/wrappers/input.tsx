import { TextSkeleton } from "./skeleton";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

interface InputProps {
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

const WrappedInput = ({
  fontSize = 14,
  fontStyle = "reguler",
  fontFamily = "athletics",
  fontColor = "custom-textColor",
  onClick,
  select = Selection.allow,
  className = "",
}: InputProps) => {
  return (
    <input
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
        " w-[60%]" +
        " focus:outline-none" +
        " h-min" +
        " " +
        className
      } `}
      onClick={(e: React.MouseEvent<HTMLElement>) =>
        onClick ? onClick(e) : null
      }
    />
  );
};

export default WrappedInput;
