/**
 * Ensure the user's intent to complete some step's state,
 * displaying all of the children of that step which will be dropped due
 * to mismatch with some flows
 */

import { EnsureModal } from "components/modals/ensure";
import { TokensBundle } from "components/tokens/bundle";
import { BaseModalChildProps } from "components/types";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { Step } from "utilities/classes/step";
import { StepState } from "utilities/classes/step/types";

export const EnsureDroppedChildren = ({
  childrenToDrop,
  step,
  modalKey,
  newState,
}: {
  step: Step;
  childrenToDrop: Step[];
  newState: StepState;
} & BaseModalChildProps) => {
  return (
    <EnsureModal
      ensureLabel="Are you sure you want to do this?"
      confirmLabel="Yeap, delete steps"
      ensureDescription="This will force delete the following steps:"
      modalKey={modalKey as number}
      confirmHandler={() => step.setState(newState)}
    >
      {childrenToDrop.map((child) => {
        return (
          <div className="flex flex-row gap-2 items-center ">
            <div className="flex flex-row gap-1 items-center">
              <WrappedImage
                src={child.protocol?.logo}
                className="rounded-full"
                width={28}
                height={28}
              />
              <WrappedText>{child.action?.name || "No Action"}</WrappedText>
            </div>
            {(child.inflows?.length || null) && (
              <div className="flex flex-row items-center">
                <WrappedText className="text-green-600">+</WrappedText>
                <TokensBundle tokens={child.inflows}></TokensBundle>
              </div>
            )}
            {(child.outflows.length || null) && (
              <div className="flex flex-row items-center gap-0.5">
                <WrappedText className="text-red-600">-</WrappedText>
                <TokensBundle tokens={child.outflows}></TokensBundle>
              </div>
            )}
          </div>
        );
      })}
    </EnsureModal>
  );
};
