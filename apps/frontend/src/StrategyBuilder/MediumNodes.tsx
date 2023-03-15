import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import styles from "../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "../Contexts/DatabaseContext";
import { ChooseTokenModal } from "../ChooseToken";
import { RightLine, LeftLine, StraightLine } from "../Lines";
import { ButtonVariants } from "../MotionVariants";
import { ChooseActionButtonVariants } from "./AnimationVariants";
import { HoverDetails } from "../HoverDetails";
import { SizingEnum, NodeStepEnum } from "./Enums";
import { StakeConfig } from "./Configs/Stake";
import { SwapConfig } from "./Configs/Swap";
import { AddLiquidityConfig } from "./Configs/AddLiquidity";
import { HarvestConfig } from "./Configs/Harvest";
import useDeepCompareEffect from "use-deep-compare-effect";
import { calcDivisor, getFunctionAction } from "utils/utils";

export const MediumActionButton = (props: any) => {
  const { actionDetails } = props;
  return (
    <motion.div
      className={styles.mediumActionButton}
      variants={ChooseActionButtonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => props.handleActionChoice(actionDetails)}
      style={props.style ? props.style : {}}
      animate={props.animate ? props.animate : {}}
      transition={props.transition ? props.transition : {}}
    >
      <img
        src={`/${actionDetails.name.toLowerCase().split(" ").join("")}icon.svg`}
        alt=""
        className={styles.mediumActionButtonIcon}
        style={props.imgStyle ? props.imgStyle : {}}
      />
      <div
        className={styles.mediumActionButtonText}
        style={props.nameStyle ? props.nameStyle : {}}
      >
        {actionDetails.name}
      </div>
    </motion.div>
  );
};

export const MediumChooseAction = React.forwardRef((props: any, ref: any) => {
  const { fullActionsList } = useContext(DatabaseContext);
  const { strategySteps, setStrategySteps, quickAddActions } =
    useContext(StrategyContext);
  const { actionsFunctions } = useContext(DatabaseContext);
  const { handleActionChoice, style, stepDetails, setNodeProcessStep } = props;

  // Settings Sizing Propreties
  const ownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setNodeProcessStep(NodeStepEnum.CHOOSE_ACTION);

    if (ownRef.current) {
      let tStepsArr = [...strategySteps];
      let index = tStepsArr.findIndex((step: any, i: number, arr: any[]) => {
        return step.step_identifier === stepDetails.step_identifier;
      });

      tStepsArr[index] = {
        ...tStepsArr[index],
        width: ownRef.current.offsetWidth,
        height: ownRef.current.offsetHeight,
      };

      setStrategySteps(tStepsArr);
    } else {
    }
  }, []);

  const [readyToList, setReadyToList] = useState<any>(false);

  const filterAction = async (action: any) => {
    let isActionHidden = action.hidden;
    let isActionInQuickAdd =
      !quickAddActions || !quickAddActions.length
        ? false
        : await quickAddActions.find(
            async (qAction: any) =>
              (
                await getFunctionAction(qAction.function_identifier)
              ).action_identifier === action.action_identifier
          );

    let isActionUnlocked = isActionInQuickAdd
      ? true
      : actionsFunctions
          .get(action.action_identifier)
          .find((fAction: any) => fAction.unlocked_by == null)
      ? true
      : false;

    if (!isActionHidden && isActionUnlocked) {
      return action;
    } else {
      return null;
    }
  };

  const filterActions = async (actions: any) => {
    let filteredActions = [];
    for await (let action of actions) {
      if (await filterAction(action)) {
        filteredActions.push(action);
      }
    }
    setReadyToList(filteredActions);
  };

  useEffect(() => {
    if (
      actionsFunctions &&
      actionsFunctions.size > 1 &&
      actionsFunctions.size == fullActionsList.length
    ) {
      filterActions(fullActionsList);
    }
  }, [
    actionsFunctions ? actionsFunctions.size : actionsFunctions,
    fullActionsList.length,
    fullActionsList,
  ]);

  return (
    <div
      className={styles.mediumChooseActionContainer}
      style={style}
      ref={ownRef}
    >
      <div className={styles.mediumActionTitleContainer}>
        <div className={styles.mediumChooseActionTitle}>Select Action</div>
        <motion.img
          src="/mediumCloseIcon.svg"
          alt=""
          className={styles.mediumCloseIcon}
          whileHover={{ scale: 0.9 }}
          onClick={() => console.log(quickAddActions, "quickAddActions")}
        />
      </div>

      <div className={styles.mediumActionButtonsGridContainer}>
        {readyToList
          ? readyToList
              .sort((a: any, b: any) => a.popularity - b.popularity)
              .map((action: any, index: number) => {
                if (action.hidden) return null;
                return (
                  <MediumActionButton
                    actionDetails={action}
                    handleActionChoice={props.handleActionChoice}
                    key={index}
                  />
                );
              })
          : null}
      </div>
    </div>
  );
});

