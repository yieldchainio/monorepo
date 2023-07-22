/**
 * A modal used to deploy a strategy
 */

import { StepsModal } from "components/modals/steps";
import { DeployModalProps } from "./types";
import { useEffect, useMemo, useState } from "react";
import WrappedText from "components/wrappers/text";
import { getStepsTreeDescription } from "./utils/gen-tree-description";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import WrappedImage from "components/wrappers/image";
import { TokensBundle } from "components/tokens/bundle";
import {
  JSONStrategy,
  JSONStep,
  YCClassifications,
  YCStrategy,
  YCToken,
  address,
  VAULT_CREATED_EVENT_SIGNATURE,
} from "@yc/yc-models";
import GradientButton from "components/buttons/gradient";
import { RegulerButton } from "components/buttons/reguler";
import { getDeploymentData } from "./utils/get-deployment-data";
import { useLogs } from "utilities/hooks/stores/logger";
import { v4 as uuid } from "uuid";
import { useSigner } from "wagmi";
import useYCUser from "utilities/hooks/yc/useYCUser";
import { addStrategy } from "./utils/add-strategy";
import { useRouter } from "next/navigation";
import { InfoProvider } from "components/info-providers";
import { useSubmitTransactions } from "utilities/hooks/web3/useSubmitTransactions";
import { TransactionReceipt } from "components/transactions-submmiter/types";
import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils.js";

export const DeploymentModal = ({
  seedRootStep,
  treeRootStep,
  onClick,
}: DeployModalProps) => {
  /**
   * Get global details about the strategy from the global store
   */

  const logs = useLogs();

  const title = useStrategyStore((state) => state.title);
  const network = useStrategyStore((state) => state.network);
  const depositToken = useStrategyStore((state) => state.depositToken);
  const visibility = useStrategyStore((state) => state.isPublic);

  const router = useRouter();

  const { address, id } = useYCUser();

  const { data: signer, isLoading, isError } = useSigner();

  const { submitTransactions } = useSubmitTransactions();

  const deployStrategy = async (builderResult: {
    uprootSteps: JSONStep;
    deploymentCalldata: string;
  }) => {
    if (!network)
      throw logs.lazyPush({
        type: "error",
        message: "Invalid Network - Cannot Deploy.",
      });

    submitTransactions(
      [
        {
          type: "createVault",
          builderResult,
          network: network,
          strategy: {
            id: uuid(),
            title: title || "",
            chain_id: network?.id || 1,
            deposit_token_id: depositToken?.id || "",
            creator_id: id || "",
            verified: false,
            seed_steps: seedRootStep.toDeployableJSON() as any,
            tree_steps: treeRootStep.toDeployableJSON() as any,
            uproot_steps: builderResult.uprootSteps as any,
          },
        },
      ],
      (receipts: TransactionReceipt[]) => {
        console.log("Receipts,", receipts);
        addDeployedStrategy(builderResult, receipts[0]);
      }
    );
  };

  const addDeployedStrategy = async (
    builderResult: {
      uprootSteps: JSONStep;
      deploymentCalldata: string;
    },
    deploymentReceipt: TransactionReceipt
  ) => {
    console.log("Receipt", deploymentReceipt);
    if (!deploymentReceipt) return;

    const deployLog = deploymentReceipt.logs.find(
      (log) => log.topics[0] == ethers.utils.id(VAULT_CREATED_EVENT_SIGNATURE)
    );

    if (!deployLog) return "Finding Strategy Address...";

    const vaultAddress: address = defaultAbiCoder.decode(
      ["address"],
      deployLog.topics[1]
    )[0];

    const jsonStrategy = {
      id: uuid(),
      title: title || "",
      chain_id: network?.id || 1,
      deposit_token_id: depositToken?.id || "",
      creator_id: id || "",
      verified: false,
      seed_steps: seedRootStep.toDeployableJSON() as any,
      tree_steps: treeRootStep.toDeployableJSON() as any,
      uproot_steps: builderResult.uprootSteps as any,
      execution_interval: 500,
      address: vaultAddress,
      createdAt: new Date(),
    };

    const strategy = new YCStrategy(
      jsonStrategy,
      YCClassifications.getInstance()
    );

    await addStrategy({
      id: strategy.id,
      address: strategy.address,
      creatorID: id || "",
      seedSteps: seedRootStep.toDeployableJSON() as any,
      treeSteps: treeRootStep.toDeployableJSON() as any,
      uprootSteps: builderResult.uprootSteps,
      vaultVisibility: visibility,
      depositTokenID: depositToken?.id as string,
      chainID: network?.id as number,
      verified: true,
      title: title as string,
    });

    YCClassifications.getInstance().YCstrategies.push(strategy);

    router.push(`/app/strategy/${strategy.id}`);
  };

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
    <div
      className="w-[80%] h-[80%] flex flex-row mx-auto my-auto overflow-hidden rounded-large "
      onClick={onClick}
    >
      <div className=" flex flex-col  bg-custom-bcomponentbg w-[100%] py-14 px-12 gap-10 overflow-x-hidden">
        <div className="flex flex-col gap-3 overflow-x-hidden">
          <WrappedText fontStyle="bold" fontSize={28} className="truncate">
            {`Review Details For ${title}`}
          </WrappedText>
          <div className="flex flex-col gap-3  ">
            <WrappedText
              fontSize={14}
              className="w-[100%] whitespace-pre-wrap  text-ellipsis "
            >
              {descriptions[0]}
            </WrappedText>
            <InfoProvider
              contents={
                <WrappedText fontSize={14} className="whitespace-pre-wrap">
                  {descriptions[1]}
                </WrappedText>
              }
              style={{
                width: "400px",
                whiteSpace: "pre-wrap",
                height: "max",
              }}
            >
              <WrappedText
                fontSize={14}
                className="w-[100%] overflow-y-visible overflow-x-hidden  text-ellipsis "
              >
                {descriptions[1]}
              </WrappedText>
            </InfoProvider>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {strategySections.map((section, i) => {
            return <KeyPairSection section={section} key={`${i}`} />;
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
            onClick={async () => {
              const deploymentDataPromise = getDeploymentData(
                {
                  seedSteps: seedRootStep.toDeployableJSON() as JSONStep,
                  treeSteps: treeRootStep.toDeployableJSON() as JSONStep,
                  vaultVisibility: visibility,
                  depositTokenID: depositToken?.id as string,
                  chainID: network?.id as number,
                },
                (message: string) => logs.lazyPush({ message, type: "info" })
              );

              logs.lazyPush({
                message: "Please Wait While We Build Strategy Input...",
                lifespan: deploymentDataPromise,
              });

              const builderResult = await deploymentDataPromise;

              if (!network || !depositToken || !title)
                return logs.lazyPush({
                  type: "error",
                  message:
                    "Please Complete All Strategy Details Before Deploying",
                });

              if (!builderResult || !builderResult.uprootSteps.id)
                return logs.lazyPush({
                  type: "error",
                  message:
                    "Building Strategy Failed. Please Contact Team On Telegram/Discord",

                  lifespan: 10000,
                });

              await deployStrategy(builderResult);
            }}
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
