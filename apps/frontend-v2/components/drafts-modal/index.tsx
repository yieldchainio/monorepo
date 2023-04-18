/**
 * A Component for a drats modal that dispalys a users' strategies drafts.
 */

import { Table } from "components/table";
import { DraftsModalProps } from "./types";
import {
  StrategyStoreConfigsUtilityState,
  StrategyStoreState,
} from "utilities/hooks/stores/strategies/types";
import { InfoProvider } from "components/info-providers";
import WrappedText from "components/wrappers/text";
import WrappedImage from "components/wrappers/image";
import { TokensBundle } from "components/tokens/bundle";
import { useModals } from "utilities/hooks/stores/modal";
import { ModalWrapper } from "components/modal-wrapper";
import { StepsModal } from "components/steps-modal";
import { useCallback, useMemo, useState } from "react";
import { RegulerButton } from "components/buttons/reguler";
import { strategiesLocalStorage } from "utilities/hooks/stores/strategies/constants";
import GradientButton from "components/buttons/gradient";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import { EnsureModal } from "components/ensure-modal";

export const StrategiesDraftsModal = ({
  strategyDrafts,
  className,
  initStrategy,
  style,
  closeModal,
  ...props
}: DraftsModalProps) => {
  // The stateful strategy drafts
  const [drafts, setDrafts] = useState(strategyDrafts);

  // Get the strategy configs store functions (In order to load appropriate strategy)
  const setStrategy = useStrategyStore((state) => state.setStrategy);

  // Memoized function to create a new strategy or use a draft
  const loadStrategy = useCallback(
    (strategyDraft?: StrategyStoreConfigsUtilityState & StrategyStoreState) => {
      // We set the global strategy config
      setStrategy(strategyDraft);

      // We route to the strategy's correct config
      initStrategy(strategyDraft?.strategyConfigs);

      console.log("Our Close Modal Function", closeModal);
      // And close our modal
      closeModal?.();
    },
    [strategyDrafts, strategyDrafts.length]
  );

  return (
    <div
      className={
        "w-[75%] h-max flex flex-col items-center justify-start rounded-lg bg-custom-bcomponentbg py-12 px-10 overflow-scroll scrollbar-hide gap-4" +
        " " +
        (className || "")
      }
      style={style}
      {...props}
    >
      <WrappedText fontSize={32} fontStyle="bold">
        Your Drafts
      </WrappedText>
      <div className="w-full">
        {drafts.map((draft) => (
          <StrategyDraftRow
            draft={draft}
            removeSelf={async () => {
              await strategiesLocalStorage.removeItem(draft.id);
              setDrafts([...drafts.filter((_draft) => _draft.id !== draft.id)]);
            }}
            chooseSelf={() => {
              loadStrategy(draft);
            }}
          />
        ))}
      </div>
      <WrappedText fontSize={13} className="underline">
        OR
      </WrappedText>
      <GradientButton onClick={() => loadStrategy()}>
        + Create New
      </GradientButton>
    </div>
  );
};

/**
 * A component for a draft row
 */

const StrategyDraftRow = ({
  draft,
  deleteAble = true,
  removeSelf,
  chooseSelf,
}: {
  draft: StrategyStoreState & StrategyStoreConfigsUtilityState;
  deleteAble?: boolean;
  removeSelf: () => Promise<void>;
  chooseSelf: () => void;
}) => {
  // Modals push global store
  const modals = useModals();

  // Memoize some styling
  const className = useMemo(() => {
    if (deleteAble) return "hover:bg-opacity-5";
    return "";
  }, [deleteAble]);

  return (
    <div
      className={
        "cursor-pointer flex flex-row items-center py-2 px-8 bg-custom-textColor bg-opacity-0 transition duration-200 ease-in-out w-full min-h-[15vh] rounded-large gap-8" +
        " " +
        className
      }
    >
      {deleteAble && (
        <InfoProvider contents="Delete Draft">
          <div
            onClick={() =>
              modals.push((len: number) => {
                return {
                  component: (
                    <ModalWrapper modalKey={len}>
                      <EnsureModal
                        ensureLabel="Are You Sure You Want To Delete This Draft?"
                        confirmLabel="                            Yes, I Am Sure
                    "
                        confirmHandler={async () => await removeSelf()}
                        modalKey={len}
                      >
                        <StrategyDraftRow
                          draft={draft}
                          deleteAble={false}
                          removeSelf={removeSelf}
                          chooseSelf={chooseSelf}
                        />
                      </EnsureModal>
                    </ModalWrapper>
                  ),
                };
              })
            }
          >
            <WrappedImage
              src={{
                dark: "/icons/trash-light.svg",
                light: "/icons/trash-dark.svg",
              }}
              className="hover:opacity-50 transition duration-200 ease-in-out"
            />
          </div>
        </InfoProvider>
      )}
      <InfoProvider contents={draft?.network?.name || "No Network Chosen"}>
        <div>
          <WrappedImage
            src={draft.network?.logo}
            width={28}
            height={28}
            className="rounded-full"
          />
        </div>
      </InfoProvider>
      <Table<StrategyStoreState & StrategyStoreConfigsUtilityState>
        columnsGap="2rem"
        sections={[
          {
            label: "Title",
            callback: (draft) => (
              <InfoProvider contents={draft.title}>
                <WrappedText className="truncate">{draft.title}</WrappedText>
              </InfoProvider>
            ),
            style: {
              width: "60px",
            },
          },
          {
            label: "Privacy",
            callback: (draft) => (draft.isPublic ? "Public ✅" : "Private 🔒"),
          },
          {
            label: "Deposit Token",
            callback: (draft) =>
              !draft.depositToken ? (
                "Not Chosen"
              ) : (
                <div className="flex flex-row gap-2 items-center justify-center">
                  <WrappedImage
                    src={draft.depositToken.logo}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                  <WrappedText className="leading-0">
                    {draft.depositToken.symbol}
                  </WrappedText>
                </div>
              ),
            style: {
              width: "70px",
            },
          },
          {
            label: "Strategy Steps",
            callback: (draft) => {
              return (
                <WrappedText
                  className="hover:underline transition duration-200 ease-in-out"
                  onClick={() =>
                    modals.push((id: number) => {
                      return {
                        component: (
                          <ModalWrapper modalKey={id}>
                            <StepsModal
                              wrapperProps={{
                                style: {
                                  width: "80vw",
                                  height: "80vh",
                                },
                              }}
                              parentStyle={{
                                height: "80vh",
                              }}
                            />
                          </ModalWrapper>
                        ),
                      };
                    })
                  }
                >
                  Show All
                </WrappedText>
              );
            },
          },
        ]}
        items={[draft]}
      />
      {deleteAble && (
        <InfoProvider contents="Use This Draft">
          <RegulerButton className="ml-auto" onClick={chooseSelf}>
            Edit
          </RegulerButton>
        </InfoProvider>
      )}
    </div>
  );
};
