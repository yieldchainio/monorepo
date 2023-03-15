/* --------------------------------------------------------------------------*/
// Imports
/* --------------------------------------------------------------------------*/
import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./css/vaultmodal.module.css";
import { StepBlockMini } from "./StepBlockMini";
import {
  getTokenDetails,
  getNetworkDetails,
  getProtocolDetails,
  calculateInterval,
  getStepDetails,
  formatDecimals,
} from "./utils/utils.js";
import { DatabaseContext } from "Contexts/DatabaseContext";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { getUserDetails } from "./utils/utils";
import { LoadingScreen } from "LoadingScreen";
import { layoutNodes } from "Layouting";
import { AutoLine } from "StrategyBuilder/AutoLine";
import { AnyCnameRecord } from "dns";
const ethers = require("ethers");
declare var window: any;
const ethereum = window.ethereum as MetaMaskInpageProvider;

/* -------------------------------------------------------------------------- */

export const VaultModal = (props: any) => {
  // The Current Connected Account's Address
  const { accountAddress, baseStrategyABI, erc20ABI, provider, signer } =
    useContext(DatabaseContext);

  // Utility / Styling States
  const [detailsLoading, setDetailsLoading] = useState<any>(true);
  const [operationsStatus, setOperationsStatus] = useState("deposit");
  const [modalExpanded, setModalExpanded] = React.useState<string>("undefined");
  const [isHoveringExecutionBtn, setIsHoveringExecutionBtn] = useState(false);

  // Vault Details States
  const [main_token_details, setMainTokenDetials] = useState<any>(undefined);
  const [final_token_details, setFinalTokenDetials] = useState<any>(undefined);
  const [network_details, setNetworkDetials] = useState<any>(undefined);
  const [userDetails, setUserDetails] = useState<any>(undefined);
  const [protocol, setProtocol] = useState<any>(undefined);
  const [stateSteps, setSteps] = useState<any>([]);

  // Execution States
  const [operationInput, setOperationInput] = useState<any>(undefined);
  const [userDepositTokenBalance, setUserDepositTokenBalance] =
    useState<any>(0.0);
  const [userShares, setUserShares] = useState<any>(0.0);

  const [depositTokenContract, setDepositTokenContract] =
    useState<any>(undefined);
  const [vaultContract, setVaultContract] = useState<any>(undefined);

  const vaultDetails = props.vaultDetails;
  let {
    name,
    strategy_identifier,
    address,
    apy,
    tvl,
    main_protocol_identifier,
    creator_user_identifier,
    main_token_identifier,
    final_token_identifier,
    is_verified,
    is_trending,
    execution_interval,
    chain_id,
    strategy_object,
  }: any = vaultDetails;

  let steps: any = [];

  /**
   * Allows The User To Deposit Tokens Into The Vault
   * @param _amount The amount of the deposit token to deposit
   */
  const handleOperation = async (_amount: number, _operation: string) => {
    await provider.send("eth_requestAccounts", []);
    let depositTokenDecimals = main_token_details.decimals;

    const currentStrategyContract = new ethers.Contract(
      address,
      baseStrategyABI.default,
      signer
    );
    let result;
    if (_operation === "deposit") {
      let allownace = await depositTokenContract.allowance(
        accountAddress,
        address
      );
      if (ethers.utils.formatUnits(allownace, depositTokenDecimals) < _amount) {
        result = await depositTokenContract.approve(
          address,
          "10000000000000000000"
        );
        await result.wait();
      }
      result = await currentStrategyContract.deposit(
        ethers.utils.parseUnits(_amount.toString(), depositTokenDecimals)
      );
    } else if (_operation === "withdraw") {
      result = await currentStrategyContract.withdraw(
        ethers.utils.parseUnits(_amount.toString(), depositTokenDecimals)
      );
    }
    await result.wait();
    await updateOnchainDetails();
  };

  /**
   * Retreives the user's balance of the deposit token
   */
  const getErc20Balance = async () => {
    if (main_token_details) {
      let depositTokenDecimals = main_token_details.decimals;
      let result = await depositTokenContract.balanceOf(accountAddress);
      let balance = ethers.utils.formatUnits(result, depositTokenDecimals);

      setUserDepositTokenBalance(
        await formatDecimals(balance, main_token_details.decimals)
      );
    }
  };

  const getUserShares = async () => {
    let depositTokenDecimals = main_token_details.decimals;
    let result = await vaultContract.userShares(accountAddress);
    let balance = ethers.utils.formatUnits(result, depositTokenDecimals);

    setUserShares(await formatDecimals(balance, main_token_details.decimals));
  };

  const updateOnchainDetails = async () => {
    await getErc20Balance();
    await getUserShares();
  };

  const initializeData = async (vaultDetails: any) => {
    try {
      let mainTokenDetails;
      let finalTokenDetails;
      let networkDetails;
      let protocolDetails;
      let userDetails;
      let stepsDetails: any[] = [];
      mainTokenDetails = await getTokenDetails(
        vaultDetails.main_token_identifier
      );
      finalTokenDetails = await getTokenDetails(
        vaultDetails.final_token_identifier
      );
      networkDetails = await getNetworkDetails(vaultDetails.chain_id);
      protocolDetails = await getProtocolDetails(
        vaultDetails.main_protocol_identifier
      );
      userDetails = await getUserDetails(
        vaultDetails.creator_user_identifier,
        "NA"
      );

      for await (const step of strategy_object.strategy_initiation.base_steps) {
        let stepDetails = await getStepDetails(step);

        stepsDetails.push(stepDetails);
      }
      for await (const step of strategy_object.steps_array) {
        let stepDetails = await getStepDetails(step);
        stepsDetails.push(stepDetails);
      }

      setMainTokenDetials(mainTokenDetails);
      setFinalTokenDetials(finalTokenDetails);
      setNetworkDetials(networkDetails);
      setProtocol(protocolDetails);
      let newStepsArr = [];
      let roots = 0;
      for (const step of strategy_object.steps_array) {
        if (step.parent_step_identifier == (undefined || 0 || "")) {
          roots++;
          step.parent_step_identifier = -1;
        }

        newStepsArr.push(step);
      }

      if (roots > 1) {
        let root = { ...newStepsArr[0] };
        root.step_identifier = -1;
        root.parent_step_identifier = "";
        newStepsArr.unshift(root);
      }
      setSteps(
        newStepsArr.map((step: any) => {
          let newStep = { ...step };
          newStep.width = 216;
          newStep.height = 56;
          return newStep;
        })
      );
      setUserDetails(userDetails);
      setVaultContract(
        new ethers.Contract(
          ethers.utils.getAddress(vaultDetails.address),
          baseStrategyABI.default,
          signer
        )
      );

      await setDepositTokenContract(
        new ethers.Contract(
          ethers.utils.getAddress(mainTokenDetails.address),
          erc20ABI.default,
          signer
        )
      );

      // await getErc20Balance();
      // await getUserShares();
    } catch (error: any) {
      console.log(error);
    }
  };

  const [nodesToLayout, setNodesToLayout] = useState<any>([]);

  const [vaultModalWidth, setVaultModalWidth] = useState<any>(0);

  // useEffect(() => {
  //   if (stateSteps.length > 0) {
  //     const layoutedNodes: any = layoutNodes(stateSteps, window.innerWidth);
  //     setNodesToLayout(layoutedNodes);
  //   }
  // }, [stateSteps]);

  useEffect(() => {
    // check if the vaultDetails prop is defined
    if (!vaultDetails) {
      console.log("Vault detials not defin ed");
      return;
    }

    console.log("Vault details yes defined", vaultDetails);

    // initialize the main_token_details, final_token_details, network_details, and
    // protocol variables
    initializeData(vaultDetails);

    setDetailsLoading(false);
  }, [vaultDetails]); // pass the vaultDetails prop as the second argument to the useEffect hook

  useEffect(() => {
    if (main_token_details && depositTokenContract) {
      getErc20Balance();
    }
    if (vaultContract) {
      getUserShares();
    }
  }, [main_token_details, depositTokenContract, vaultContract]);

  if (!detailsLoading) {
    if (
      name !== undefined &&
      strategy_identifier !== undefined &&
      address !== undefined &&
      apy !== undefined &&
      tvl !== undefined &&
      main_protocol_identifier !== undefined &&
      creator_user_identifier !== undefined &&
      main_token_identifier !== undefined &&
      final_token_identifier !== undefined &&
      is_verified !== undefined &&
      is_trending !== undefined &&
      execution_interval !== undefined &&
      chain_id !== undefined &&
      main_token_details !== undefined &&
      final_token_details !== undefined &&
      network_details !== undefined &&
      protocol !== undefined &&
      // stateSteps.length !== 0 &&
      // stateSteps[0].step_identifier !== undefined &&
      userDetails !== undefined
    ) {
      return (
        <div
          className={styles.wrapper}
          onClick={() => props.modalHandler(undefined)}
        >
          <motion.div
            className={styles.modal_content}
            style={
              modalExpanded == "undefined"
                ? { height: "850px", zIndex: 9999 }
                : { height: `${modalExpanded}px`, zIndex: 9999 }
            }
            onClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            <div className={styles.vaultTitleSection}>
              <img
                src={main_token_details.logo}
                alt=""
                className={styles.vaultTitleImg}
              />
              <div className={styles.vaultTitle}>{main_token_details.name}</div>
              <div className={styles.vaultSubTitle}>{name}</div>
            </div>
            <div className={styles.vaultMainDetails}>
              <div className={styles.vaultDetailTitle}>New APY</div>
              <div className={styles.vaultDetailContent}>{apy}%</div>
              <div className={styles.vaultDetailRewardTitle}>Reward Token</div>
              <div className={styles.vaultDetailRewardContent}>
                {final_token_details.symbol}
              </div>
              <img
                src={final_token_details.logo}
                alt=""
                className={styles.vaultRewardImg}
              />
              <div className={styles.vaultDetailDepositTitle}>
                Your Deposits
              </div>
              <div className={styles.vaultDetailDepositContent}>
                {userShares + " " + main_token_details.symbol}
              </div>
              <div className={styles.vaultDetailSeperator}></div>
              <div className={styles.vaultDetailSeperator2}></div>
            </div>
            <div className={styles.vaultRewardsSection}>
              <div className={styles.vaultDetailTitle}>Your Earnings</div>
              <div className={styles.vaultDetailContent}>
                1,402 {final_token_details.symbol}
              </div>
            </div>
            <div className={styles.vaultOperationsSection}>
              <div className={styles.operationsHeader}>
                <button
                  className={
                    operationsStatus == "deposit"
                      ? styles.operationsSwitchBtnOff
                      : styles.operationsSwitchBtnOn
                  }
                  style={{ left: "230px", top: "14px" }}
                  onClick={() => setOperationsStatus("withdraw")}
                >
                  Withdraw
                </button>
                <button
                  className={
                    operationsStatus == "withdraw"
                      ? styles.operationsSwitchBtnOff
                      : styles.operationsSwitchBtnOn
                  }
                  style={{ left: "10px", top: "14px" }}
                  onClick={() => setOperationsStatus("deposit")}
                >
                  Deposit
                </button>
                <motion.div
                  layout
                  transition={{ duration: 0.3 }}
                  className={styles.operationsSwitchOnLine}
                  style={
                    operationsStatus == "deposit" ? null : { left: "175px" }
                  }
                ></motion.div>
                <div
                  className={styles.operationsTitle}
                  style={{ top: "49px", left: "225px" }}
                  onClick={() => setOperationInput(userDepositTokenBalance)}
                >
                  Balance:
                  {" " +
                    (operationsStatus == "deposit"
                      ? userDepositTokenBalance
                      : userShares)}
                </div>
                <div className={styles.operationsTitle}>
                  {operationsStatus == "deposit"
                    ? "Deposit Amount"
                    : "Withdraw Amount"}
                </div>

                <button
                  className={styles.operationsMaxBtn}
                  onClick={() => setOperationInput(userDepositTokenBalance)}
                >
                  Max
                </button>
                <img
                  src={main_token_details.logo}
                  alt=""
                  className={styles.operationsInputImg}
                />
                <div className={styles.operationsInputToken}>
                  {main_token_details.symbol}
                </div>
                <input
                  type="number"
                  className={styles.vaultOperationsInput}
                  placeholder="0.00"
                  onChange={(event: any) =>
                    setOperationInput(event.target.value)
                  }
                  value={operationInput}
                />
              </div>
              <motion.button
                layout
                className={
                  !isHoveringExecutionBtn
                    ? styles.vaultOperationsExecuteBtn
                    : styles.vaultOperationsExecuteBtnHover
                }
                style={{ zIndex: "99999999999" }}
                whileHover={{
                  background:
                    "linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%)",
                  border: "0px solid transparent",
                  color: "black",
                }}
                onClick={() =>
                  operationInput > 0
                    ? handleOperation(operationInput, operationsStatus)
                    : alert("Please enter a valid amount")
                }
              >
                {operationsStatus == "deposit"
                  ? "Confirm Deposit"
                  : "Confirm Withdrawal"}
              </motion.button>
            </div>
            <div className={styles.vaultMiddleSection}>
              <div className={styles.vaultExtraDetailsTitleText}>
                Extra Details
              </div>
              <div className={styles.vaultExtraSection}>
                <div className={styles.vaultDetailTitle}>Daily Gas In</div>
                <div
                  className={styles.vaultDetailContent}
                  style={{ color: "#669F2A" }}
                >
                  +$10
                </div>
                <div
                  className={styles.vaultDetailTitle}
                  style={{ left: "219px", top: "-19.25px" }}
                >
                  Daily Gas Out
                </div>
                <div
                  className={styles.vaultDetailContent}
                  style={{ color: "#F04438", left: "219px", top: "-15.25px" }}
                >
                  -$7
                </div>
                <div
                  className={styles.vaultDetailTitle}
                  style={{ position: "relative", top: "10px" }}
                >
                  Vault Runs Every
                </div>
                <div
                  className={styles.vaultDetailContent}
                  style={{ top: "12px" }}
                >
                  {calculateInterval(execution_interval)}
                </div>
              </div>
              <div className={styles.gasBalanceBox}>
                <div className={styles.vaultDetailTitle}>Gas Balance</div>
                <div className={styles.vaultDetailContent}>$10</div>
                <div className={styles.gasBalanceBtn}>Add Gas</div>
                <div
                  className={styles.vaultDetailTitle}
                  style={{ top: "90px" }}
                >
                  Gas Finishes in 10 Days
                </div>
              </div>
            </div>
            <div className={styles.deployerProfileSection}>
              <img
                src={props.vaultDetails.vaultMainImg}
                alt=""
                className={styles.profileImg}
              />
              <div className={styles.profileName}>{userDetails.name}</div>
              <div className={styles.profileDescription}>
                {userDetails.description}
              </div>

              <div className={styles.profileSocialMediaSection}>
                <button className={styles.socialMediaBtn}>
                  <img
                    src="twitter.svg"
                    alt=""
                    className={styles.socialMediaBtnImg}
                    style={{ left: "-0.5px" }}
                    onClick={() => window.open(userDetails.twitter, "_blank")}
                  />
                </button>
                <button className={styles.socialMediaBtn}>
                  <img
                    src="discordicon.svg"
                    alt=""
                    className={styles.socialMediaBtnImg}
                    style={{ left: "-1.5px", width: "15px", height: "13px" }}
                  />
                </button>
                <button className={styles.socialMediaBtn}>
                  <img
                    src="shareicon.svg"
                    alt=""
                    className={styles.socialMediaBtnImg}
                    style={{ left: "-1.5px" }}
                  />
                </button>
              </div>
            </div>
            <div className={styles.hiddenStrategyContainer}>
              {modalExpanded == "undefined" ? (
                <div className={styles.strategyBlur}></div>
              ) : null}
              {/* {modalExpanded == "undekfined" ? (
                <div className={styles.initialStrategyView}>
                  <div>
                    <StepBlockMini
                      stepDetails={stateSteps[0]}
                      isLast={false}
                      style={{
                        position: "absolute",
                        top: "116px",
                        left: `${(window.innerWidth * 0.66) / 2 - 74}px`,
                      }}
                    />
                  </div>
                  <div>
                    <StepBlockMini
                      stepDetails={stateSteps[1]}
                      isLast={true}
                      style={{
                        position: "absolute",
                        top: "166px",
                        left: `${(window.innerWidth * 0.66) / 2 - 74}px`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.fullStrategyViewContainer}>
                  {nodesToLayout.length &&
                    nodesToLayout.map((step: any, index: number) => {
                      let tStyle = {
                        top: `${step.position.y + 82}px`,
                        left: `${
                          step.position.x + (window.innerWidth * 0.66) / 2 - 74
                        }px`,
                        position: "absolute",
                        zIndex: `1000`,
                      };

                      let nodeChilds = step.children;

                      return (
                        <div>
                          <StepBlockMini
                            stepId={step.step_identifier}
                            style={tStyle}
                            key={index}
                            stepDetails={step}
                          />
                          {nodeChilds
                            ? nodeChilds.map((child: any, indexx: number) => {
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
                                        x: `${
                                          step.position.x +
                                          (window.innerWidth * 0.66) / 2 -
                                          74
                                        }px`,
                                        y: step.position.y + 82,
                                      },
                                    }}
                                    childNode={{
                                      width: newObj.width,
                                      height: newObj.height,
                                      position: {
                                        x: `${
                                          newObj.position.x +
                                          (window.innerWidth * 0.66) / 2 -
                                          74
                                        }px`,
                                        y: newObj.position.y + 82,
                                      },
                                      type: newObj.type,
                                      empty: newObj.empty
                                        ? newObj.empty
                                        : false,
                                    }}
                                    key={indexx}
                                  />
                                );
                              })
                            : null}
                        </div>
                      );
                    })}
                </div>
              )} */}

              <motion.div
                layout
                className={styles.viewDetailsExpanderContainer}
                onClick={() => {
                  modalExpanded === "undefined"
                    ? setModalExpanded(`${950 + stateSteps.length * 80}`)
                    : setModalExpanded("undefined");
                }}
                style={
                  modalExpanded !== "undefined"
                    ? { top: "580px" }
                    : { top: "763px" }
                }
              >
                <motion.div className={styles.viewDetailsText}>
                  {modalExpanded !== "undefined"
                    ? "Hide Strategy"
                    : "View Strategy"}
                </motion.div>
                <motion.img
                  src="arrowdown.svg"
                  alt=""
                  className={styles.viewDetailsArrowDown}
                  style={
                    modalExpanded !== "undefined"
                      ? { transform: "rotate(270deg)" }
                      : null
                  }
                />
              </motion.div>
            </div>
          </motion.div>
          <div
            className={styles.wrapperAddon}
            style={
              modalExpanded !== "undefined"
                ? { marginTop: `${parseInt(modalExpanded) + 21}px` }
                : { marginTop: "871px" }
            }
          ></div>
        </div>
      );
    } else {
      return (
        <div
          className={styles.wrapper}
          onClick={() => props.modalHandler(undefined)}
        >
          <motion.div
            className={styles.modal_content}
            style={
              modalExpanded == "undefined"
                ? { height: "850px" }
                : { height: `${modalExpanded}px` }
            }
            onClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            <LoadingScreen />
          </motion.div>
        </div>
      );
    }
  } else {
    return (
      <div
        className={styles.wrapper}
        onClick={() => props.modalHandler(undefined)}
      >
        <motion.div
          className={styles.modal_content}
          style={
            modalExpanded == "undefined"
              ? { height: "850px" }
              : { height: `${modalExpanded}px` }
          }
          onClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          <LoadingScreen />
        </motion.div>
      </div>
    );
  }
};
