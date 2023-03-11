import { DropdownOption, DropdownProps } from "./types";
import DropdownButton from "./button";
import DropdownMenu from "./menu";
import React, { useEffect, useRef, useState } from "react";
import { emitCustomEvent } from "react-custom-events";
import { useCustomEventListener } from "react-custom-events";
import { BaseEventData, EventTypes } from "types/events";
import uuid from "uuid-random";

const Dropdown = ({
  options,
  choice = options[0],
  MenuComponent,
  onClick,
  choiceHandler,
}: DropdownProps) => {
  // Track whether or not the (default) dropdown menu is open
  const [menuOpen, setMenuOpen] = useState<boolean | DropdownOption[]>(false);

  // State tracking the choice
  const [currentChoice, setCurrentChoice] = useState<DropdownOption>(choice);

  useEffect(() => {
    if (!currentChoice) setCurrentChoice(options[0]);
  }, [options]);

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
  const handleClick = () => {
    // If we got an onClick function ,we invoke it first.
    if (onClick) onClick(options);

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
  const handleChoice = (_choice: DropdownOption) => {
    // if we got a choice handler, pass the choice to it
    if (choiceHandler) choiceHandler(_choice);

    // Close the menu
    setMenuOpen(false);

    // Set the choice
    setCurrentChoice(_choice);
  };

  return (
    <div className="relative">
      {menuOpen &&
        (MenuComponent ? (
          <MenuComponent options={options} />
        ) : (
          <DropdownMenu
            options={options}
            handler={handleChoice}
            parentRef={dropdownBtnRef}
          />
        ))}

      <DropdownButton
        options={options}
        choice={currentChoice}
        onClick={handleClick}
        ref={dropdownBtnRef}
      />
    </div>
  );
};

export default Dropdown;
