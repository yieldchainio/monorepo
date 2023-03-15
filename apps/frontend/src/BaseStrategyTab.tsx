import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import styles from "./css/baseMiniTab.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { EditDistributionModal } from "./editDistribution";
import { MiniStepBlock, StepBlockMini } from "./StepBlockMini";
import {
  getStepDetails,
  isNumSymmetric,
  pingPongSymmetricalBlockSpread,
} from "utils/utils";
import { render } from "@testing-library/react";
import { RightLine, LeftLine, StraightLine } from "./Lines";

/**
 * The @Mini Tab Component That Sticks To The Bottom Of The Screen
 * Whilst Choosing The Base Steps Of The Strategy
 */
export const BaseStrategyMiniTab = (props: any) => {
  /***************************************************************************
   * Navigation Decleration
   **************************************************************************/

  /***************************************************************************
   * @Styling States
   **************************************************************************/

  const [isHoveringContinue, setIsHoveringContinue] = useState<boolean>(false);
  const [isHoveringExpand, setIsHoveringExpand] = useState<any>(false);

  const navigate = useNavigate();

  /***************************************************************************
   * @Strategy - Current Session's Strategy Context
   **************************************************************************/
  const {
    strategyName,
    setStrategyName,
    depositToken,
    setDepositToken,
    baseSteps,
    setBaseSteps,
    showPercentageBox,
    setShowPercentageBox,
    handleBaseStepAdd,
    unusedBaseBalance,
    setUnusedBaseBalance,
    isModalOpen,
    setIsModalOpen,
  } = useContext(StrategyContext);

  /***************************************************************************
   * @handles A Base Step Being Added, Adds It To The Global
   * State, Will Add Some Animations In The Future @TODO
   **************************************************************************/

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

  const handleExpand = () => {
    props.expandHandler(true);
    setIsModalOpen(true);
  };

  return (
    <div>
      {
        <EditDistributionModal
          setDivisor={handleBaseStepAdd}
          style={{ top: `400px` }}
        />
      }
      <div className={styles.miniTabBody}>
        <div className={styles.vaultDepositTokenTitle}>
          Vault Deposit Token:
        </div>
        <img
          src={depositToken.logo}
          alt=""
          className={styles.depositTokenImg}
        />
        <div className={styles.depositTokenName}>{depositToken.symbol}</div>
        <div className={styles.baseStepsTitle}>Base Steps:</div>
        {baseSteps.length > 0 ? (
          <div className={styles.baseStepsText}>
            {baseSteps
              .map((bStep: any) => bStep.type)
              .join(", ")
              .slice(0, 17)}
            {baseSteps.length > 1 ? "..." : ""}
          </div>
        ) : (
          <div className={styles.baseStepsText}>Choose Base Steps</div>
        )}
        <motion.img
          src="/expandicon.svg"
          alt=""
          className={styles.expandIcon}
          whileHover={{
            scale: 1.05,

            transition: { duration: 0.1 },
          }}
          onClick={() => handleExpand()}
        />
        {unusedBaseBalance > 0 && (
          <button className={styles.continueBtnOff}>
            Unused %: {unusedBaseBalance}%
          </button>
        )}

        <motion.div>
          <motion.button
            className={styles.continueBtnOn}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setIsHoveringContinue(!isHoveringContinue)}
            onHoverEnd={() => setIsHoveringContinue(!isHoveringContinue)}
            onClick={() => navigate(`/strategy-builder`)}
          >
            Continue
          </motion.button>
          <motion.svg
            layout
            width="10"
            height="8"
            viewBox="0 0 10 8"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.continueArrowImg}
            style={isHoveringContinue ? { scale: 1.1 } : {}}
          >
            <path
              fill="currentColor"
              d="M7.53388e-07 3.49495L6.15381e-07 4.50505L7.57576 4.50505L4.10353 7.28283L5 8L10 4L5 -2.79694e-07L4.10354 0.717171L7.57576 3.49495L7.53388e-07 3.49495Z"
            />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
};

/***************************************************************************
 * @handles Calcualtes How The Steps Blocks Should Be Spread, Returns
 * Component That Renders The Steps With The Correct Spacing & Connective
 * Lines
 **************************************************************************/

const calculateBaseChildSpread = async (props: any) => {
  const { steps } = props;
  let newSteps = [];
  if (steps.length == 1) {
    return <div></div>;
  }
};