export const MediumCompleteStep = React.forwardRef((props: any, ref: any) => {
  const { stepDetails, style, setNodeProcessStep } = props;
  const { strategySteps, setStrategySteps } = useContext(StrategyContext);
  const [isHoveringExpandDots, setIsHoveringExpandDots] = useState<any>(false);
  const [doesHaveChildren, setDoesHaveChildren] = useState<boolean>(false);

  useEffect(() => {
    if (
      strategySteps.find((step: any) => {
        return (
          step.parent_step_identifier === stepDetails.step_identifier &&
          step.type !== NodeStepEnum.CHOOSE_ACTION &&
          step.type !== NodeStepEnum.CONFIG_ACTION &&
          step.type !== NodeStepEnum.PLACEHOLDER
        );
      })
    ) {
      setDoesHaveChildren(true);
    } else {
      setDoesHaveChildren(false);
    }
  }, [strategySteps]);

  const ownRef = useRef<any>(null);
  const rightPlusRef = useRef<any>(null);
  const leftPlusRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (ownRef.current) {
      let tStepsArr = [...strategySteps];
      let index = tStepsArr.findIndex(
        (step: any) => step.step_identifier == stepDetails.step_identifier
      );

      tStepsArr[index] = {
        ...tStepsArr[index],
        width: ownRef.current.offsetWidth,
        height: ownRef.current.offsetHeight,
      };
      setStrategySteps(tStepsArr);
    }
  }, []);

  const addAnotherChild = (from: any) => {
    let tStepsArr = [...strategySteps];
    let unusedPercentage =
      100 -
      tStepsArr
        .filter(
          (_step: any) =>
            _step.parent_step_identifier === stepDetails.step_identifier
        )
        .map((_step: any) => _step.percentage)
        .reduce((a: any, b: any) => a + b);

    let tChild = {
      step_identifier: tStepsArr.length,
      parent_step_identifier: stepDetails.step_identifier,
      type: NodeStepEnum.CHOOSE_ACTION,
      function_identifiers: [],
      percentage: unusedPercentage,
      divisor: calcDivisor(unusedPercentage),
    };

    if (unusedPercentage <= 0) {
      props.hoverHandler({
        text: "You can't use more than 100%.",
        top:
          from == "left"
            ? leftPlusRef.current.getBoundingClientRect().top -
              5 +
              window.scrollY
            : rightPlusRef.current.getBoundingClientRect().top -
              5 +
              window.scrollY,
        left:
          from == "left"
            ? leftPlusRef.current.getBoundingClientRect().left - 30
            : rightPlusRef.current.getBoundingClientRect().left - 30,
      });
      setTimeout(() => {
        props.hoverHandler(false);
      }, 2000);
      return;
    }
    tStepsArr.push(tChild);

    setStrategySteps(tStepsArr);
  };

  return (
    <div>
      {isHoveringExpandDots && (
        <HoverDetails
          top={isHoveringExpandDots.top}
          left={isHoveringExpandDots.left}
          text={"Show Options"}
        />
      )}

      <div
        className={styles.mediumCompleteStepContainer}
        style={style}
        ref={ownRef}
      >
        <div className={styles.mediumCompleteStepTitleContainer}>
          {doesHaveChildren ? (
            <div>
              <motion.img
                className={styles.mediumCompleteStepChildAddPlusIcon}
                alt=""
                src="/addchildplus.svg"
                onClick={() => addAnotherChild("left")}
                ref={leftPlusRef}
                whileHover={{ scale: 1.05 }}
              />
              <motion.img
                className={styles.mediumCompleteStepChildAddPlusIcon}
                alt=""
                src="/addchildplus.svg"
                style={{ left: "305px" }}
                onClick={() => addAnotherChild("right")}
                ref={rightPlusRef}
                whileHover={{ scale: 1.05 }}
              />
            </div>
          ) : null}
          <img
            src={stepDetails.protocol_details.logo}
            alt=""
            className={styles.mediumCompleteStepProtocolIcon}
            style={{ borderRadius: "50%" }}
          />
          <div className={styles.mediumCompleteStepDetailContainer}>
            <div className={styles.mediumCompleteStepDetailText}>
              Action:{" "}
              {stepDetails.type.length > 7
                ? stepDetails.type.slice(0, 7) + "..."
                : stepDetails.type}
            </div>
          </div>
          <div className={styles.mediumCompleteStepDetailContainer}>
            <div className={styles.mediumCompleteStepDetailText}>
              {stepDetails.percentage}%
            </div>
            <img
              src="/mediumCompleteStepEditIcon.svg"
              alt=""
              className={styles.mediumCompleteStepEditIcon}
            />
          </div>
          <motion.img
            src="/mediumCompleteStepExpandDots.svg"
            alt=""
            className={styles.mediumCompleteStepExpandDots}
            onMouseEnter={(e: any) => {
              setIsHoveringExpandDots({
                top: e.clientY + window.scrollY,
                left: e.clientX,
              });
            }}
            onMouseLeave={() => setIsHoveringExpandDots(false)}
          />
        </div>
        <div className={styles.mediumCompleteStepFlowsContainer}>
          <div className={styles.mediumCompleteStepSingleFlowContainer}>
            <div className={styles.mediumCompleteStepFlowsText}>Outflows:</div>
            <div className={styles.mediumCompleteStepFlowIconsContainer}>
              {stepDetails.outflows.map((outflow: any, index: number) => (
                <img
                  src={outflow.token_details.logo}
                  alt=""
                  className={styles.mediumCompleteStepFlowIcon}
                  key={index}
                />
              ))}
            </div>
          </div>
          <div className={styles.mediumCompleteStepSingleFlowContainer}>
            <div className={styles.mediumCompleteStepFlowsText}>Inflows:</div>
            <div className={styles.mediumCompleteStepFlowIconsContainer}>
              {stepDetails.inflows.length > 0 ? (
                stepDetails.inflows.map((inflow: any) => (
                  <img
                    src={inflow.token_details.logo}
                    alt=""
                    className={styles.mediumCompleteStepFlowIcon}
                  />
                ))
              ) : (
                <img
                  src="/thin-x.svg"
                  alt=""
                  className={styles.mediumCompleteStepFlowIcon}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const MediumPlaceholderNode = (props: any) => {
  const { stepId, style, parentStepId, isEmpty, stepDetails } = props;
  const { nodeProcessStep, setNodeProcessStep } = props;
  const { strategySteps, setStrategySteps } = useContext(StrategyContext);

  const [isHovering, setIsHovering] = useState<any>(false);
  const handleAddStepClick = () => {
    if (isEmpty) return;

    setNodeProcessStep(NodeStepEnum.CHOOSE_ACTION);
    let tempStratSteps = [...strategySteps];
    let unusedPercentage;
    try {
      tempStratSteps
        .filter(
          (_step: any) =>
            _step.parent_step_identifier == stepDetails.step_identifier
        )
        .map((_step: any) => _step.percentage)
        .reduce((a: any, b: any) => a - b);
    } catch (e) {
      unusedPercentage = 100;
    }
    tempStratSteps.push({
      type: NodeStepEnum.CHOOSE_ACTION,
      step_identifier: strategySteps.length,
      parent_step_identifier: parentStepId,
      function_identifiers: [],
      percentage: 100,
      divisor: 1,
    });
    setStrategySteps(tempStratSteps);
  };

  const hoverStyle = {
    background: isHovering ? " rgba(0, 200, 255, 0.02)" : "none",
    transition: {
      duration: 0.2,
    },
  };

  if (!isEmpty) {
    return (
      <motion.div
        style={{
          ...style,
          borderRadius: "8px",
          background: "none",
          zIndex: "5",
          cursor: "pointer",
        }}
        className={styles.mediumPlaceholderNodeContainer}
        whileHover={{ ...hoverStyle }}
      >
        {!isEmpty && (
          <div>
            <motion.img
              src="/addStepPlaceholder.svg"
              alt=""
              onMouseEnter={() => setIsHovering(!isEmpty && true)}
              onMouseLeave={() => setIsHovering(!isEmpty && !false)}
              onClick={() => handleAddStepClick()}
              style={{ cursor: "pointer" }}
              className={styles.mediumPlaceholderNodeSvg}
            />

            <motion.div
              className={styles.mediumPlaceholderNodeText}
              style={{ position: "absolute", top: "37%", left: "35%" }}
            >
              Add Step +
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  } else {
    return (
      <div
        style={{
          ...style,
          borderRadius: "8px",
          zIndex: "5",
          cursor: "pointer",
        }}
      ></div>
    );
  }
};

export const MediumNode = React.forwardRef((props: any, ref: any) => {
  const { stepId, style, optionalAction } = props;
  const { nodeProcessStep, setNodeProcessStep } = props;
  const { strategySteps, setStrategySteps } = useContext(StrategyContext);
  const [currentStepDetails, setCurrentStepDetails] = useState<any>(
    props.stepDetails
  );

  useEffect(() => {
    setCurrentStepDetails(props.stepDetails);
  }, [props.stepDetails, props.stepId]);

  const [currentAction, setCurrentAction] = useState<any>(null);

  const handleActionChoice = (action: any) => {
    setCurrentAction(action);
    setNodeProcessStep(NodeStepEnum.CONFIG_ACTION);
  };

  const handleStepAdd = (stepDetails: any) => {
    let tempStratSteps = [...strategySteps];
    let stepIndex = tempStratSteps.findIndex((step: any) => {
      return step.step_identifier === stepDetails.step_identifier;
    });
    tempStratSteps[stepIndex] = stepDetails;

    setStrategySteps(tempStratSteps);
    setCurrentStepDetails(stepDetails);
    setNodeProcessStep(NodeStepEnum.COMPLETE);
  };

  // This is just for the landing page so that i can pass in a pre-made step detail
  useEffect(() => {
    if (optionalAction != null || undefined) {
      setCurrentAction(optionalAction);
    }

    return () => {};
  }, [props]);

  let nodeSettings = {
    style: {
      position: "absolute",
      top: props.style.top,
      left: props.style.left,
      zIndex: props.style.zIndex,
    },
    size: SizingEnum.MEDIUM,
    currentStepDetails: currentStepDetails,
    stepAssemblyHandler: handleStepAdd,
    stepId: stepId,
    ref: ref,
    setNodeProcessStep: setNodeProcessStep,
  };
  /************************************************************/
  let Stake_Config = (
    <div>
      <StakeConfig {...nodeSettings} />
    </div>
  );

  let Swap_Config = (
    <div>
      <SwapConfig {...nodeSettings} />
    </div>
  );

  let AddLiquidity_Config = (
    <div>
      <AddLiquidityConfig {...nodeSettings} />
    </div>
  );

  let Harvest_Config = (
    <div>
      <HarvestConfig {...nodeSettings} />
    </div>
  );
  /************************************************************/

  if (nodeProcessStep === NodeStepEnum.CHOOSE_ACTION) {
    return (
      <MediumChooseAction
        handleActionChoice={handleActionChoice}
        style={nodeSettings.style}
        ref={ref}
        stepDetails={currentStepDetails}
        stepId={stepId}
        setNodeProcessStep={setNodeProcessStep}
      />
    );
  } else if (nodeProcessStep === NodeStepEnum.CONFIG_ACTION && currentAction) {
    return eval(`${currentAction.name.split(" ").join("")}_Config`);
  } else if (nodeProcessStep === NodeStepEnum.COMPLETE) {
    return (
      <MediumCompleteStep
        style={nodeSettings.style}
        stepDetails={currentStepDetails}
        setNodeProcessStep={setNodeProcessStep}
        stepId={stepId}
        ref={ref}
        hoverHandler={props.hoverHandler}
      />
    );
  } else if (nodeProcessStep === NodeStepEnum.PLACEHOLDER) {
    return (
      <MediumPlaceholderNode
        style={nodeSettings.style}
        parentStepId={currentStepDetails.parent_step_identifier}
        stepDetails={currentStepDetails}
        stepId={stepId}
        setNodeProcessStep={setNodeProcessStep}
        isEmpty={currentStepDetails.empty}
      />
    );
  } else {
    return (
      <div>
        <h1>ERROR</h1>
      </div>
    );
  }
});
