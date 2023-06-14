import { CSSProperties } from "react";

interface DivisorProps {
  className?: string;
  style?: CSSProperties;
}

("border-custom-themedBorder");
("border-custom-border");
("border-custom-textColor");
function Divisor({ className, style }: DivisorProps) {
  return (
    <div
      className={
        "w-[95%] h-0 border-[0.1px] border-custom-themedBorder my-6 " +
        (className || "")
      }
      style={style || {}}
    ></div>
  );
}

export default Divisor;
