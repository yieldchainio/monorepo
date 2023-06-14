import { IconProps } from "./types";
function  EditIcon   ({ className, iconClassname }: IconProps) {
  return (
    <svg
      width={15}
      height={15}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path
        d="M8.28 3.08L10.36 1 14 4.64l-2.08 2.08M8.28 3.08l-7.065 7.065a.735.735 0 00-.215.52V14h3.335a.735.735 0 00.52-.215L11.92 6.72M8.28 3.08l3.64 3.64"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassname || ""}
      />
    </svg>
  );
};

export default EditIcon;
