/**
 * A simple modal wrapper,
 * you can render this as a fixed component that has a dark blurry background.
 * When clicked, it will close itself using the function passed through props.
 */

import { useRouter } from "next/navigation";
import { Children, isValidElement } from "react";
import { useModals } from "utilities/hooks/stores/modal";
import { ModalWrapperProps } from "./types";

export const ModalWrapper = ({
  modalKey,
  closeFunction,
  children,
  callbackRoute,
}: ModalWrapperProps) => {
  // Get the removal function of the global modals state
  const removeModal = useModals((state) => state.remove);

  // An intance of the nextjs router
  const router = useRouter();

  // The onClose function invoked when the wrapper is clicked (either the optional custom
  // closeFunction, or we just remove the modal from the global state)
  const onClose = () => {
    if (closeFunction) closeFunction(modalKey);
    else removeModal(modalKey);
    if (callbackRoute) router.push(callbackRoute);
  };

  // Return the wrapper & render the children
  return (
    <div
      className="w-[100vw] h-[100vh] bg-black/60 fixed z-10000000000000 backdrop-blur-sm flex flex-col items-center justify-center overflow-scroll "
      onClick={onClose}
    >
      {Children.map(children, (child) => {
        // Typeguard
        if (!isValidElement(child)) return child;

        // Map the children but add an onClick that says stopPropagation
        return (
          <child.type
            {...child.props}
            onClick={
              child.props.onClick ||
              ((e: any) => {
                e.stopPropagation();
              })
            }
            className={child.props.className + " " + "animate-modal "}
          />
        );
      })}
    </div>
  );
};
