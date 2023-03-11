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
import { calcDivisor } from "../../utils/utils.js";
import { EditPercentageModal } from "../../editDistribution";
import { NodeStepEnum } from "../Enums";
import { CustomArgs } from "./CustomArgs";
import _ from "lodash";

const MediumStakePoolDropdownRow = (props: any) => {
  const HarvestIdentifier = 4;
  const { actionsFunctions } = useContext(DatabaseContext);
  const { poolDetails } = props;
  const { outflows, inflows, unlocked_functions } = poolDetails;
  const canHarvest = actionsFunctions
    .get(HarvestIdentifier)
    .find((harvestFunction: any) => {
      let harvestFuncIdentifier = harvestFunction.function_identifier;
      for (const unlockedFunc of unlocked_functions) {
        if (unlockedFunc.function_identifier == harvestFuncIdentifier) {
          return true;
        }
      }
    });

  const earnTokens = canHarvest
    ? unlocked_functions.find(
        (unlockedFunction: any) =>
          unlockedFunction.function_identifier == canHarvest.function_identifier
      )
    : unlocked_functions[0];

  const newPoolDetails = {
    ...poolDetails,
    earnAction: earnTokens,
  };

  return (
    <div>
      <motion.div
        className={styles.mediumConfigStakePoolRow}
        whileHover={{
          backgroundColor: "rgba(15, 16, 17, 1)",
          transition: { duration: 0.1 },
        }}
        onClick={() => props.choiceHandler(newPoolDetails)}
      >
        <div className={styles.mediumConfigStakePoolRowTextOff}>Stake</div>
        <div className={styles.mediumConfigStakePoolRowIconsContainer}>
          {outflows.map((outflow: any) => (
            <img
              src={outflow.token_details.logo}
              alt=""
              className={styles.mediumConfigStakePoolRowLargeIcon}
              key={`outflow_${outflow.flow_identifier}`}
            />
          ))}
        </div>
        <img
          src="/mediumConfigStakePoolRowArrow.svg"
          alt=""
          className={styles.mediumConfigStakePoolRowArrowIcon}
        />
        <div className={styles.mediumConfigStakePoolRowTextOn}>Earn</div>
        <div
          className={styles.mediumConfigStakePoolRowIconsContainer}
          style={{ marginLeft: "9.6px" }}
        >
          {earnTokens.inflows
            ? earnTokens.inflows.map((rewardToken: any, index: any) => (
                <img
                  src={rewardToken.token_details.logo}
                  alt=""
                  className={styles.mediumConfigStakePoolRowSmallIcon}
                  key={index}
                />
              ))
            : null}
        </div>
        <div
          className={styles.mediumConfigStakePoolRowTextOff}
          style={{
            justifySelf: "flex-end",
            marginLeft: "16px",
            fontSize: "12px",
          }}
        >
          178% APY
        </div>
      </motion.div>
    </div>
  );
};

