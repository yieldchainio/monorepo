import { TextSkeleton } from "./skeleton";
import { TextProps, Selection } from "./types";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

("text-[1px]");
("text-[2px]");
("text-[3px]");
("text-[4px]");
("text-[5px]");
("text-[6px]");
("text-[7px]");
("text-[8px]");
("text-[9px]");
("text-[10px]");
("text-[11px]");
("text-[12px]");
("text-[13px]");
("text-[14px]");
("text-[15px]");
("text-[14px]");
("text-[16px]");
("text-[15px]");
("text-[17px]");
("text-[18px]");
("text-[19px]");
("text-[20px]");
("text-[21px]");
("text-[22px]");
("text-[32px]");
("text-[42px]");
("text-[52px]");
("text-[62px]");
("text-[72px]");

("font-bold");
("font-black");
("font-bold");

const WrappedText = ({
  children,
  fontSize = 14,
  fontStyle = "reguler",
  fontFamily = "athletics",
  fontColor,
  onClick,
  select = Selection.allow,
  truncate = "",
  contentEditable = "false",
  className = "",
  id,
  style,
  onInput,
  skeletonDimensions,
}: TextProps) => {
  if (children === undefined && skeletonDimensions?.width !== 0) {
    return (
      <TextSkeleton
        fontSize={fontSize}
        className={className}
        dimensions={skeletonDimensions}
      />
    );
  }

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
        (fontColor || "custom-textColor") +
        " " +
        "select-none focus:outline-none whitespace-nowrap " +
        truncate +
        " " +
        className
      }`}
      onClick={(e: React.MouseEvent<HTMLElement>) =>
        onClick ? onClick(e) : null
      }
      contentEditable={contentEditable}
      suppressContentEditableWarning={true}
      id={id}
      onInput={(e) => onInput && onInput(e)}
      style={style || {}}
    >
      {children}
    </div>
  );
};

export default WrappedText;
