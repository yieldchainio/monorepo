/**
 * A text-button to toggle expand
 */

import { BaseComponentProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { useMemo } from "react";

export const ToggleExpandText = ({
  className,
  style,
  state,
  setState,
}: {
  state: boolean;
  setState: (expanded: boolean) => void;
} & BaseComponentProps) => {
  // Memoizing the text to display
  const text = useMemo(() => {
    if (state == true) return "Shrink";
    return "Expand";
  }, [state]);

  return (
    <div
      className={
        "flex flex-row items-center justify-between gap-1 group cursor-pointer" +
        " " +
        (className || "")
      }
      style={style}
      onClick={() => setState(!state)}
    >
      <WrappedText
        fontSize={16}
        fontStyle="bold "
        className="group-hover:text-opacity-80  transition duration-200 ease-in-out "
      >
        {text}
      </WrappedText>
      <WrappedImage
        src={{
          dark: "/icons/dropdown-arrow-light.svg",
          light: "/icons/dropdown-arrow-dark.svg",
        }}
        width={28}
        height={28}
        className="group-hover:opacity-80  transition duration-200 ease-in-out group-hover:rotate-[-90deg] "
      ></WrappedImage>
    </div>
  );
};
