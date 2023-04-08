"use client";
/**
 * A provider that is used to render global modals
 */

import { Children, isValidElement } from "react";
import { useModals } from "../../utilities/hooks/stores/modal";

// The component
export const ModalProvider = () => {
  // Getting the global state
  const modals = useModals((state) => state.modals);

  // Return the modals
  return (
    <div className="w-full z-100000000000000">
      {Children.map(
        modals.map((modal) => modal.component),
        (modal, i) => {
          // Render the modal and add a @modalKey prop for it to manipulate itself within the array
          if (isValidElement(modal)) {
            return <modal.type {...modal.props} modalKey={i} />;
          }
          return modal;
        }
      )}
    </div>
  );
};
