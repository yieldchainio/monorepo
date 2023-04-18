/**
 * A generic implemtnation of the "Cancel" button of thea ction configs
 */
import { RegulerButton } from "components/buttons/reguler";
import { EnsureModal } from "components/ensure-modal";
import { ModalWrapper } from "components/modal-wrapper";
import { StepProps } from "components/steps/types";
import { useModals } from "utilities/hooks/stores/modal";

export const CancelButton = ({
  className,
  style,
  step,
  triggerComparison,
}: StepProps) => {
  /**
   * Get global modals
   */
  const modals = useModals();
  return (
    <RegulerButton
      className="bg-opacity-0 hover:bg-opacity-0 border-custom-textColor hover:border-red-600 pt-1 pb-1 "
      style={{
        width: "40%",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      onClick={() => {
        modals.push((id: number) => {
          return {
            component: (
              <ModalWrapper modalKey={id}>
                <EnsureModal
                  modalKey={id}
                  ensureLabel="Are You Sure You Want To Delete This Action?"
                  ensureDescription="The Configuration For This Action Will Be Lost!"
                  /**
                   * When a cancel is confirmed, we reset the step's configurations.
                   */
                  confirmHandler={() => {
                    step.resetConfigs();
                    triggerComparison();
                  }}
                ></EnsureModal>
              </ModalWrapper>
            ),
          };
        });
      }}
    >
      Cancel
    </RegulerButton>
  );
};
