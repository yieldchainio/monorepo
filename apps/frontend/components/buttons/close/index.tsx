import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";

export const CloseButton = ({
  onClick,
  style,
  className,
  inverted = false,
}: BaseComponentProps & {
  inverted?: boolean;
}) => {
  return (
    <WrappedImage
      src={
        inverted
          ? {
              light: "/icons/x-light.svg",
              dark: "/icons/x-dark.svg",
            }
          : {
              dark: "/icons/x-light.svg",
              light: "/icons/x-dark.svg",
            }
      }
      width={12}
      height={12}
      className={
        "absolute top-[0px] left-[100%] translate-x-[-250%] translate-y-[150%] cursor-pointer hover:opacity-50 transition duration-200 " +
        " " +
        (className || "")
      }
      onClick={onClick}
      style={style}
    />
  );
};
