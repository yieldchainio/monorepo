import { DropdownOption, DropdownProps } from "./types";
import DropdownMenu from "./menu";
import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emitCustomEvent } from "react-custom-events";
import { useCustomEventListener } from "react-custom-events";
import { BaseEventData, EventTypes } from "types/events";
import uuid from "uuid-random";
import { RegulerButton } from "components/buttons/reguler";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import {
  MediaScreenSizes,
  useMediaBreakpoints,
} from "utilities/hooks/styles/useMediaBreakpoints";
import { MediaScreens } from "types/styles/media-breakpoints";
import { ModalWrapper } from "components/modals/base/wrapper";
import { useModals } from "utilities/hooks/stores/modal";
import { SearchableDropdownMenu } from "./menu/searchable";

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      choice,
      children,
      onClick,
      choiceHandler,
      closeOnChoice,
      buttonProps,
      menuProps,
      textProps,
      imageProps,
      manualModal,
      autoChoice = true,
      disabled,
      type = "reguler",
      refSetter,
      disableChoosing = false,
      hideOptionText,
      ...props
    }: DropdownProps,
    ref
  ) => {
    // Track whether or not the (default) dropdown menu is open
    const [menuOpen, setMenuOpen] = useState<boolean | DropdownOption[]>(false);

    // State tracking the choice
    const [currentChoice, setCurrentChoice] = useState<DropdownOption>(
      choice || [...options][0]
    );

    // Keep track of global modals state and push into it
    const modals = useModals();

    // Change the choice each time choice is changed
    useEffect(() => {
      if (choice && manualModal) {
        setCurrentChoice(choice);
        setMenuOpen(!menuOpen);
      }
    }, [choice]);

    useEffect(() => {
      if (choice) setCurrentChoice(choice);
    }, [choice]);

    // Change the choice each time choice is changed
    useEffect(() => {
      !manualModal && autoChoice && setCurrentChoice([...options][0]);
    }, [JSON.stringify(options.map((opt) => JSON.stringify(opt)))]);

    // A state keeping track of this component's UUID, for event listening purpoes
    const [UUID] = useState<string>(uuid());

    // A custom hook listening for our custom event. If an event of "MENU OPEN" was emitted
    // (not from us), we close the menu to avoid many menus being opened at once.
    useCustomEventListener<BaseEventData>(
      EventTypes.MENU_OPEN,
      (data: BaseEventData) => data.id !== UUID && setMenuOpen(false)
    );

    // Ref for the button's location (For properly locating the menu when opened)
    const dropdownBtnRef = useRef<HTMLDivElement>();

    // We set our ref setter to set the dropdown btn ref on mount
    useEffect(() => {
      refSetter = (node: HTMLDivElement) => (dropdownBtnRef.current = node);
    }, []);

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

      if (
        (!menuOpen && window.innerWidth <= MediaScreenSizes.TABLET) ||
        manualModal
      )
        modals.push((id: number) => ({
          component: (
            <ModalWrapper
              modalKey={id}
              closeFunction={(modalKey: number) => {
                modals.remove(modalKey);
                setMenuOpen((prev) => !prev);
              }}
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {children || menuToReturn}
            </ModalWrapper>
          ),
          id: UUID,
        }));
    };

    // The choice handler we pass on, accepts DropdownOption's data (any)
    const handleChoice = async (_choice: DropdownOption) => {
      // if we got a choice handler, pass the choice to it
      if (choiceHandler) await choiceHandler(_choice);

      // Close the menu
      if (closeOnChoice !== false) setMenuOpen(false);

      // Set the choice
      setCurrentChoice(_choice);
    };

    // Memoize correct ref
    const correcRef = useMemo(() => {
      return dropdownBtnRef;
    }, [ref, dropdownBtnRef, dropdownBtnRef.current]);

    const menuToReturn = useMemo(() => {
      if (type === "reguler")
        return (
          <DropdownMenu
            options={options}
            handler={handleChoice}
            parentRef={correcRef}
            {...menuProps}
            className="static"
          />
        );

      return (
        <SearchableDropdownMenu
          options={options}
          handler={handleChoice}
          parentRef={correcRef}
          {...menuProps}
        >
          {children}
        </SearchableDropdownMenu>
      );
    }, [type, options, options.length]);

    useEffect(() => {
      if (choice && disableChoosing) {
        setCurrentChoice(choice);
      }
    }, [disableChoosing, choice, choice?.data, choice?.image, choice?.text]);

    return (
      <div className="relative">
        {menuOpen &&
          (window.innerWidth <= MediaScreenSizes.TABLET || manualModal
            ? null
            : children || menuToReturn)}

        <RegulerButton
          onClick={() => (disableChoosing ? null : handleClick())}
          ref={correcRef as React.MutableRefObject<HTMLDivElement | null>}
          {...buttonProps}
          {...props}
          style={{
            ...(buttonProps?.style || {}),
          }}
          disabled={disabled}
        >
          <div
            className="flex flex-row gap-2 items-center"
            style={
              buttonProps?.style?.gap ? { gap: buttonProps.style.gap } : {}
            }
          >
            {!buttonProps?.children ? (
              <>
                {currentChoice?.image !== undefined &&
                  (typeof currentChoice.image == "string" ? (
                    <WrappedImage
                      src={currentChoice.image}
                      width={24}
                      height={24}
                      className=" rounded-full"
                      {...imageProps}
                    />
                  ) : (
                    currentChoice.image
                  ))}
                <WrappedText {...textProps}>{currentChoice?.text}</WrappedText>
              </>
            ) : (
              buttonProps.children
            )}
          </div>
          {!disableChoosing && (
            <WrappedImage
              src={{
                dark: "/icons/dropdown-arrow-light.svg",
                light: "/icons/dropdown-arrow-dark.svg",
              }}
              width={24}
              height={24}
            />
          )}
        </RegulerButton>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
