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
import { ethers } from "ethers";
import { TokenSwapModal } from "../../TokenSwapModal";
import _ from "lodash";
import { findProtocolActionMainFunction } from "../../utils/utils";
import axios from "axios";

export const MediumConfig = (props: any, ref: any) => {
  /**
   * The Identifier Of The Current Action ("Add Liquidity")
   */
  let AddLiquidityIdentifier = 3;

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
    setShowTokenModal,
    showTokenModal,
  } = useContext(StrategyContext);

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
  const [isTokenSwapModalOpen, setIsTokenSwapModalOpen] = useState<any>(false);

  // Keeps Track Of The Current Chosen Protocol, To Display It Accordingl
  // In THe Dropdown Box, And Also Set The Pools Options
  const [chosenProtocol, setChosenProtocol] = useState<any>(null);

  // Keeps Track Of the Current Percentage Allocated To The Step
  const [chosePercentage, setChosePercentage] = useState<number>(
    // strategySteps[
    //   strategySteps.findIndex((_step: any) => _step.step_identifier == stepId)
    // ].percentage
    50
  );
  // Opens The Hover Details Popup
  const [openHoverDetails, setOpenHoverDetails] = useState<any>(false);

  // Opens And Closes The Percentage Modal
  const [openPercentageModal, setOpenPercentageModal] = useState<any>(false);

  // Keeps track of the selected tokens
  const [chosenTokenOne, setChosenTokenOne] = useState<any>(null);
  const [chosenTokenTwo, setChosenTokenTwo] = useState<any>(null);

  // Keeps track of the (optional) custom arguments
  const [customArguments, setCustomArguments] = useState<any>([]);

  // Keeping track of whether custom arguments are required
  const [customArgumentsRequired, setCustomArgumentsRequired] =
    useState<boolean>(false);

  // Refs for different objects
  const protocolRef = useRef<HTMLDivElement>(null);
  const tokenOneRef = useRef<HTMLDivElement>(null);
  const tokenTwoRef = useRef<HTMLDivElement>(null);

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
    setChosenProtocol(protocol);
    setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
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

  const handleTokenChoice = (token: any, target: string) => {
    if (target === "tokenOne") {
      setChosenTokenOne(token);
    } else if (target === "tokenTwo") {
      setChosenTokenTwo(token);
    } else {
    }
    setShowTokenModal(false);
  };

  const handleDropDownClick = (target: any) => {
    if (target == "protocol") {
      if (isTokenSwapModalOpen) {
        setShowTokenModal(!isTokenSwapModalOpen);
      }
      setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
    } else if (target == "pool") {
      if (isProtocolDropdownOpen) {
        setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
      }
      setShowTokenModal(!isTokenSwapModalOpen);
    }
  };

  const handleTokenOpenClick = (
    target: { target: string; choiceHandler: Function },
    ref: any
  ) => {
    if (chosenProtocol) {
      setShowTokenModal(target);
    } else {
      setOpenHoverDetails({
        top: ref.current.getBoundingClientRect().y,
        left: ref.current.getBoundingClientRect().x - 20,
        text: "Please Choose A Protocol First",
      });
      setTimeout(() => {
        setOpenHoverDetails(false);
      }, 2000);
    }
  };

  /**
   * @AssembleStep - Assembles The Step Object Using The Configured Settings
   */

  const assembleStep = async () => {
    let functionId = 37;

    let addLiqAddress = fullAddressesList.find((address: any) =>
      address.functions.includes(functionId)
    );

    // Regex protocol name to remove all spacing
    let clientName = chosenProtocol.name.replace(/\s/g, "").toLowerCase();

    let step = {
      type: "Add Liquidity",
      action_identifier: AddLiquidityIdentifier,
      divisor: await calcDivisor(chosePercentage),
      percentage: chosePercentage,
      function_identifiers: [functionId],
      address_identifiers: [addLiqAddress.address_identifier],
      protocol_details: chosenProtocol,
      additional_args: [
        `"${clientName}"`,
        [ethers.utils.getAddress(chosenTokenOne.address)], // Token A Address
        [ethers.utils.getAddress(chosenTokenTwo.address)], // Token B Address
        [`${chosenTokenOne.symbol.toUpperCase()}_BALANCE / activeDivisor`], // Token A Amount
        [`${chosenTokenTwo.symbol.toUpperCase()}_BALANCE / activeDivisor`], // Token B Amount
        40, // Slippage, // TODO: ALlow user to set slippage ?
        [], // Custom arguments // TODO: Add support for custom arguments on add liquidity
      ],
      flow_identifiers: [-1, -1],
      step_identifier: stepId,
      parent_step_identifier: strategySteps[stepId].parent_step_identifier,
      outflows: [
        { flow_identifier: -1, token_details: chosenTokenOne },
        { flow_identifier: -1, token_details: chosenTokenTwo },
      ],
      inflows: [
        {
          flow_identifier: -1,
          token_details: {
            name: `${chosenTokenOne.symbol}-${
              chosenTokenTwo.symbol
            } LP-Token ${_.camelCase(chosenProtocol.name)} `,
            logo: chosenProtocol.logo,
            symbol: `${chosenTokenOne.symbol}-${chosenTokenTwo.symbol}-LP`,
          },
        },
      ],
      children: [],
    };

    console.log("Adding This Step", step);

    let tempActionableTokens = [
      {
        name: `${chosenTokenOne.symbol}-${
          chosenTokenTwo.symbol
        } LP-Token ${_.camelCase(chosenProtocol.name)} `,
        logo: chosenProtocol.logo,
        symbol: `${chosenTokenOne.symbol}-${chosenTokenTwo.symbol}-LP`,
      },
    ];

    setActionableTokens([...actionableTokens.concat(tempActionableTokens)]);
    stepAssemblyHandler(step);
  };

  const [protocolsList, setProtocolsList] = useState<any>([]);

  useEffect(() => {
    (async () => {
      let addLiqProtocolIDs = await (
        await axios.get(`https://api.yieldchain.io/actions/${"addliquidity"}`)
      ).data.actionTable.map((t: any) => t.function_identifier);

      let protocols = fullProtocolsList.filter((protocol: any) =>
        addLiqProtocolIDs.includes(protocol.protocol_identifier)
      );

      setProtocolsList(protocols);
    })();

    return () => {
      setProtocolsList([]);
    };
  }, [fullProtocolsList]);

  /**
   * @Component
   */
  return (
    <div>
      {/* {isTokenSwapModalOpen ? (
        <TokenSwapModal
          choiceHandler={handleTokenChoice}
          target={isTokenSwapModalOpen}
          handleModal={setIsTokenSwapModalOpen}
        />
      ) : null} */}
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
      <div className={styles.mediumConfigContainer} style={style} ref={ownRef}>
        {isProtocolDropdownOpen && (
          <ProtocolDropDown
            top={`185`}
            left={`24`}
            choiceHandler={protocolChoiceHandler}
            protocolsList={protocolsList}
          />
        )}

        <div className={styles.mediumConfigTitleContainer}>
          <div className={styles.mediumConfigTitleTextOff}>Action:</div>
          <div className={styles.mediumConfigTitleTextOn}>Add Liquidity</div>
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
        <div className={styles.addLiquidityMidFlexBox}>
          <div className={styles.addLiquidityProtocolFlexContainer}>
            <div className={styles.mediumConfigDropdownTitle}>Protocol</div>
            <div
              className={styles.mediumConfigDropdownContainer}
              onClick={(e: any) => handleDropDownClick("protocol")}
              ref={protocolRef}
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
          <div className={styles.addLiquidityPairsFlexContainer}>
            <div className={styles.mediumConfigDropdownTitle}>
              Liquidity Pair
            </div>

            <div className={styles.addLiquidityPairContainersFlexRow}>
              {/** Token #1 */}
              <div
                className={
                  styles.addLiquidityMediumConfigTokenDropdownContainer
                }
                onClick={() =>
                  handleTokenOpenClick(
                    { target: "tokenOne", choiceHandler: handleTokenChoice },
                    tokenOneRef
                  )
                }
                ref={tokenOneRef}
              >
                {chosenTokenOne ? (
                  <img
                    src={chosenTokenOne.logo}
                    alt=""
                    className={styles.addLiquidityMediumConfigTokenIcon}
                  />
                ) : null}
                {chosenTokenOne ? (
                  <div
                    className={styles.addLiquidityMediumConfigTokenDropdownText}
                  >
                    {chosenTokenOne.symbol}
                  </div>
                ) : (
                  <div
                    className={styles.addLiquidityMediumConfigTokenDropdownText}
                    style={{ color: "#626262", marginLeft: "6px" }}
                  >
                    Select Token.......
                  </div>
                )}
                {chosenProtocol ? (
                  <img
                    src="/liquiditydropdownarrow.svg"
                    alt=""
                    className=""
                    style={{
                      position: "relative",
                      left: `${chosenTokenOne ? 0 : -10}px`,
                      cursor: "pointer",
                    }}
                  />
                ) : null}
              </div>
              <img src="/liquidityplusicon.svg" alt="" className="" />

              {/** Token #2 */}
              <div
                className={
                  styles.addLiquidityMediumConfigTokenDropdownContainer
                }
                onClick={() =>
                  handleTokenOpenClick(
                    {
                      target: "tokenTwo",
                      choiceHandler: handleTokenChoice,
                    },
                    tokenTwoRef
                  )
                }
                ref={tokenTwoRef}
              >
                {chosenTokenTwo ? (
                  <img
                    src={chosenTokenTwo.logo}
                    alt=""
                    className={styles.addLiquidityMediumConfigTokenIcon}
                  />
                ) : null}
                {chosenTokenTwo ? (
                  <div
                    className={styles.addLiquidityMediumConfigTokenDropdownText}
                  >
                    {chosenTokenTwo.symbol}
                  </div>
                ) : (
                  <div
                    className={styles.addLiquidityMediumConfigTokenDropdownText}
                    style={{ color: "#626262", marginLeft: "6px" }}
                  >
                    Select Token.......
                  </div>
                )}
                {chosenProtocol ? (
                  <img
                    src="/liquiditydropdownarrow.svg"
                    alt=""
                    className=""
                    style={{
                      position: "relative",
                      left: `${chosenTokenOne ? 0 : -10}px`,
                      cursor: "pointer",
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div></div>
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
            chosenProtocol && chosenTokenOne
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

export const AddLiquidityConfig = (props: any) => {
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
