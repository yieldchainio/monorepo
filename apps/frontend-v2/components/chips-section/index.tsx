import { Chip } from "components/chip";
import { useEffect, useState } from "react";
import { useYCStore } from "utilities/stores/yc-data";

export interface ChipsSectionProps<T> {
  setter: (items: T[]) => any;
  items: T[];
  defaultChip?: T | BaseChipProps;
}

export interface BaseChipProps {
  logo: string;
  name: string;
  color?: string;
}

/**
 * A component for a section of networks/chains chips to use with filtering
 */

export const ChipsSection = <T extends BaseChipProps>({
  items,
  setter,
  defaultChip = {
    logo: "/brand/yc-logo-light.png",
    name: "All Networks",
    color: "border",
  },
}: ChipsSectionProps<T>) => {
  // return the chips
  const [selectedChips, setSelectedChips] = useState(items.map((item, i) => i));

  // Selecting all chips initially
  const [initiated, setInitiated] = useState<boolean>(false);
  useEffect(() => {
    if (!initiated && items.length) setSelectedChips(items.map((item, i) => i));
    setInitiated(true);
  }, [items]);

  useEffect(() => {
    setter([...items.filter((item, i) => selectedChips.indexOf(i) !== -1)]);
  }, [selectedChips]);

  // Function to add a chip
  const addChip = (key: number) => {
    const newArr = [...selectedChips];
    if (newArr.some((item) => item == key)) return;
    newArr.push(key);
    setSelectedChips(newArr);
  };

  const removeChip = (key: number) => {
    const index = selectedChips.indexOf(key);
    console.log("index of key:", key, "Is:", index);
    if (index === undefined) return;
    const newArr = [...selectedChips];
    newArr.splice(index, 1);
    setSelectedChips(newArr);
  };
  // Return the component
  return (
    <div className="w-[100%] flex flex-row items-center justify-center gap-3">
      {items.map((item: T, i: number) => (
        <Chip
          image={item.logo}
          text={item.name}
          color={item.color}
          key={i}
          id={i}
          selected={
            selectedChips.find((selectedChipIndex) => {
              return selectedChipIndex == i;
            }) !== undefined
              ? true
              : false
          }
          onSelect={addChip}
          onDeselect={removeChip}
        />
      ))}
    </div>
  );
};
