import { IconProps } from "./types";

const DisconnectIcon = ({ className, iconClassname }: IconProps) => {
  return (
    <svg
      width={13}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path
        d="M5.5 6.5h4.418m0 0L8.024 8.394M9.918 6.5L8.024 4.607m1.894-1.893v-.631c0-.698-.565-1.263-1.262-1.263H2.345c-.697 0-1.262.565-1.262 1.263v8.835c0 .697.565 1.262 1.262 1.262h6.31c.698 0 1.263-.565 1.263-1.262v-.631"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassname || ""}
      />
    </svg>
  );
};

export default DisconnectIcon;
