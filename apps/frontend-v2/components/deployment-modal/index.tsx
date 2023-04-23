/**
 * A modal used to deploy a strategy
 */

import { StepsModal } from "components/steps-modal";
import { DeployModalProps } from "./types";
import { useEffect, useMemo } from "react";
import WrappedText from "components/wrappers/text";
import { getStepsTreeDescription } from "./utils/gen-tree-description";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import WrappedImage from "components/wrappers/image";
import { TokensBundle } from "components/tokens/bundle";
import { YCToken } from "@yc/yc-models";
import { BaseComponentProps } from "components/types";
import GradientButton from "components/buttons/gradient";
import { RegulerButton } from "components/buttons/reguler";

export const DeploymentModal = ({
  seedRootStep,
  treeRootStep,
}: DeployModalProps) => {
  /**
   * Get global details about the strategy from the global store
   */

  const title = useStrategyStore((state) => state.title);
  const network = useStrategyStore((state) => state.network);
  const depositToken = useStrategyStore((state) => state.depositToken);
  const visibility = useStrategyStore((state) => state.isPublic);

  /**
   * Memoize all of the above as "Sections"
   */
  const strategySections = useMemo(
    () => [
      {
        key: "Title",
        pair: (
          <div className="flex flex-row items-center">
            <WrappedText fontSize={16}>{title}</WrappedText>
          </div>
        ),
      },
      {
        key: "Network",
        pair: (
          <div className="flex flex-row items-center gap-2">
            <WrappedText fontSize={16}>{network?.name}</WrappedText>
            <WrappedImage
              src={network?.logo}
              width={28}
              height={28}
              className="rounded-full"
            />
          </div>
        ),
      },
      {
        key: "Deposit Token",
        pair: (
          <div className="flex flex-row gap-2 items-center ">
            <WrappedText fontSize={16}>{depositToken?.symbol}</WrappedText>
            <TokensBundle
              tokens={[depositToken as YCToken]}
              imageProps={{
                width: 28,
                height: 28,
              }}
            />
          </div>
        ),
      },
      {
        key: "Visibility",
        pair: (
          <div className="flex flex-row gap-0 items-center">
            <WrappedText fontSize={16} fontStyle="bold">
              {visibility === true ? "Public " : "Private"}
            </WrappedText>
            <WrappedText fontSize={16} fontStyle="bold">
              {visibility === true ? "✅" : "🔒"}
            </WrappedText>
          </div>
        ),
      },
    ],
    [title, network, depositToken, visibility]
  );

  /**
   * Run a useEffect on the root and seed steps, making them non writeable in here (view only mode)
   */
  useEffect(() => {
    seedRootStep.disableDescendantsWriteability();
    treeRootStep.disableDescendantsWriteability();

    return () => {
      treeRootStep.enableDescendentsWriteability();
    };
  }, []);

  /**
   * Memoize descriptions for the steps
   */
  const descriptions: [string, string] = useMemo(
    () =>
      getStepsTreeDescription(seedRootStep, treeRootStep) as [string, string],
    [seedRootStep, treeRootStep]
  );
  return (
    <div className="w-[80%] h-[80%] flex flex-row mx-auto my-auto overflow-hidden rounded-large ">
      <div className=" flex flex-col  bg-custom-bcomponentbg w-[100%] py-14 px-12 gap-10">
        <div className="flex flex-col gap-3">
          <WrappedText fontStyle="bold" fontSize={28}>
            {`Review Details For ${title}`}
          </WrappedText>
          <WrappedText fontSize={14} className="w-[100%] whitespace-pre-wrap ">
            {descriptions[0]}
          </WrappedText>
          <WrappedText fontSize={14} className="w-[100%] whitespace-pre-wrap ">
            {descriptions[1]}
          </WrappedText>
        </div>
        <div className="flex flex-col gap-6">
          {strategySections.map((section) => {
            return <KeyPairSection section={section} />;
          })}
        </div>
        <div className="flex flex-row items-center w-[60%] mt-auto justify-between ">
          <RegulerButton
            style={{
              paddingLeft: "2rem",
              paddingRight: "2rem",
            }}
            className="tablet:content-['X']"
          >
            Cancel
          </RegulerButton>
          <GradientButton
            style={{
              paddingLeft: "2rem",
              paddingRight: "2rem",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
            }}
            className="tablet:content-['Hey']"
          >
            Deploy 🚀
          </GradientButton>
        </div>
      </div>
      <div className="bg-custom-componentbg w-[100%]">
        <StepsModal
          root={treeRootStep}
          baseRootStep={seedRootStep}
          wrapperProps={{
            style: {
              width: "100%",
              height: "100%",
              zIndex: 1000,
            },
          }}
          parentStyle={{
            height: "100%",
          }}
          comparisonCallback={() => {}}
          canvasID="DEPLOYMENT_MODAL_STEPS_VIEW"
        />
      </div>
    </div>
  );
};

/**
 * Component for a key-pair section in the details section
 */

const KeyPairSection = ({
  section,
}: {
  section: { key: string; pair: React.ReactNode };
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <WrappedText fontStyle="bold" fontSize={16}>
        {section.key}
      </WrappedText>
      {section.pair}
    </div>
  );
};