const MediumStakePoolDropdown = (props: any) => {
  const { top, left, poolsList } = props;
  const { actionableTokens } = useContext(StrategyContext);

  let filteredPoolsList = poolsList.filter((pool: any) => {
    let poolOutflows = _.clone(pool.outflows);
    for (const token of actionableTokens) {
      console.log("Doing token iteration", token);
      let indexOfTokenInsideOutflows = poolOutflows.findIndex(
        (flow: any) =>
          flow.token_details.token_identifier == token.token_identifier
      );

      if (indexOfTokenInsideOutflows !== -1) {
        poolOutflows.splice(indexOfTokenInsideOutflows, 1);
      }
    }
    return poolOutflows.length == 0 ? true : false;
  });

  return (
    <div>
      <div
        className={styles.mediumConfigProtocolMenu}
        style={{ top: `${top}px`, left: `${left}px` }}
      >
        <div>
          <input
            className={styles.mediumConfigProtocolMenuSearchBar}
            placeholder="Search For A Pool"
          />
          <img
            src="/dropdownsearchicon.svg"
            alt=""
            className={styles.mediumConfigProtocolMenuSearchBarIcon}
            style={{ marginLeft: "4px" }}
          />
        </div>

        <div className={styles.mediumConfigProtocolMenuRowsGrid}>
          {!filteredPoolsList.length ? (
            <div
              className={styles.cantFindOptionText}
              style={{ marginTop: "16px", marginLeft: "40px" }}
            >{`You don't have any tokens that are 
            available to stake on this protocol`}</div>
          ) : (
            filteredPoolsList.map((pool: any, index: number) => (
              <MediumStakePoolDropdownRow
                poolDetails={pool}
                choiceHandler={props.choiceHandler}
                key={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const MediumConfig = (props: any, ref: any) => {
  /**
   * The Identifier Of The Current Action ("Stake")
   */
  let StakeIdentifier = 1;

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
    fullParametersList,
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

  // Keeps track of the protocol dropdown, true when it should be opened,
  // False when it should be closed
  const [isProtocolDropdownOpen, setIsProtocolDropdownOpen] =
    useState<any>(false);

  // Keeps track of the pool dropdown, true when it should be opened,
  // False when it should be closed
  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = useState<any>(false);

  // Keeps Track Of The Current Chosen Protocol, To Display It Accordingl
  // In THe Dropdown Box, And Also Set The Pools Options
  const [chosenProtocol, setChosenProtocol] = useState<any>(null);

  // Keeps Track Of The Last Chosen Protocol, To Display Details Accordingly
  const [lastChosenProtocol, setLastChosenProtocol] = useState<any>(null);

  // Keeps Track Of The Current Chosen Pool, To Display It Accordingly &&
  // To Be Used Within the Assembled Step (IT includes all the needed details)
  const [chosenPool, setChosenPool] = useState<any>(null);

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

  // Keeping track of whether custom arguments are required
  const [customArgumentsRequired, setCustomArgumentsRequired] =
    useState<boolean>(false);

  const [customArgumentsComplete, setCustomArgumentsComplete] =
    useState<boolean>(false);

  const handleCustomArgsComplete = (argsArr: any) => {
    setCustomArguments(argsArr);
    setCustomArgumentsComplete(true);
  };

  useEffect(() => {
    if (chosenPool) {
      let args = chosenPool.arguments;
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
  }, [chosenPool]);

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

  const handleChosenPercentage = (percentage: number) => {
    setChosePercentage(percentage);
    setOpenPercentageModal(!openPercentageModal);
  };

  const protocolChoiceHandler = (protocol: any) => {
    setLastChosenProtocol(chosenProtocol);
    setChosenProtocol(protocol);
    setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
    setChosenPool(null);
  };

  const poolChoiceHandler = (pool: any) => {
    setChosenPool(pool);
    setIsPoolDropdownOpen(!isPoolDropdownOpen);
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

  const handleDropDownClick = (target: any) => {
    if (target == "protocol") {
      if (isPoolDropdownOpen) {
        setIsPoolDropdownOpen(!isPoolDropdownOpen);
      }
      setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
    } else if (target == "pool") {
      if (isProtocolDropdownOpen) {
        setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
      }
      setIsPoolDropdownOpen(!isPoolDropdownOpen);
    }
  };

  /**
   * @AssembleStep - Assembles The Step Object Using The Configured Settings
   */

  const assembleStep = async () => {
    let stepIndex = strategySteps.findIndex((step: any) => {
      return step.step_identifier === stepId;
    });

    let step = {
      type: "Stake",
      action_identifier: StakeIdentifier,
      divisor: await calcDivisor(chosePercentage),
      percentage: chosePercentage,
      function_identifiers: [chosenPool.function_identifier],
      address_identifiers: [
        await fullAddressesList.find((address: any) =>
          address.functions.includes(chosenPool.function_identifier)
        ).address_identifier,
      ],
      protocol_details: chosenProtocol,
      additional_args: Array.isArray(customArguments) ? customArguments : [],
      flow_identifiers: [
        ...chosenPool.outflows
          .concat(chosenPool.inflows)
          .map((flow: any) => flow.flow_identifier),
      ],
      step_identifier: stepId,
      parent_step_identifier: strategySteps[stepIndex].parent_step_identifier,
      outflows: chosenPool.outflows,
      inflows: chosenPool.inflows,
      children: [],
    };

    let tempActionableTokens = await chosenPool.inflows.map(
      (flow: any) => flow.token_details
    );

    setActionableTokens([...actionableTokens.concat(tempActionableTokens)]);
    let tempQuickAddActions = {originStep: step, quickAddAction: chosenPool.earnAction};
    setQuickAddActions([...quickAddActions.concat(tempQuickAddActions)]);
    stepAssemblyHandler(step);
  };
  /**
   * @Component
   */
  return (
    <div>
      {openHoverDetails ? (
        <HoverDetails
          top={openHoverDetails.top}
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
      <div className={styles.mediumConfigContainer} style={style} ref={ownRef}>
        {isProtocolDropdownOpen && (
          <ProtocolDropDown
            top={`185`}
            left={`24`}
            choiceHandler={protocolChoiceHandler}
            protocolsList={
              actionsFunctions.get(StakeIdentifier)
                ? actionsFunctions
                    .get(StakeIdentifier)
                    .map((actionFunction: any) => actionFunction.protocol)
                : null
            }
          />
        )}
        {isPoolDropdownOpen && (
          <MediumStakePoolDropdown
            top={`292.5`}
            left={`24`}
            choiceHandler={poolChoiceHandler}
            poolsList={actionsFunctions
              .get(StakeIdentifier)
              .filter((actionFunction: any) => {
                return (
                  actionFunction.protocol.protocol_identifier ==
                  chosenProtocol.protocol_identifier
                );
              })}
          />
        )}
        <div className={styles.mediumConfigTitleContainer}>
          <div className={styles.mediumConfigTitleTextOff}>Action:</div>
          <div className={styles.mediumConfigTitleTextOn}>Stake</div>
          <img
            src="/mediumConfigTitleArrow.svg"
            alt=""
            className={styles.mediumConfigTitleArrow}
          />
          <div className={styles.mediumConfigPercentageContainer}>
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
        <div>
          <div className={styles.mediumConfigDropdownTitle}>Protocol</div>
          <div
            className={styles.mediumConfigDropdownContainer}
            onClick={(e: any) => handleDropDownClick("protocol")}
          >
            {chosenProtocol ? (
              <img
                src={chosenProtocol.logo}
                alt=""
                className={styles.mediumConfigDropdownIcon}
              />
            ) : null}
            <div
              className={styles.mediumConfigDropdownText}
              style={chosenProtocol ? {} : { color: "#626262" }}
            >
              {chosenProtocol ? chosenProtocol.name : "Choose Protocol"}
            </div>
            <img
              src="/mediumConfigTitleArrow.svg"
              alt=""
              className={styles.mediumConfigDropdownArrow}
            />
          </div>
        </div>
        <div>
          <div className={styles.mediumConfigDropdownTitle}>Staking Pool</div>
          <motion.div
            className={styles.mediumConfigDropdownContainer}
            onClick={(e: any) =>
              chosenProtocol ? handleDropDownClick("pool") : null
            }
            onMouseEnter={
              !chosenProtocol
                ? (e: any) =>
                    setOpenHoverDetails({
                      top: e.clientY + window.scrollY,
                      left: e.clientX,
                      text: "Please Choose A Protocol First",
                    })
                : null
            }
            onMouseLeave={
              !chosenProtocol ? () => setOpenHoverDetails(false) : null
            }
          >
            {chosenPool
              ? chosenPool.outflows.map((outflow: any, index: any) => (
                  <img
                    src={outflow.token_details.logo}
                    alt=""
                    className={styles.mediumConfigDropdownIcon}
                    key={index}
                  />
                ))
              : null}
            <div
              className={styles.mediumConfigDropdownText}
              style={chosenPool ? {} : { color: "#626262" }}
            >
              {chosenPool
                ? chosenPool.outflows.map(
                    (outflow: any, index: number, arr: any[]) =>
                      index !== 0
                        ? `, ${outflow.token_details.symbol}`
                        : `${outflow.token_details.symbol}`
                  )
                : chosenProtocol
                ? "Choose Pool"
                : "Choose Protocol"}
            </div>
            {chosenPool ? (
              <div
                className={styles.mediumConfigStakePoolDropdownEarnContainer}
              >
                <div
                  className={
                    styles.mediumConfigStakePoolDropdownEarnGradientText
                  }
                >
                  Earn
                </div>
                <div
                  className={
                    styles.mediumConfigStakePoolDropdownEarnIconsContainer
                  }
                >
                  {chosenPool.inflows
                    .concat(chosenPool.earnAction.inflows)
                    .map((inflow: any, index: number) => (
                      <img
                        src={inflow.token_details.logo}
                        alt=""
                        key={index}
                        className={styles.mediumConfigStakePoolDropdownEarnIcon}
                      />
                    ))}
                </div>
                <div
                  className={styles.mediumConfigStakePoolDropdownEarnWhiteText}
                >
                  {chosenPool.inflows
                    .concat(chosenPool.earnAction.inflows)
                    .map(
                      (inflow: any, index: number) =>
                        `$${inflow.token_details.symbol}`
                    )}
                </div>
              </div>
            ) : null}
            {chosenProtocol ? (
              <img
                src="/mediumConfigTitleArrow.svg"
                alt=""
                className={styles.mediumConfigDropdownArrow}
              />
            ) : null}
          </motion.div>
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
            chosenProtocol && chosenPool
              ? () => assembleStep()
              : (e: any) =>
                  setOpenHoverDetails({
                    top: e.clientY + window.scrollY,
                    left: e.clientX,
                    text: "You Must Choose A Pool Before Adding This Step",
                  })
          }
        >
          Add +
        </motion.button>
      </div>
    </div>
  );
};

export const StakeConfig = (props: any, ref: any) => {
  const { size, style, stepId } = props;

  return (
    <div>
      {size === SizingEnum.MEDIUM ? (
        <MediumConfig
          style={style}
          stepAssemblyHandler={props.stepAssemblyHandler}
          stepId={stepId}
          ref={ref}
          setNodeProcessStep={props.setNodeProcessStep}
        />
      ) : (
        <h1 style={{ color: "white" }}>LOOOOOOOSER </h1>
      )}
    </div>
  );
};
