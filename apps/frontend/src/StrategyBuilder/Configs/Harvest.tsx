import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "../../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  DatabaseContext,
  StrategyContext,
} from "../../Contexts/DatabaseContext";
import { ButtonVariants } from "../../MotionVariants";
import { HoverDetails } from "../../HoverDetails";
import { SizingEnum } from "../Enums";
import { ProtocolDropDown } from "./ProtocolDropdown";
import {
  calcDivisor,
  getFunctionAction,
  getFunctionAddress,
  getProtocolByFunction,
  asyncFilter,
} from "../../utils/utils.js";
import { EditPercentageModal } from "../../editDistribution";
import { NodeStepEnum } from "../Enums";
import _ from "lodash";
import { CustomArgs } from "./CustomArgs";

const MediumChoiceRow = (props: any) => {
  const { originStep, earnAction, clickHandler, currentlyClicked, index } =
    props;

  return (
    <motion.div
      className={styles.harvestRowContainer}
      style={
        currentlyClicked
          ? {
              background:
                "linear-gradient(rgb(45, 45, 45), rgb(45, 45, 45)) padding-box, linear-gradient(90deg, rgb(0, 178, 236) 0%, rgb(217, 202, 15) 100%) border-box",
              borderTop: "1px solid transparent",
              borderBottom: "1px solid transparent",
            }
          : {}
      }
      layout
      onClick={() => clickHandler(earnAction, index)}
    >
      <div className={styles.harvestRowOriginActionFlex}>
        <div className={styles.harvestRowOriginActionText}>Stake</div>
        <div className={styles.harvestRowOriginActionTokensContainer}>
          {originStep.outflows.map((outflow: any) => {
            return (
              <img
                src={outflow.token_details.logo}
                alt=""
                className={styles.harvestRowOriginActionTokenIcon}
              />
            );
          })}
        </div>
      </div>
      <img
        src="/harvestarrow.svg"
        alt=""
        className={styles.harvestRowArrowIcon}
      />
      <div className={styles.harvestRowEarnGradientText}>Earn</div>
      <div className={styles.harvestRowHarvestActionFlex}>
        <div className={styles.harvestRowHarvestActionTokensContainer}>
          {earnAction.inflows.map((inflow: any, index: any) => {
            if (index < 2) {
              return (
                <img
                  src={inflow.token_details.logo}
                  alt=""
                  className={styles.harvestRowHarvestActionTokenIcon}
                  key={index}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className={styles.harvestRowHarvestActionTokensText}>
          {earnAction.inflows.length > 2
            ? `+${earnAction.inflows.length - 2}`
            : ""}
        </div>
      </div>
      <div
        className={styles.harvestRowSelectionCircle}
        style={
          currentlyClicked
            ? {
                borderRadius: "50%",

                background:
                  "linear-gradient(#68DAFF, #FFF576) padding-box, linear-gradient(90deg, #00B2EC 0%, #D9CA0F 100%) border-box",
                border: "1.2px solid transparent",
              }
            : {}
        }
        onClick={() => clickHandler(earnAction, index)}
      >
        {currentlyClicked && (
          <div
            className={styles.harvestRowSelectionInnerCircle}
            onClick={() => clickHandler(earnAction, index)}
          ></div>
        )}
      </div>
    </motion.div>
  );
};

export const MediumConfig = (props: any, ref: any) => {
  /**
   * The Identifier Of The Current Action ("Stake")
   */
  let HarvestIdentifier = 4;

  /**
   * @Contexts
   */
  const {
    fullProtocolsList,
    fullTokensList,
    fullActionsList,
    fullAddressesList,
    protocolsAddressesList,
    fullFunctionsList,
    actionsFunctions,
  } = useContext(DatabaseContext);

  const {
    actionableTokens,
    setActionableTokens,
    quickAddActions,
    setQuickAddActions,
    strategySteps,
    setStrategySteps,
  } = useContext(StrategyContext);

  /**
   * @Protocols List That Only Includes Protocols Which Offer Staking
   * (AKA The Current Action)
   * @Pools List That Only Includes Pools (Addresses) Which Offer Staking
   *
   * @StakeFunctions List Of Functions That Are Used To Stake Tokens
   */

  /**
   * @States
   */
  const { style, stepId, stepAssemblyHandler, setNodeProcessStep } = props;

  // Keeps track of current harvest-able positions
  const [harvestablePositions, setHarvestablePositions] = useState<any>([]);

  // Keeps Track Of the Current Percentage Allocated To The Step
  const [chosePercentage, setChosePercentage] = useState<number>(
    strategySteps[
      strategySteps.findIndex((_step: any) => _step.step_identifier == stepId)
    ].percentage
  );
  // Opens The Hover Details Popup
  const [openHoverDetails, setOpenHoverDetails] = useState<any>(false);

  // Opens And Closes The Percentage Modal
  const [openPercentageModal, setOpenPercentageModal] = useState<any>(false);

  // Keeps track of the (optional) custom arguments
  const [customArguments, setCustomArguments] = useState<any>(null);

  // Current chosen harvest action
  const [chosenHarvestPosition, setChosenHarvestPosition] = useState<any>(null);

  const [availableHarvests, setAvailableHarvests] = useState<any>([]);

  // Keeping track of whether custom arguments are required
  const [customArgumentsRequired, setCustomArgumentsRequired] =
    useState<boolean>(false);

  const [customArgumentsComplete, setCustomArgumentsComplete] =
    useState<boolean>(false);

  const handleCustomArgsComplete = (argsArr: any) => {
    setCustomArguments(argsArr);
    setCustomArgumentsComplete(true);
  };

  const harvestUseEffect = async () => {
    let doesHaveHarvest: any = [...quickAddActions];

    console.log("Quick add actions ser", quickAddActions);

    if (doesHaveHarvest.length > 0) {
      let promises = await doesHaveHarvest.asyncFilter(async (func: any) => {
        let action = await getFunctionAction(
          func.quickAddAction.function_identifier
        );
        return action?.action_identifier === HarvestIdentifier;
      });

      await Promise.all(promises).then((res) => {
        console.log("Promise all res:", res);
      });

      if (promises) {
        console.log("harvest filter res", promises);
        setAvailableHarvests(promises);
      }
    }
  };

  useEffect(() => {
    harvestUseEffect();
  }, [strategySteps, quickAddActions]);

  /**
   * @Handlers
   */
  const ownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ownRef.current) {
      let tStepsArr = [...strategySteps];
      let index = tStepsArr.findIndex((step: any) => {
        return step.step_identifier === stepId;
      });
      tStepsArr[index] = {
        ...tStepsArr[stepId],
        width: ownRef.current.offsetWidth,
        height: ownRef.current.offsetHeight,
      };
      setStrategySteps(tStepsArr);
    }
  }, []);

  useEffect(() => {
    if (chosenHarvestPosition) {
      let args = chosenHarvestPosition.function.arguments;
      if (
        args.find((arg: any) =>
          arg.value.includes("abi.decode(current_custom_arguments")
        )
      ) {
        setCustomArgumentsRequired(
          args
            .filter((arg: any) =>
              arg.value.includes("abi.decode(current_custom_arguments")
            )
            .map((arg: any, index: any) => {
              let newArg = { ...arg };
              newArg.index = index;
              return newArg;
            })
        );
      } else {
        setCustomArgumentsRequired(false);
      }
    }
  }, [chosenHarvestPosition]);

  const handleHarvestChoice = (position: any, index: any) => {
    console.log("POsiton Chosen ser", position, index);
    setChosenHarvestPosition({ function: position, index: index });
  };
  const handleChosenPercentage = (percentage: number) => {
    setChosePercentage(percentage);
    setOpenPercentageModal(!openPercentageModal);
  };

  const handleCancelClick = () => {
    let tStepsArr = [...strategySteps];
    let _stepDetails = tStepsArr.find(
      (step_: any) => step_.step_identifier == stepId
    );
    let index = tStepsArr.findIndex((_step: any) => {
      return _step.step_identifier === _stepDetails.step_identifier;
    });
    let newObj = tStepsArr[index];
    newObj.type = NodeStepEnum.CHOOSE_ACTION;
    tStepsArr[index] = newObj;
    // setStrategySteps(tStepsArr);
    setNodeProcessStep(NodeStepEnum.CHOOSE_ACTION);
  };

  /**
   * @AssembleStep - Assembles The Step Object Using The Configured Settings
   */

  const assembleStep = async () => {
    let step = {
      type: "Harvest",
      action_identifier: HarvestIdentifier,
      divisor: await calcDivisor(chosePercentage),
      percentage: chosePercentage,
      function_identifiers: [
        chosenHarvestPosition.function.function_identifier,
      ],
      address_identifiers: [
        (
          await getFunctionAddress(
            chosenHarvestPosition.function.function_identifier
          )
        ).address_identifier,
      ],
      protocol_details: await getProtocolByFunction(
        chosenHarvestPosition.function.function_identifier
      ),
      additional_args: Array.isArray(customArguments) ? customArguments : [],
      flow_identifiers: [
        chosenHarvestPosition.function.inflows.map(
          (inflow: any) => inflow.flow_identifier
        ),
      ],
      step_identifier: stepId,
      parent_step_identifier: strategySteps[stepId].parent_step_identifier,
      outflows: chosenHarvestPosition.function.outflows
        ? chosenHarvestPosition.function.outflows
        : [],
      inflows: chosenHarvestPosition.function.inflows,
      children: [],
    };

    // Removing the harvest function from quick add actions
    let tempQuickAddActions = [...quickAddActions];
    tempQuickAddActions.splice(
      quickAddActions.findIndex(
        (qAction: any) =>
          qAction.quickAddAction.function_identifier ==
          chosenHarvestPosition.function.function_identifier
      ),
      1
    );

    // Adding Inflows to actionable tokens
    let tempActionableTokens = [...actionableTokens];
    for (let flow of chosenHarvestPosition.function.inflows) {
      tempActionableTokens.push(flow.token_details);
    }
    setActionableTokens(tempActionableTokens);
    stepAssemblyHandler(step);
    setQuickAddActions(tempQuickAddActions);
  };

  /**
   * @Component
   */
  return (
    <div>
      {openHoverDetails ? (
        <HoverDetails
          top={openHoverDetails.top.toString()}
          left={openHoverDetails.left}
          text={openHoverDetails.text}
        />
      ) : null}
      {openPercentageModal ? (
        <EditPercentageModal
          setPercentage={handleChosenPercentage}
          locationDetails={openPercentageModal}
        />
      ) : null}
      {customArgumentsRequired && !customArgumentsComplete ? (
        <CustomArgs
          style={{
            top: style.top,
            left: `${
              parseInt(style.left.split("px")[0]) +
              (ownRef.current ? ownRef.current.offsetWidth : 0) +
              50
            }px`,

            position: "absolute",
          }}
          customArgs={customArgumentsRequired}
          handler={handleCustomArgsComplete}
        />
      ) : null}
      <div
        className={styles.harvestMediumConfigContainer}
        style={style}
        ref={ownRef}
      >
        <div
          className={styles.mediumConfigTitleContainer}
          style={{ marginBottom: "24px" }}
        >
          <div className={styles.mediumConfigTitleTextOff}>Action:</div>
          <div className={styles.mediumConfigTitleTextOn}>Harvest</div>
          <img
            src="/mediumConfigTitleArrow.svg"
            alt=""
            className={styles.mediumConfigTitleArrow}
          />
          <div
            className={styles.mediumConfigPercentageContainer}
            style={{ marginLeft: "53px" }}
          >
            <div className={styles.mediumConfigPercentageText}>
              {chosePercentage}%
            </div>
            <img
              src="/mediumCompleteStepEditIcon.svg"
              alt=""
              className={styles.mediumConfigPercentageIcon}
              onClick={(e: any) =>
                setOpenPercentageModal({
                  mouse_location: {
                    width: e.clientX,
                    height: e.clientY + window.scrollY,
                  },
                })
              }
            />
          </div>
        </div>
        <div className={styles.harvestAbleTitle}>Harvest-able Positions:</div>
        <div className={styles.harvestChoiceGrid}>
          {availableHarvests.map((harvest: any, index: number) => (
            <div>
              <MediumChoiceRow
                currentlyClicked={
                  chosenHarvestPosition
                    ? chosenHarvestPosition.index === index
                    : false
                }
                clickHandler={handleHarvestChoice}
                index={index}
                earnAction={harvest.quickAddAction}
                originStep={harvest.originStep}
                fullharvest={harvest}
                key={index}
              />
            </div>
          ))}
        </div>
        <motion.div
          className={styles.mediumConfigCancelAction}
          onClick={() => handleCancelClick()}
        >
          <div className={styles.mediumConfigCancelActionText}>
            Cancel Action
          </div>
        </motion.div>
        <motion.button
          className={styles.mediumConfigDoneButton}
          variants={ButtonVariants}
          initial="normal"
          whileHover="hover"
          onClick={
            chosenHarvestPosition
              ? () => assembleStep()
              : (e: any) =>
                  setOpenHoverDetails({
                    top: e.clientY + window.scrollY,
                    left: e.clientX,
                    text: "You Must Choose A Pool Before Adding This Step",
                  })
          }
          style={{
            position: "absolute",
            top: "calc(100% - 64px)",
            left: "179px",
          }}
        >
          Add +
        </motion.button>
      </div>
    </div>
  );
};

export const HarvestConfig = (props: any) => {
  const { size, style, stepId } = props;

  return (
    <div>
      {size === SizingEnum.MEDIUM ? (
        <MediumConfig
          style={style}
          stepAssemblyHandler={props.stepAssemblyHandler}
          stepId={stepId}
          setNodeProcessStep={props.setNodeProcessStep}
        />
      ) : (
        <h1 style={{ color: "white" }}>LOOOOOOOSER </h1>
      )}
    </div>
  );
};
