import { IconProps } from "./types";
const CheckmarkIcon = ({ className, iconClassname }: IconProps) => {
  return (
    <svg
      width={25}
      height={19}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path
        d="M2 11.056l6.037 6.038L23.131 2"
        stroke="currentColor"
        strokeWidth={2.264}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassname || ""}
      />
    </svg>
  );
};

export default CheckmarkIcon;
