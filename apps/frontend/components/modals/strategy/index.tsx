/**
 * A modal for the strategies
 */
import { ModalWrapperProps } from "components/modals/base/wrapper/types";
import { ModalWrapper } from "components/modals/base/wrapper";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import "css/globals.css";
import { TitleSection } from "./components/title-section";
import { ProfileSection } from "./components/profile-section";
import { ValueLocked } from "./components/body-sections/value-locked";
import { GasThroughput } from "./components/body-sections/gas-throughput";
import { GasBalance } from "./components/body-sections/gas-balance";
import { ApyChart } from "./components/body-sections/apy-chart";
import { StrategyOperationsBox } from "./components/body-sections/deposit-withdrawls";
import { useEffect, useState } from "react";
import { StepsModal } from "components/modals/steps";
import { ToggleExpandText } from "./components/utility/toggleExpand";
import { useStateEffect } from "utilities/hooks/general/useStateEffect";
import WrappedImage from "components/wrappers/image";
import { useModals } from "utilities/hooks/stores/modal";
import { StepSizing } from "utilities/classes/step/types";
import WrappedText from "components/wrappers/text";

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

  // Head state keeping track of whether the steps are expanded or not
  const [expanded, setExpanded] = useStateEffect<boolean>(false, (state) =>
    setModalHeight(state ? "180vh" : "110vh")
  );

  // Utility steps based on the expanded state
  const [height, setModalHeight] = useState(() => {
    if (expanded === true) return "180vh";
    return "110vh";
  });

  // We consume the global modals state to push utility modals (Fund gas, steps fullscreen, etc)
  const modals = useModals();

  const [gasOut, setGasOut] = useState<bigint>(0n);

  useEffect(() => {
    if (!strategy?.address) return;

    (async () => {
      const runs = await strategy.getStrategyRuns();

      if (!runs.length) return;

      setGasOut(runs[0].fee);
    })();
  }, [strategy?.address]);

  // Return the JSX
  return (
    <ModalWrapper
      modalKey={modalKey}
      callbackRoute={callbackRoute || "/app"}
      closeFunction={closeFunction}
    >
      <div
        className=" w-[80vw]  bg-custom-darkSubbg rounded-lg flex flex-col items-center justify-start px-8 pt-8 gap-6 relative overflow-hidden"
        style={{
          height: height,
        }}
      >
        <TitleSection
          logo={strategy?.depositToken?.logo}
          symbol={strategy?.depositToken?.symbol}
          title={strategy?.title}
        />
        <div className="w-full h-[150%] flex flex-col items-center justify-start gap-3 max-w-[1250px] ">
          <ApyChart strategy={strategy} />
          <div className="flex flex-row w-full h-[40%] tablet:h-[40%] gap-3 items-end justify-between ">
            <div className="flex flex-col w-[100%] h-full gap-3 tablet :w-[35%] flex-wrap tablet:flex-row tablet:gap-3 justify-start items-start ">
              <ValueLocked strategy={strategy} />
              <GasThroughput
                gasIn={10000000000000000n}
                gasOut={gasOut}
                token={strategy?.network?.nativeToken}
              />
              <GasBalance strategy={strategy} />
            </div>
            <StrategyOperationsBox strategy={strategy} />
          </div>
          <ProfileSection user={strategy?.creator} />
          {expanded && (
            <div className="w-full  flex flex-row items-center justify-center z-1000">
              <div
                className="group flex flex-row items-center cursor-pointer hover:scale-95 transition duration-200 ease-in-out"
                onClick={() => setExpanded(!expanded)}
              >
                <WrappedText fontSize={20} fontStyle="bold">
                  Minimize
                </WrappedText>
                <WrappedImage
                  src={{
                    dark: "/icons/dropdown-arrow-light.svg",
                    light: "/icons/dropdown-arrow-dark.svg",
                  }}
                  width={28}
                  height={28}
                  className="group-hover:opacity-80  transition duration-200 ease-in-out rotate-[-90deg] group-hover:rotate-[0deg] "
                ></WrappedImage>
              </div>
            </div>
          )}
          <div
            className="w-full"
            style={{
              height: expanded ? "115%" : "30%",
            }}
          >
            <StepsModal
              strategy={strategy}
              wrapperProps={{
                style: {
                  height: "100%",
                  width: "100%",
                },
              }}
              parentStyle={{
                height: "100%",
                width: "100%",
              }}
            />
          </div>
        </div>

        {!expanded && (
          <div className="flex flex-col items-center justify-end w-full h-[28%]  absolute top-[100%] translate-y-[-100%] pb-10">
            <div
              className="group flex flex-row gap-1 items-center z-10 cursor-pointer transition duration-200 ease-in-out hover:scale-105"
              onClick={() => setExpanded(!expanded)}
            >
              <WrappedText fontSize={20} fontStyle="bold">
                Expand
              </WrappedText>
              <WrappedImage
                src={{
                  dark: "/icons/dropdown-arrow-light.svg",
                  light: "/icons/dropdown-arrow-dark.svg",
                }}
                width={28}
                height={28}
                className="group-hover:opacity-80  transition duration-200 ease-in-out group-hover:rotate-[-90deg] "
              ></WrappedImage>
            </div>
            <div className="bg-custom-bg opacity-80 blur-xl w-full h-[90%] absolute top-[100%] translate-y-[-100%]"></div>
          </div>
        )}

        {/* {!expanded && (
          <div className="w-[80vw] absolute h-[15%] z-1000000000000 bg-gradient-to-t from-custom-bcomponentbg/100 to-custom-bcomponentbg/10  flex flex-row items-end justify-center pb-10 top-[100%] translate-y-[-100%] z-100">
            {" "}
            <ToggleExpandText
              state={expanded}
              setState={setExpanded}
              style={{ zIndex: 100000 }}
            ></ToggleExpandText>
          </div>
        )}
        <div
          className="w-full relative z-10  "
          style={{
            bottom: !expanded ? "13%" : "12%",
            height: !expanded ? "1%" : "40%",
          }}
        >
          {expanded && (
            <div className="w-[80vw] top-[100%]  absolute z-1000 left-[-2.3vw] flex flex-row items-center justify-center  ">
              {" "}
              <ToggleExpandText
                state={expanded}
                setState={setExpanded}
                style={{ zIndex: 100000 }}
              ></ToggleExpandText>
            </div>
          )} */}

        {/* <div
            style={{
              pointerEvents: expanded ? "auto" : "none",
              zIndex: 100000,
            }}
          >
            <StepsModal
              strategy={strategy}
              options={{
                initialSize: StepSizing.SMALL,
              }}
              style={{
                // background: "none",
                zIndex: 1000,
              }}
              parentStyle={{
                borderWidth: "0px",
                borderColor: "transparent",
              }}
              utilityButtons={[
                {
                  children: (
                    <WrappedImage
                      src={{
                        dark: "/icons/expand-light.svg",
                        light: "/icons/expand-dark.svg",
                      }}
                      width={14}
                      height={14}
                    />
                  ),

                  label: "Full Screen",
                  onClick: () =>
                    modals.push((id: number) => {
                      return {
                        component: (
                          <ModalWrapper modalKey={id}>
                            <StepsModal
                              strategy={strategy}
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
                    }),
                },
              ]}
            />
          </div> */}
        {/* </div> */}
      </div>
    </ModalWrapper>
  );
};