export const BaseStrategyLargeTab = (props: any) => {
  /***************************************************************************
   * Navigation Decleration
   **************************************************************************/

  const navigate = useNavigate();

  /***************************************************************************
   * @Styling States & Handlers
   **************************************************************************/

  const [isHoveringContinue, setIsHoveringContinue] = useState<boolean>(false);
  const [isHoveringMinimize, setIsHoveringMinimize] = useState<any>(false);

  const handleMinimize = () => {
    props.expandHandler(false);
    setIsModalOpen(false);
  };

  /***************************************************************************
   * @Strategy - Current Session's Strategy Context
   **************************************************************************/
  const {
    strategyName,
    setStrategyName,
    depositToken,
    setDepositToken,
    baseSteps,
    setBaseSteps,
    showPercentageBox,
    setShowPercentageBox,
    handleBaseStepAdd,
    unusedBaseBalance,
    setUnusedBaseBalance,
    isModalOpen,
    setIsModalOpen,
    strategyProcessLocation,
    setStrategyProcessLocation,
    StrategyProcessSteps,
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

  /**************************************************************************
   * @Refds - Refrences to Components & Elements
   *************************************************************************/

  /**************************************************************************
   * @BaseStrategy - Handlers & State For The Visual Base Strategy
   *************************************************************************/

  // Keeps Track Of The Token Outflows Of The Base Steps
  const [baseOutflows, setBaseOutflows] = useState<any>(null);

  // Keeps Track Of Each Outflow And If It Is Bundled Or Not
  const [stepIdToOutflows, setStepIdToOutflows] = useState<any>(new Map());

  // Ref For The base Node (Multiswapper)
  const baseNodeRef = useRef<any>();

  // Refs For Each One Of The Tokens In The Base Strategy
  const largeTokensRef = useRef<any>(new Array());

  const [refsLoaded, setRefsLoaded] = useState<boolean>(false);

  // Relates Tokens Refs To Their Child Nodes' Refs

  /**
   * Type Of Line To Be Returned For The Connective Lines
   */
  enum LineType {
    Straight = "straight",
    Right = "right",
    Left = "left",
  }

  enum nodeType {
    BASE = "base",
    MINISTEP = "ministep",
    LARGETOKEN = "largeToken",
  }

  useEffect(() => {
    if (baseNodeRef.current) {
      setRefsLoaded(true);
    }

    return () => {
      setRefsLoaded(false);
    };
  }, []);

  const renderOutflowStepNode = () => {
    let arrToRender = [];
    for (const step of baseSteps) {
      let currentOutflows = step.outflows;
      let parentNodeX = baseNodeRef.current.offsetLeft;
      let parentNodeY = baseNodeRef.current.offsetTop;
      let currentIndex = step.step_identifier;
      let currentWidth =
        currentOutflows.length <= 2 ? 64 * currentOutflows.length : 64 * 3;

      let pingPongResults: any = pingPongSymmetricalBlockSpread(
        baseSteps,
        currentIndex,
        parentNodeX,
        188,
        currentWidth,
        140,
        225
      );

      let tokensHeight = parentNodeY + 108;

      let currentNodeHorizontalPosition: any = pingPongResults[0];

      // This Is To Change The Positions Slightly If There Are Multiple Tokens
      // Inside A Single Step's Outflows Bundle
      currentNodeHorizontalPosition =
        currentOutflows.length > 1
          ? currentNodeHorizontalPosition -
            currentWidth * currentOutflows.length +
            currentWidth / 2
          : currentNodeHorizontalPosition - currentWidth / 2;
      let isCurrentNodeSymmetrical: any = pingPongResults[1];
      let symmetricIndex = !isCurrentNodeSymmetrical
        ? (currentIndex - 1) / 2
        : isNumSymmetric(baseSteps.length / 2)
        ? currentIndex / 2
        : currentIndex / 2 - 1;

      let parentNodeRightAnchor = parentNodeX + 188;
      let parentNodeLeftAnchor = parentNodeX;
      let parentNodeBottomAnchorX = parentNodeX + 93;
      let parentNodeBottomAnchorY = parentNodeY + 56;

      let currentChildWidth =
        currentOutflows.length <= 1 ? 64 : 64 * currentOutflows.length - 15;

      let currentRenderItem = (
        <div>
          {currentIndex == 0 && !isCurrentNodeSymmetrical ? (
            <div>
              <MiniStepBlock
                stepDetails={step}
                key={step.step_identifier}
                style={{
                  position: "absolute",
                  top: `${tokensHeight + 64 + 156 - 10}px`,
                  left: `${parentNodeBottomAnchorX - 108}px`,
                }}
              />
              <StraightLine
                top={tokensHeight - 52}
                height={52}
                left={parentNodeBottomAnchorX}
                percentage={step.percentage}
              />
              <StraightLine
                top={tokensHeight + 64 - 2}
                height={156}
                left={parentNodeBottomAnchorX}
                percentage={100}
              />
            </div>
          ) : isCurrentNodeSymmetrical ? (
            <div>
              <RightLine
                height={81}
                width={173 + symmetricIndex * 225}
                top={parentNodeY + 27}
                left={parentNodeRightAnchor}
                percentage={step.percentage}
              />
              {
                <div>
                  <MiniStepBlock
                    stepDetails={step}
                    key={step.step_identifier}
                    style={{
                      position: "absolute",
                      top: `${tokensHeight + 64 + 156 - 10}px`,
                      left: `${
                        parentNodeRightAnchor +
                        (173 + symmetricIndex * 225) -
                        108
                      }px`,
                    }}
                  />
                  <StraightLine
                    top={tokensHeight + 64 - 2}
                    height={156}
                    left={parentNodeRightAnchor + (173 + symmetricIndex * 225)}
                    percentage={100}
                  />
                </div>
              }
            </div>
          ) : (
            <div>
              <LeftLine
                height={81}
                width={173 + symmetricIndex * 225}
                top={parentNodeY + 27}
                left={parentNodeLeftAnchor - (173 + symmetricIndex * 225)}
                percentage={step.percentage}
              />
              <MiniStepBlock
                stepDetails={step}
                key={step.step_identifier}
                style={{
                  position: "absolute",
                  top: `${tokensHeight + 64 + 156 - 10}px`,
                  left: `${
                    parentNodeLeftAnchor - (173 + symmetricIndex * 225) - 108
                  }px`,
                }}
              />
              <StraightLine
                top={tokensHeight + 64 - 2}
                height={156}
                left={parentNodeLeftAnchor - (173 + symmetricIndex * 225)}
                percentage={100}
              />
            </div>
          )}
          <div
            className={styles.largeTokenImgsContainer}
            style={{
              top: `${tokensHeight}px`,
              left: `${currentNodeHorizontalPosition}px`,
            }}
            data-outflows={step.outflows}
            ref={(el: any) =>
              (largeTokensRef.current[largeTokensRef.current.length] = el)
            }
            data-parentnode={baseNodeRef.current}
          >
            {currentOutflows.map((flow: any, index: number, arr: any[]) => {
              if (index <= 1) {
                return (
                  <div>
                    <img
                      src={flow.token_details.logo}
                      alt=""
                      className={styles.bigTokenImg}
                      key={flow.flow_identifier}
                      style={arr.length <= 1 ? { margin: "0px" } : {}}
                    />
                  </div>
                );
              } else {
                return <h1>+{arr.length - 2}</h1>;
              }
            })}
          </div>
        </div>
      );

      arrToRender.push(currentRenderItem);
    }

    return arrToRender;
  };

  // const handleLargeTokenPositions = () => {
  //   /**
  //    * If There is Only One Node In The Array, It Will Just Return It
  //    * Coming Out Of The base Node With A Straight, Centered Line
  //    */
  //   if (nodesArr.length == 1) {
  //     let node = renderNodeType(nodesArr[0], typesArr[0]);
  //     let x = "x";
  //     return <div></div>;
  //   }
  // };

  return (
    <div className={styles.wrapper} onClick={() => handleMinimize()}>
      <div
        className={styles.baseLargeTab}
        onClick={(e: any) => e.stopPropagation()}
      >
        <motion.img
          src="/minimizeicon.svg"
          alt=""
          className={styles.minimizeIcon}
          whileHover={{ scale: 0.95 }}
          onClick={() => handleMinimize()}
          style={{ left: `${window.innerWidth}px` }}
        />
        <div className={styles.strategyName}>{strategyName}</div>
        <div className={styles.baseStrategyContainer}>
          <motion.div
            className={styles.baseStrategyBackground}
            drag
            dragConstraints={{ top: 0, bottom: 0 }}
          >
            <img
              src={depositToken.logo}
              alt=""
              className={styles.depositTokenImgBigTab}
            />
            <div className={styles.depositTokenNameContainer}>
              <div className={styles.depositTokenNameText}>
                ${depositToken.symbol}
              </div>
            </div>
            <img src="/straightline.svg" alt="" className={styles.whiteLine} />
            <div className={styles.batchSwapBlock} ref={baseNodeRef}>
              <div className={styles.batchSwapText}>Swap</div>
              <img src="/lifi.png" alt="" className={styles.batchSwapImg} />
            </div>
            {baseSteps.length > 0 && refsLoaded
              ? renderOutflowStepNode()
              : null}
            {/* {baseSteps.map((bStep: any, index: number) => (
              <MiniStepBlock
                stepDetails={bStep}
                key={index}
                style={{ position: "absolute", top: "1000px" }}
              />
            ))} */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MotionMiniTab = motion(BaseStrategyMiniTab);
const MotionLargeTab = motion(BaseStrategyLargeTab);

export const BaseStrategyTab = (props: any) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <div>
      {isExpanded ? (
        <BaseStrategyLargeTab expandHandler={setIsExpanded} />
      ) : (
        <BaseStrategyMiniTab expandHandler={setIsExpanded} />
      )}
    </div>
  );
};
