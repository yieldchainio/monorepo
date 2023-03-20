/**
 * A "Chip" component,
 * displays an image, text & additional (optional) children.
 *
 * Takes props for the usual styling, the text & image, and also handlers,
 * styling for when toggled, clicked, etc
 */

import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { useEffect, useState } from "react";
import { hexColors } from "configs/styles/colors";

export interface ChipProps {
  className?: string;
  image: string;
  text: string;
  color?: string;
  onSelect?: (id: number) => any;
  onDeselect?: (id: number) => any;
  children?: React.ReactElement;
  selected?: boolean;
  id: number;
}

const borderColors: Record<string, string> = {
  border: "var(--border)",
  "#0000FF": "rgba(0, 0, 255, 1)",
  "#FF0000": "rgba(255, 0, 0, 1)",
  "#FFFF00": "rgba(255, 255, 0, 1)",
  "#A020F0": "rgba(160, 32, 240, 1)",
  "#00FFFF": "rgba(0, 255, 255, 1)",
};
export const Chip = ({
  className,
  children,
  image,
  text,
  color,
  selected,
  onSelect,
  id,
  onDeselect,
}: ChipProps) => {
  // Keeping track of whether we are toggled or not
  const [toggled, setToggled] = useState<"border-[2px]" | "border-0">(
    selected ? "border-[2px]" : "border-0"
  );

  // Set the toggle based on the provided selected
  useEffect(() => {
    if (!!selected) setToggled("border-[2px]");
    else if (selected === false) setToggled("border-0");
  }, [selected]);

  // Handle a selection/de-selection
  const handleSelection = () => {
    if (toggled === "border-[2px]") {
      onDeselect && onDeselect(id);
      setToggled("border-0");
    } else {
      onSelect && onSelect(id);
      setToggled("border-[2px]");
    }
  };

  return (
    <div
      className={
        "h-max w-max pl-1 pr-6 py-1 bg-custom-bcomponentbg rounded-3xl flex flex-row items-center gap-2 justify-center cursor-pointer border-opacity-[50%] active:scale-[0.99] hover:scale-[1.05] transition duration-200 ease-in-out will-change-transform" +
          " " +
          toggled +
          " " +
          className || ""
      }
      onClick={handleSelection}
      style={{
        borderColor: color && borderColors[color],
      }}
    >
      <WrappedImage
        src={image}
        width={32}
        height={32}
        className="rounded-full"
      />
      <WrappedText
        fontSize={14}
        fontStyle={"reguler"}
        className="text-custom-textColor"
      >
        {text}
      </WrappedText>
    </div>
  );
};
