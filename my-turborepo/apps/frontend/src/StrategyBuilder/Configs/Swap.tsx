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
import {
  DatabaseContext,
  StrategyContext,
} from "../../Contexts/DatabaseContext";
import { ButtonVariants } from "../../MotionVariants";
import { HoverDetails } from "../../HoverDetails";
import { SizingEnum } from "../Enums";
import { calcDivisor } from "../../utils/utils.js";
import { EditPercentageModal } from "../../editDistribution";
import { NodeStepEnum } from "../Enums";
import { TokenSwapModal } from "../../TokenSwapModal";
import * as ethers from "ethers";

export const MediumConfig = (props: any) => {
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

  // Keeps track of the pool dropdown, true when it should be opened,
  // False when it should be closed
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<any>(false);

  // Keeps Track Of The Current Chosen Pool, To Display It Accordingly &&
  // To Be Used Within the Assembled Step (IT includes all the needed details)
  const [chosenFromToken, setChosenFromToken] = useState<any>(null);

  const [chosenToToken, setChosenToToken] = useState<any>(null);

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
  const [customArguments, setCustomArguments] = useState<any>([]);

  // Keeping track of whether custom arguments are required
  const [customArgumentsRequired, setCustomArgumentsRequired] =
    useState<boolean>(false);

  // Currently swap go through Li.Fi, so there is a single
  // Function identifier for all swaps
  const SwapFunctionIdentifier = 14;

  const [chosenDex, setChosenDex] = useState<any>(null);

  useEffect(() => {
    if (fullProtocolsList) {
      let LifiProtocolDetails = fullProtocolsList.find(
        (protocol: any) => protocol.protocol_identifier == 3
      );
      setChosenDex(LifiProtocolDetails);
    }
  }, [fullProtocolsList]);

  // Assemble the step object using user's token choices
  const assembleStep = async () => {
    let step = {
      type: "Swap",
      action_identifier: StakeIdentifier,
      divisor: await calcDivisor(chosePercentage),
      percentage: chosePercentage,
      function_identifiers: [SwapFunctionIdentifier],
      address_identifiers: [
        (
          await protocolsAddressesList.find(
            (protocolAddressPair: any) =>
              protocolAddressPair.protocol_identifier ==
              chosenDex.protocol_identifier
          )
        ).address_identifier,
      ],
      protocol_details: chosenDex,
      additional_args: [
        ethers.utils.getAddress(chosenFromToken.address),
        ethers.utils.getAddress(chosenToToken.address),
        `${chosenFromToken.symbol.toUpperCase()}_BALANCE / activeDivisor`,
      ],
      flow_identifiers: [-1, -1],
      step_identifier: stepId,
      parent_step_identifier: strategySteps[stepId].parent_step_identifier,
      outflows: [{ flow_identifier: -1, token_details: chosenFromToken }],
      inflows: [{ flow_identifier: -1, token_details: chosenToToken }],
      children: [],
    };
    let actionAbleTokensCopy = [...actionableTokens];
    let fromTokenIndex = actionAbleTokensCopy.findIndex(
      (token: any) => token.token_identifier == chosenFromToken.token_identifier
    );
    actionAbleTokensCopy.splice(fromTokenIndex, 1, chosenToToken);

    setActionableTokens(actionAbleTokensCopy);
    stepAssemblyHandler(step);
  };

  // Token Choice handler, passed down as props
  const handleTokenChoice = (token: any, target: string) => {
    if (target === "from") {
      setChosenFromToken(token);
    } else if (target === "to") {
      setChosenToToken(token);
    } else {
    }
    setIsTokenModalOpen(false);
  };

  /**
   * @Handlers
   */

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
      {isTokenModalOpen ? (
        <TokenSwapModal
          choiceHandler={handleTokenChoice}
          target={isTokenModalOpen}
          handleModal={setIsTokenModalOpen}
          tokensList={actionableTokens}
          isStrategy={true}
        />
      ) : null}
      <div className={styles.mediumSwapConfigContainer} style={style}>
        <div className={styles.mediumConfigTitleContainer}>
          <div className={styles.mediumConfigTitleTextOff}>Action:</div>
          <div className={styles.mediumConfigTitleTextOn}>Swap</div>
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
          <div className={styles.mediumSwapConfigHeadDexContainer}>
            <div className={styles.mediumSwapConfigDexTitle}>DEX</div>
            <div className={styles.mediumSwapConfigDexContainer}>
              <img
                src="/lifi.svg"
                alt=""
                className={styles.mediumSwapConfigTokenIcon}
                style={{ background: "#F5B5FF" }}
              />
              <div className={styles.mediumSwapConfigOnText}>LI.FI</div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.mediumSwapSwappingContainer}>
            <motion.div
              className={styles.mediumSwapConfigTokenDropdownContainer}
              whileHover={{
                backgroundColor: "rgba(5, 5, 5, 0.6)",
                transition: { duration: 0.1 },
              }}
              onClick={() => setIsTokenModalOpen("from")}
            >
              {chosenFromToken && (
                <div>
                  <div className={styles.mediumSwapConfigPriceContainer}>
                    $2.414
                  </div>
                  <img
                    src={chosenFromToken.logo}
                    alt=""
                    className={styles.mediumSwapConfigTokenIcon}
                    style={{ marginBottom: "16px" }}
                  />
                </div>
              )}
              <div
                className={styles.mediumSwapConfigOffText}
                style={chosenFromToken ? { top: "181px" } : { top: "175px" }}
              >
                From
              </div>
              <div
                className={styles.mediumSwapConfigOnText}
                style={
                  !chosenFromToken
                    ? { color: "#676771", marginTop: "6px" }
                    : { marginLeft: "-20px" }
                }
              >
                {!chosenFromToken ? "Choose Token" : chosenFromToken.symbol}
              </div>

              <img
                src="/dropdownarrowdown.svg"
                alt=""
                className={styles.mediumConfigDropdownArrow}
                style={{
                  top: "-1px",
                  left: chosenFromToken ? "-56px" : "-86px",
                  position: "relative",
                }}
              />
            </motion.div>
            <div className={styles.mediumSwapConfigPairDetailsContainer}>
              <div className={styles.mediumSwapConfigSwapElipse}>
                <img
                  src="/configswapicon.svg"
                  alt=""
                  className={styles.mediumSwapConfigSwapIcon}
                />
              </div>
              <div className={styles.mediumSwapConfigPairDetailsLine}></div>
              <div className={styles.mediumSwapConfigPairDetailsText}>
                1 CAKE = 1 BNB
              </div>
            </div>
            <motion.div
              className={styles.mediumSwapConfigTokenDropdownContainer}
              style={{ marginTop: "0px" }}
              onClick={() => setIsTokenModalOpen("to")}
            >
              {chosenToToken && (
                <div>
                  <div className={styles.mediumSwapConfigPriceContainer}>
                    $2.414
                  </div>
                  <img
                    src={chosenToToken.logo}
                    alt=""
                    className={styles.mediumSwapConfigTokenIcon}
                    style={{ marginBottom: "16px" }}
                  />
                </div>
              )}
              <div
                className={styles.mediumSwapConfigOffText}
                style={chosenToToken ? { top: "210.5" } : { top: "287px" }}
              >
                To
              </div>
              <div
                className={styles.mediumSwapConfigOnText}
                style={
                  !chosenToToken
                    ? { color: "#676771", marginTop: "6px" }
                    : { marginLeft: "-20px" }
                }
              >
                {!chosenToToken ? "Choose Token" : chosenToToken.symbol}
              </div>
              <img
                src="/dropdownarrowdown.svg"
                alt=""
                className={styles.mediumConfigDropdownArrow}
                style={{
                  top: "-1px",
                  left: chosenToToken ? "-56px" : "-86px",
                  position: "relative",
                }}
              />
            </motion.div>
          </div>
        </div>
        <motion.div
          className={styles.mediumConfigCancelAction}
          onClick={() => handleCancelClick()}
        >
          <div className={styles.mediumConfigCancelActionText}>
            Cancel Action
          </div>
        </motion.div>
        <motion.div
          className={styles.mediumConfigDoneButton}
          variants={ButtonVariants}
          initial="normal"
          whileHover="hover"
          onClick={
            chosenFromToken && chosenToToken
              ? () => assembleStep()
              : (e: any) =>
                  setOpenHoverDetails({
                    top: e.clientY + window.scrollY,
                    left: e.clientX,
                    text: `${
                      chosenFromToken.symbol + " -> " + chosenToToken.symbol
                    }`,
                  })
          }
          style={{ position: "absolute" }}
        >
          Add +
        </motion.div>
      </div>
    </div>
  );
};

export const SwapConfig = (props: any) => {
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
