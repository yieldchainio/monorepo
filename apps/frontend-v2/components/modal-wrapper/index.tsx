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
  style,
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
      className=" min-h-screen fixed inset-0 overflow-y-scroll bg-black/50 py-20 backdrop-blur-md flex "
      onClick={onClose}
      style={style}
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
            className={"animate-modal mx-auto" + " " + child.props.className}
            closeModal={() => {
              closeFunction && closeFunction(modalKey);
            }}
          />
        );
      })}
    </div>
  );
};
