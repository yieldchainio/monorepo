/**
 * A custom hook used by dropdowns to open/close based on other's events
 *
 * @returns
 */

import { useCallback, useEffect, useId, useState } from "react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import { BaseEventData, EventTypes } from "types/events";
import { v4 as uuid } from "uuid";

export const useDropdownEvent = (closeMenu: (() => void) | null = null) => {
  // Set a UUID to identify ourselves
  const [UUID] = useState(uuid());

  // A state for the function that handles the consumer's actual visual closing
  const [handleMenuClose, setHandleMenuClose] = useState<any>(closeMenu);

  // We listen for other events of the MENU_OPEN type and close ourselves if its not from us
  useCustomEventListener<BaseEventData>(
    EventTypes.MENU_OPEN,
    (data: BaseEventData) => {
      data.id !== UUID && handleMenuClose && handleMenuClose();
    }
  );

  // Handle open
  const handleMenuOpen = () => {
    emitCustomEvent(EventTypes.MENU_OPEN, {
      id: UUID,
    });
  };

  // Return the open handler and the setter for handling the closing
  return { handleMenuOpen, setHandleMenuClose };
};