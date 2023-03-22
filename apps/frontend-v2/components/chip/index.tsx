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
  const [toggled, setToggled] = useState<"border-[2px]" | "border-1">(
    selected ? "border-[2px]" : "border-1"
  );

  // Set the toggle based on the provided selected
  useEffect(() => {
    if (!!selected) setToggled("border-[2px]");
    else if (selected === false) setToggled("border-1");
  }, [selected]);

  // Handle a selection/de-selection
  const handleSelection = () => {
    if (toggled === "border-[2px]") {
      onDeselect && onDeselect(id);
      setToggled("border-1");
    } else {
      onSelect && onSelect(id);
      setToggled("border-[2px]");
    }
  };

  const [usedColor, setUsedColor] = useState(color);

  return (
    <div
      className={
        "h-max w-max pl-1 pr-6 py-1 bg-custom-bcomponentbg rounded-3xl flex flex-row items-center gap-2 justify-center cursor-pointer border-opacity-[50%] active:scale-[0.99] hover:scale-[1.05] transition duration-200 ease-in-out will-change-transform smallLaptop:pl-1.5 smallLaptop:pr-1.5 smallLaptop:py-1.5 smallLaptop:rounded-full" +
          " " +
          toggled +
          " " +
          className || ""
      }
      onClick={handleSelection}
      style={{
        borderColor: toggled == "border-[2px]" ? usedColor : "var(--border)",
      }}
    >
      <WrappedImage
        src={image}
        width={32}
        height={32}
        className="rounded-full"
        setColors={
          !color
            ? (colors) => {
                setUsedColor(colors.vibrant);
              }
            : undefined
        }
      />
      <WrappedText
        fontSize={14}
        fontStyle={"reguler"}
        className="text-custom-textColor smallLaptop:hidden"
        style={{
          color: toggled === "border-[2px]" ? "var(--text)" : "var(--off)",
        }}
      >
        {text}
      </WrappedText>
    </div>
  );
};
