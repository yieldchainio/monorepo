import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import styles from "../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "../Contexts/DatabaseContext";
import { ButtonVariants } from "../MotionVariants";
import { MediumNode } from "./MediumNodes";
import { SizingEnum, NodeStepEnum } from "./Enums";
import { AutoLine } from "./AutoLine";
import { ConfirmStrategy } from "./ConfirmStrategy";
import { HarvestConfig } from "./Configs/Harvest";
import { useGesture, usePinch } from "@use-gesture/react";
import { FrequencyModal } from "./FrequencyModal";
import { rawCalcInterval, toTitleCase } from "utils/utils";
import { EditDistributionModal } from "./EditDistributionModal";
import { HoverDetails } from "HoverDetails";
import { AddLiquidityConfig } from "./Configs/AddLiquidity";
import { hover } from "@testing-library/user-event/dist/hover";
import { TokenSwapModal } from "TokenSwapModal";

export const ActionableTokensTab = (props: any) => {
  const { actionableTokens, quickAddActions } = useContext(StrategyContext);
  const { fullTokensList } = useContext(DatabaseContext);

  const [testData, setTestData] = useState<any>(null);
  const [useEffectRan, setUseEffectRan] = useState<boolean>(false);
  const leftOverTokens = useRef(0);

  if (fullTokensList) {
    return (
      <div>
        <div className={styles.actionableTokensTab}>
          <div className={styles.actionableTokensOffText}>
            Actionable Tokens:{" "}
          </div>
          <div className={styles.actionableTokensIconsContainer}>
            {!actionableTokens.length
              ? "Start Building The Strategy To See Actionable Tokens"
              : actionableTokens.map(
                  (token: any, index: number, arr: any[]) => {
                    if (index > 5) {
                      leftOverTokens.current = leftOverTokens.current + 1;
                      return <div key={index}></div>;
                    } else {
                      return (
                        <img
                          src={token.logo}
                          alt=""
                          className={styles.actionableTokenIcon}
                          key={index}
                        />
                      );
                    }
                  }
                )}
          </div>
          {leftOverTokens.current > 0 ? (
            <div
              className={styles.actionableTokensMoreText}
            >{`+${leftOverTokens.current} More`}</div>
          ) : null}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export const StrategyBoilerplate = (props: any) => {
  /***************************************************************************
   * Navigation Decleration
   **************************************************************************/

  const navigate = useNavigate();

  /***************************************************************************
   * @Strategy - Current Session's Strategy Context
   **************************************************************************/
  const {
    strategyName,
    setStrategyName,
    depositToken,
    setDepositToken,
    setShowPercentageBox,
    showPercentageBox,
    strategyProcessLocation,
    setStrategyProcessLocation,
    StrategyProcessSteps,
    strategySteps,
    actionableTokens,
    quickAddActions,
    baseSteps,
    strategyNetworks,
    executionInterval,
    setExecutionInterval,
  } = useContext(StrategyContext);

  /**************************************************************************
   * @Database - Database Context
   *************************************************************************/
  const {
    fullProtocolsList,
    fullAddressesList,
    fullTokensList,
    fullNetworksList,
    fullStrategiesList,
    fullProtocolsNetworksList,
    protocolsAddressesList,
    accountAddress,
    setAccountAddress,
    baseStrategyABI,
    erc20ABI,
    provider,
    signer,
  } = useContext(DatabaseContext);

  /**
   * @ContextState - Context About The Current Strategy State, Mostly
   * For Styling Purposes
   */

  const { style } = props;

  const showStrategyObject = () => {
    let strategyObject = {
      strategyName: strategyName,
      depositToken: depositToken,
      baseSteps: baseSteps,
      strategySteps: strategySteps,
      networks: strategyNetworks,
      quickAddActions: quickAddActions,
    };

    console.log(strategyObject);
  };

  return (
    <div className={styles.blackTopHeader} style={{ ...style, zIndex: "11" }}>
      <div className={styles.leftCornerProcess}>
        <motion.div
          className={styles.leftCornerTurnedOffText}
          whileHover={{
            color: "rgb(255, 255, 255, 255)",
            transition: { duration: 0.1 },
          }}
          layout
          style={style}
          onClick={() => showStrategyObject()}
        >
          Base Strategy
        </motion.div>
        <motion.img
          src="/leftCornerProcessArrow.svg"
          alt=""
          className={styles.leftCornerProcessArrow}
        />
        <div className={styles.leftCornerTurnedOnText}>Create Strategy</div>
      </div>
      <div className={styles.rightProcessContainer}>
        <motion.button
          className={styles.deployButtonRightCorner}
          variants={ButtonVariants}
          whileHover={"hover"}
          onClick={() => props.openConfirmStrategy(true)}
        >
          Deploy Strategy
        </motion.button>
        <div className={styles.strategyExecutionTimestampContainer}>
          <div className={styles.strategyExecutionTimestampOffText}>
            Strategy Runs:
          </div>
          <div className={styles.strategyExecutionTimestampOnText}>
            {executionInterval
              ? `${rawCalcInterval(executionInterval).interval} ${toTitleCase(
                  rawCalcInterval(executionInterval).unit
                )} `
              : "Unset"}
          </div>
          <motion.img
            src="/editicon.svg"
            alt=""
            className={styles.strategyExecutionTimestampEditIcon}
            whileHover={{ opacity: 0.8, transition: { duration: 0.2 } }}
            onClick={() => props.openFrequencyModal(true)}
          />
        </div>
      </div>
    </div>
  );
};

export const StrategyDraggableContainer = (props: any) => {
  const { currentDimensions } = props;
  const draggableContainerSize = useRef<any>();

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        className={styles.draggableContainer}
        ref={draggableContainerSize}
        style={{ overflow: "hidden" }}
      >
        <motion.div
          className={styles.draggableBackground}
          drag
          dragElastic={1}
          style={{
            width: `200px`,
            height: `20000px`,
            overflow: "hidden",
          }}
        ></motion.div>
      </div>
    </div>
  );
};

export const NodeStep = React.forwardRef((props: any, ref: any) => {
  let { processStep } = props;
  const [nodeProcessStep, setNodeProcessStep] = useState<any>(processStep);

  useEffect(() => {
    setNodeProcessStep(processStep);
  }, [processStep]);

  if (props.size === SizingEnum.MEDIUM) {
    return (
      <MediumNode
        style={props.style}
        nodeProcessStep={nodeProcessStep}
        setNodeProcessStep={setNodeProcessStep}
        stepId={props.stepId}
        ref={ref}
        stepDetails={props.stepDetails}
        optionalAction={props.optionalAction}
        hoverHandler={props.hoverHandler}
      />
    );
  } else {
    // TODO: - Add Mini Node Component
    return (
      <div>
        <div>Mini Node</div>
      </div>
    );
  }
});

export const StrategyBuilder = (props: any) => {
  // Context About The Current Strategy
  const {
    strategySteps,
    setStrategySteps,
    d3StrategyHirarchy,
    d3StrategyHirarchySizing,
    executionInterval,
    showTokenModal,
    setShowTokenModal,
  } = useContext(StrategyContext);
  const { fullProtocolsList } = useContext(DatabaseContext);
  // Keeps Track Of The Current Size Of The Draggable Container
  const [draggableContainerSize, setDraggableContainerSize] = useState<any>({
    width: {
      integer: window.innerWidth,
      unit: "px",
    },
    height: {
      integer: window.innerHeight,
      unit: "px",
    },
  });
  const [viewportSize, setViewportSize] = useState<any>({
    width: {
      integer: window.innerWidth,
      unit: "px",
    },
    height: {
      integer: window.innerHeight,
      unit: "px",
    },
  });

  const draggableContainerRef = useRef<any>();
  const draggableBackgroundRef = useRef<any>();

  // Keeps track of current container zoom
  const [zoom, setZoom] = useState(1);
  useGesture(
    {
      onPinch: ({ origin: [ox, oy], movement: [md], offset: [d] }) =>
        setZoom((zoom) => (d / 5 > 1.25 ? 1 + 1.25 : 1 + d / 5)),
    },
    {
      target: draggableContainerRef,
      eventOptions: { passive: false },
    }
  );
  const [isConfirmStrategyOpen, setIsConfirmStrategyOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(true);
  const [isEditDistributionOpen, setIsEditDistributionOpen] =
    useState<any>(false);
  const [hoverOpen, setHoverOpen] = useState<any>(false);

  // Opening frequency modal once when user enters the page if their timestamp is not
  // yet set
  useEffect(() => {
    if (!executionInterval) {
      // TODO: Set this when not testing
      // setIsFrequencyModalOpen(true);
    }
  }, []);

  // Sizing of the nodes
  // TODO: For the future, create mini / even large version of nodes, dynamically
  // TODO: Chaange based on zooming
  const [currentSize, setCurrentSize] = useState(SizingEnum.MEDIUM);

  useEffect(() => {
    window.addEventListener("resize", (e: any) =>
      setViewportSize({
        width: e.target.innerWidth,
        height: e.target.innerHeight,
      })
    );

    return () =>
      window.removeEventListener("resize", (e: any) =>
        setViewportSize({
          width: e.target.innerWidth,
          height: e.target.innerHeight,
        })
      );
  }, []);

  useEffect(() => {
    let newObject;
    newObject = {
      width: {
        integer:
          viewportSize.width.integer >= d3StrategyHirarchySizing.width.integer
            ? viewportSize.width.integer
            : d3StrategyHirarchySizing.width.integer,
        unit: "px",
      },
      height: {
        integer:
          viewportSize.height.integer >= d3StrategyHirarchySizing.height.integer
            ? viewportSize.height.integer
            : d3StrategyHirarchySizing.height.integer,

        unit: "px",
      },
    };
    setDraggableContainerSize(newObject);
  }, [viewportSize, d3StrategyHirarchySizing]);

  useEffect(() => {
    console.log("zoom", zoom);
  }, [zoom]);

  useEffect(() => {
    console.log("Hover Opened!", hoverOpen);
  }, [hoverOpen]);

  return (
    <body style={{ overflow: "hidden" }}>
      <div className={styles.pageDiv} style={{ overflowY: "hidden" }}>
        {isConfirmStrategyOpen && (
          <ConfirmStrategy modalHandler={setIsConfirmStrategyOpen} />
        )}
        {showTokenModal && (
          <TokenSwapModal
            target={showTokenModal.target}
            choiceHandler={showTokenModal.choiceHandler}
            modalHandler={setShowTokenModal}
          />
        )}
        <StrategyBoilerplate
          openConfirmStrategy={setIsConfirmStrategyOpen}
          openFrequencyModal={setIsFrequencyModalOpen}
          style={{ overflow: "hidden" }}
        />
        <ActionableTokensTab />
        {isFrequencyModalOpen && (
          <FrequencyModal modalHandler={setIsFrequencyModalOpen} />
        )}
        {isEditDistributionOpen && (
          <EditDistributionModal
            modalHandler={setIsEditDistributionOpen}
            parentId={isEditDistributionOpen.parentId}
            childId={isEditDistributionOpen.childId}
            unusedPercentage={
              100 -
              strategySteps
                .filter(
                  (_step: any) =>
                    _step.parentId === isEditDistributionOpen.parentId
                )
                .map((_step: any) => _step.percentage)
                .reduce((a: any, b: any) => a + b, 0)
            }
            locationDetails={{
              top: isEditDistributionOpen.top,
              left: isEditDistributionOpen.left,
            }}
            percentage={isEditDistributionOpen.percentage}
          />
        )}
        {hoverOpen && (
          <HoverDetails
            top={hoverOpen.top}
            left={hoverOpen.left}
            text={hoverOpen.text}
          />
        )}

        <div
          className={styles.draggableContainer}
          style={{
            zIndex: "10",
            width: `${draggableContainerSize.width.integer}${draggableContainerSize.width.unit}`,
            height: `${draggableContainerSize.height.integer}${draggableContainerSize.height.unit}`,
            top: "0px",
            position: "absolute",
            overflow: "hidden",
            scale: zoom,
          }}
          ref={draggableContainerRef}
        >
          <motion.div
            className={styles.draggableBackground}
            drag
            dragElastic={0}
            dragMomentum={false}
            style={{
              width: `${draggableContainerSize.width.integer}${draggableContainerSize.width.unit}`,
              height: `${draggableContainerSize.height.integer}${draggableContainerSize.height.unit}`,
              scale: zoom,
            }}
            dragConstraints={{
              bottom: 0,
              top: parseInt(
                `${
                  -200 +
                  viewportSize.height.integer -
                  draggableContainerSize.height.integer
                }`
              ),
              left: parseInt(
                `${
                  viewportSize.width.integer -
                  draggableContainerSize.width.integer
                }`
              ),
              right: 0,
              // right: parseInt(
              //   `${
              //     viewportSize.width.integer -
              //     draggableContainerSize.width.integer
              //   }`
              // ),
            }}
          >
            {/* <AddLiquidityConfig
              size={currentSize}
              stepId={1}
              style={{
                top: "96px",
                left: "400px",
              }}
            /> */}
            {d3StrategyHirarchy.map((step: any, index: number, arr: any[]) => {
              let tStyle: any = {
                top: `${96 + step.position.y}px`,
                left: `${
                  draggableContainerSize.width.integer / 2 -
                  step.width / 2 +
                  step.position.x
                }px`,
                position: "absolute",
                zIndex: `1`,
              };

              let nodeChilds = step.children;

              if (step.type == "swapcomponent") {
                return (
                  <div>
                    <div
                      className={styles.batchSwapBlock}
                      style={tStyle}
                      key={index}
                    >
                      <div className={styles.batchSwapText}>Swap</div>
                      <img
                        src="/lifi.png"
                        alt=""
                        className={styles.batchSwapImg}
                      />
                    </div>
                    {nodeChilds
                      ? nodeChilds
                          .filter(
                            (step: any) =>
                              step.type !== NodeStepEnum.PLACEHOLDER &&
                              !step.empty
                          )
                          .map((child: any, indexx: number) => {
                            let newObj = {
                              ...child.data,
                              position: { x: child.x, y: child.y },
                            };
                            return (
                              <AutoLine
                                parentNode={{
                                  width: step.width,
                                  height: step.height,
                                  position: {
                                    x:
                                      draggableContainerSize.width.integer / 2 -
                                      step.width / 2 +
                                      step.position.x,
                                    y: 96 + step.position.y,
                                  },
                                  stepId: step.step_identifier,
                                }}
                                childNode={{
                                  width: newObj.width,
                                  height: newObj.height,
                                  position: {
                                    x:
                                      draggableContainerSize.width.integer / 2 -
                                      newObj.width / 2 +
                                      newObj.position.x,
                                    y: 96 + newObj.position.y,
                                  },
                                  type: newObj.type,
                                  empty: newObj.empty ? newObj.empty : false,
                                  stepId: newObj.step_identifier,
                                  percentage: newObj.percentage,
                                }}
                                key={indexx}
                                percentageModalHandler={
                                  setIsEditDistributionOpen
                                }
                              />
                            );
                          })
                      : null}
                  </div>
                );
              }

              if (step.type == "deposittoken") {
                return (
                  <div>
                    <img
                      src={step.token.logo}
                      alt=""
                      className={styles.depositTokenImg}
                      style={tStyle}
                      key={index}
                    />
                    {nodeChilds
                      ? nodeChilds
                          .filter(
                            (step: any) =>
                              step.type !== NodeStepEnum.PLACEHOLDER &&
                              !step.empty
                          )
                          .map((child: any, indexx: number) => {
                            let newObj = {
                              ...child.data,
                              position: { x: child.x, y: child.y },
                            };
                            return (
                              <AutoLine
                                parentNode={{
                                  width: step.width,
                                  height: step.height,
                                  position: {
                                    x:
                                      draggableContainerSize.width.integer / 2 -
                                      step.width / 2 +
                                      step.position.x,
                                    y: 96 + step.position.y,
                                  },
                                  stepId: step.step_identifier,
                                }}
                                childNode={{
                                  width: newObj.width,
                                  height: newObj.height,
                                  position: {
                                    x:
                                      draggableContainerSize.width.integer / 2 -
                                      newObj.width / 2 +
                                      newObj.position.x,
                                    y: 96 + newObj.position.y,
                                  },
                                  type: newObj.type,
                                  empty: newObj.empty ? newObj.empty : false,
                                  stepId: newObj.step_identifier,
                                  percentage: newObj.percentage,
                                }}
                                key={indexx}
                                percentageModalHandler={
                                  setIsEditDistributionOpen
                                }
                              />
                            );
                          })
                      : null}
                  </div>
                );
              }

              if (step.type == "tokens") {
                return (
                  <div>
                    <div style={tStyle}>
                      <div className={styles.baseTokensContainer}>
                        {step.tokens.map((token: any, index: number) => (
                          <img
                            src={token.logo}
                            alt=""
                            className={styles.baseTokenImg}
                            key={index}
                          />
                        ))}
                      </div>
                    </div>
                    {nodeChilds
                      ? nodeChilds
                          .filter(
                            (step: any) =>
                              step.type !== NodeStepEnum.PLACEHOLDER &&
                              !step.empty
                          )
                          .map((child: any, indexx: number) => {
                            let newObj = {
                              ...child.data,
                              position: { x: child.x, y: child.y },
                            };
                            return (
                              <AutoLine
                                parentNode={{
                                  width: step.width,
                                  height: step.height,
                                  position: {
                                    x:
                                      draggableContainerSize.width.integer / 2 -
                                      step.width / 2 +
                                      step.position.x,
                                    y: 96 + step.position.y,
                                  },
                                  stepId: step.step_identifier,
                                }}
                                childNode={{
                                  width: newObj.width,
                                  height: newObj.height,
                                  position: {
                                    x:
                                      draggableContainerSize.width.integer / 2 -
                                      newObj.width / 2 +
                                      newObj.position.x,
                                    y: 96 + newObj.position.y,
                                  },
                                  type: newObj.type,
                                  empty: newObj.empty ? newObj.empty : false,
                                  stepId: newObj.step_identifier,
                                  percentage: newObj.percentage,
                                }}
                                key={indexx}
                                percentageModalHandler={
                                  setIsEditDistributionOpen
                                }
                              />
                            );
                          })
                      : null}
                  </div>
                );
              }

              let doesHaveStepDetails = step.function_identifiers.length > 0;
              let isPlaceholder = step.type == NodeStepEnum.PLACEHOLDER;

              let currentNodeProcessStep;

              if (doesHaveStepDetails) {
                currentNodeProcessStep = NodeStepEnum.COMPLETE;
              } else if (step.type == NodeStepEnum.CHOOSE_ACTION) {
                currentNodeProcessStep = NodeStepEnum.CHOOSE_ACTION;
              } else if (step.type == NodeStepEnum.PLACEHOLDER) {
                currentNodeProcessStep = NodeStepEnum.PLACEHOLDER;
              }

              return (
                <div>
                  <NodeStep
                    size={currentSize}
                    stepId={step.step_identifier}
                    style={tStyle}
                    processStep={currentNodeProcessStep}
                    key={index}
                    stepDetails={step}
                    hoverHandler={setHoverOpen}
                  />
                  {nodeChilds
                    ? nodeChilds
                        .filter(
                          (step: any) =>
                            step.type !== NodeStepEnum.PLACEHOLDER &&
                            !step.empty
                        )
                        .map((child: any, indexx: number) => {
                          let newObj = {
                            ...child.data,
                            position: { x: child.x, y: child.y },
                          };
                          return (
                            <AutoLine
                              parentNode={{
                                width: step.width,
                                height: step.height,
                                position: {
                                  x:
                                    draggableContainerSize.width.integer / 2 -
                                    step.width / 2 +
                                    step.position.x,
                                  y: 96 + step.position.y,
                                },
                                stepId: step.step_identifier,
                              }}
                              childNode={{
                                width: newObj.width,
                                height: newObj.height,
                                position: {
                                  x:
                                    draggableContainerSize.width.integer / 2 -
                                    newObj.width / 2 +
                                    newObj.position.x,
                                  y: 96 + newObj.position.y,
                                },
                                type: newObj.type,
                                empty: newObj.empty ? newObj.empty : false,
                                stepId: newObj.step_identifier,
                                percentage: newObj.percentage,
                              }}
                              key={indexx}
                              percentageModalHandler={setIsEditDistributionOpen}
                            />
                          );
                        })
                    : null}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </body>
  );
};
