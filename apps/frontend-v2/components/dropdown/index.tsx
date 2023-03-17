import { DropdownOption, DropdownProps } from "./types";
import DropdownMenu from "./menu";
import React, { useEffect, useRef, useState } from "react";
import { emitCustomEvent } from "react-custom-events";
import { useCustomEventListener } from "react-custom-events";
import { BaseEventData, EventTypes } from "types/events";
import uuid from "uuid-random";
import { RegulerButton } from "components/buttons/reguler";
import WrappedImage from "components/wrappers/image";

const Dropdown = ({
  options,
  choice,
  children,
  onClick,
  choiceHandler,
}: DropdownProps) => {
  // Track whether or not the (default) dropdown menu is open
  const [menuOpen, setMenuOpen] = useState<boolean | DropdownOption[]>(false);

  // State tracking the choice
  const [currentChoice, setCurrentChoice] = useState<DropdownOption>(
    choice || [...options][0]
  );

  // Change the choice each time choice is changed

  useEffect(() => {
    setCurrentChoice([...options][0]);
  }, [JSON.stringify(options)]);

  // A state keeping track of this component's UUID, for event listening purpoes
  const [UUID] = useState<string>(uuid());

  // A custom hook listening for our custom event. If an event of "MENU OPEN" was emitted
  // (not from us), we close the menu to avoid many menus being opened at once.
  useCustomEventListener<BaseEventData>(
    EventTypes.MENU_OPEN,
    (data: BaseEventData) => data.id !== UUID && setMenuOpen(false)
  );

  // Ref for the button's location (For properly locating the menu when opened)
  const dropdownBtnRef = useRef<HTMLDivElement>(null);

  // Handle the button being clicked
  const handleClick = async () => {
    // If we got an onClick function ,we invoke it first.
    if (onClick) await onClick(options);

    // If it was an open (rather than a close), we emit an event specifying that
    // a menu was opened (to close all others)
    if (!menuOpen)
      emitCustomEvent<BaseEventData>(EventTypes.MENU_OPEN, {
        id: UUID,
      });

    // We then set the menu open to equal to true
    setMenuOpen((prev: any) => !prev);
  };

  // The choice handler we pass on, accepts DropdownOption's data (any)
  const handleChoice = async (_choice: DropdownOption) => {
    // if we got a choice handler, pass the choice to it
    if (choiceHandler) await choiceHandler(_choice);

    // Close the menu
    setMenuOpen(false);

    // Set the choice
    setCurrentChoice(_choice);
  };

  console.log(options, "Options ser");

  return (
    <div className="relative">
      {menuOpen &&
        (children ? (
          children
        ) : (
          <DropdownMenu
            options={options}
            handler={handleChoice}
            parentRef={dropdownBtnRef}
          />
        ))}

      <RegulerButton onClick={handleClick} className=" " ref={dropdownBtnRef}>
        <div className="flex flex-row gap-2">
          {currentChoice?.image !== undefined && (
            <WrappedImage
              src={currentChoice.image}
              width={24}
              height={24}
              className=" rounded-full"
            />
          )}
          <span className="laptop:hidden">{currentChoice?.text}</span>
        </div>
        <WrappedImage src="/icons/dropdown-arrow.svg" width={24} height={24} />
      </RegulerButton>
    </div>
  );
};

export default Dropdown;
