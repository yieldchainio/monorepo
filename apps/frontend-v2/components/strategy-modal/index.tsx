/**
 * A modal for the strategies
 */
import { ModalWrapperProps } from "components/modal-wrapper/types";
import { ModalWrapper } from "components/modal-wrapper";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import "../../css/globals.css";
import { TitleSection } from "./components/title-section";
import { ProfileSection } from "./components/profile-section";
import { ValueLocked } from "./components/body-sections/value-locked";
import { GasThroughput } from "./components/body-sections/gas-throughput";
import { useYCStrategy } from "utilities/hooks/yc/useYCStrategy";
import { GasBalance } from "./components/body-sections/gas-balance";
import { ApyChart } from "./components/body-sections/apy-chart";
import { StrategyOperationsBox } from "./components/body-sections/deposit-withdrawls";
import { useSteps } from "utilities/hooks/stores/steps";
import { Step } from "utilities/classes/step";
import { useEffect } from "react";
import { useDynamicStore } from "utilities/hooks/stores/dynamic";
import { useLogs } from "utilities/hooks/stores/logger";

/**
 * @param strategyID - The ID of the strategy to display
 */
interface StratregyModalProps extends Omit<ModalWrapperProps, "children"> {
  strategyID: string;
}

// The component
export const StrategyModal = ({
  strategyID,
  modalKey,
  closeFunction,
  callbackRoute = "/",
}: StratregyModalProps) => {
  // Keeping a state of the strategy
  const strategy = useYCStore((state) =>
    state.context.YCstrategies.find((strat) => strat.id === strategyID)
  );

  // Context
  const context = useYCStore((state) => state.context);

  // Get the steps store
  const stepsStore = useDynamicStore(
    useSteps,
    strategy?.rootStep
      ? Step.fromDBStep({ step: strategy.rootStep.toJSON(), context: context })
      : null
  );

  // useEffect to set the steps when rootStep is ready
  useEffect(() => {
    if (strategy?.rootStep) {
      stepsStore.setRootStep(
        Step.fromDBStep({ step: strategy.rootStep.toJSON(), context: context })
      );
    }
  }, [JSON.stringify(stepsStore.rootStep?.toJSON())]);

  // Return the JSX
  return (
    <ModalWrapper
      modalKey={modalKey}
      callbackRoute={callbackRoute || "/"}
      closeFunction={closeFunction}
    >
      <div className=" w-[80vw] h-[300vh] bg-custom-bcomponentbg mt-8 rounded-lg flex flex-col items-center justify-start p-8 gap-6">
        <TitleSection
          logo={strategy?.depositToken?.logo}
          symbol={strategy?.depositToken?.symbol}
          title={strategy?.title}
        />
        <div className="w-full h-full flex flex-col items-center justify-start gap-3 max-w-[1250px] ">
          <ApyChart strategy={strategy} />
          <div className="flex flex-row w-full h-[40%] tablet:h-[40%] gap-3 items-end justify-between ">
            <div
              className="flex flex-col w-[100%] h-full gap-3 tablet :w-[35%] flex-wrap tablet:flex-row tablet:gap-3 justify-start items-start "
              onClick={() =>
                console.log("Strategy Network", strategy?.network?.nativeToken)
              }
            >
              <ValueLocked strategy={strategy} />
              <GasThroughput
                gasIn={10000000000000000n}
                gasOut={20000000000000000n}
                token={strategy?.depositToken}
              />
              <GasBalance strategy={strategy} />
            </div>
            <StrategyOperationsBox strategy={strategy} />
          </div>
          <ProfileSection user={strategy?.creator} />
        </div>
      </div>
    </ModalWrapper>
  );
};
