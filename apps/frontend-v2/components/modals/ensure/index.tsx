/**
 * A generic "Ensure" modal - a modal that asks you if you are sure about a certain action
 */

import WrappedText from "components/wrappers/text";
import { EnsureModalProps } from "./types";
import { RegulerButton } from "components/buttons/reguler";
import { useModals } from "utilities/hooks/stores/modal";
import { FEEL_TO_CANCEL_COLOR } from "./constants";
import { forwardRef } from "react";

export const EnsureModal = forwardRef<HTMLDivElement, EnsureModalProps>(
  (
    {
      confirmHandler,
      cancelHandler,
      ensureLabel = "Are You Sure You Want To Do This?",
      confirmLabel = "Confirm",
      cancelLabel = "Never Mind",
      feel = "negative",
      children,
      modalKey,
      style,
      onClick,
      ensureDescription = "This is irreversible.",
    }: EnsureModalProps,
    ref
  ) => {
    /**
     * Get the global modals context
     */
    const modals = useModals();

    // Return the JSX
    return (
      <div
        className="w-[50%] h-max flex flex-col items-center justify-start rounded-lg bg-custom-bcomponentbg py-10 mx-auto gap-8 "
        ref={ref}
        onClick={onClick}
        style={style}
      >
        <div className="flex flex-col gap-2 items-center justify-center">
          <WrappedText fontSize={24} fontStyle="bold">
            {ensureLabel}
          </WrappedText>
          <WrappedText fontSize={16} className="text-opacity-50">
            {ensureDescription}
          </WrappedText>
        </div>
        {children}
        <div className="flex flex-row gap-6 items-center justify-center">
          <RegulerButton
            onClick={() => {
              cancelHandler?.();
              modals.remove(modalKey);
            }}
          >
            {cancelLabel}{" "}
          </RegulerButton>
          <RegulerButton
            className={FEEL_TO_CANCEL_COLOR[feel]}
            onClick={async () => {
              await confirmHandler();
              modals.remove(modalKey);
            }}
          >
            {confirmLabel}
          </RegulerButton>
        </div>
      </div>
    );
  }
);
