"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultModal = void 0;
/* --------------------------------------------------------------------------*/
// Imports
/* --------------------------------------------------------------------------*/
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const vaultmodal_module_css_1 = __importDefault(require("./css/vaultmodal.module.css"));
const utils_js_1 = require("./utils/utils.js");
const DatabaseContext_1 = require("Contexts/DatabaseContext");
const utils_1 = require("./utils/utils");
const LoadingScreen_1 = require("LoadingScreen");
const ethers = require("ethers");
const ethereum = window.ethereum;
/* -------------------------------------------------------------------------- */
const VaultModal = (props) => {
    // The Current Connected Account's Address
    const { accountAddress, baseStrategyABI, erc20ABI, provider, signer } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    // Utility / Styling States
    const [detailsLoading, setDetailsLoading] = (0, react_1.useState)(true);
    const [operationsStatus, setOperationsStatus] = (0, react_1.useState)("deposit");
    const [modalExpanded, setModalExpanded] = react_1.default.useState("undefined");
    const [isHoveringExecutionBtn, setIsHoveringExecutionBtn] = (0, react_1.useState)(false);
    // Vault Details States
    const [main_token_details, setMainTokenDetials] = (0, react_1.useState)(undefined);
    const [final_token_details, setFinalTokenDetials] = (0, react_1.useState)(undefined);
    const [network_details, setNetworkDetials] = (0, react_1.useState)(undefined);
    const [userDetails, setUserDetails] = (0, react_1.useState)(undefined);
    const [protocol, setProtocol] = (0, react_1.useState)(undefined);
    const [stateSteps, setSteps] = (0, react_1.useState)([]);
    // Execution States
    const [operationInput, setOperationInput] = (0, react_1.useState)(undefined);
    const [userDepositTokenBalance, setUserDepositTokenBalance] = (0, react_1.useState)(0.0);
    const [userShares, setUserShares] = (0, react_1.useState)(0.0);
    const [depositTokenContract, setDepositTokenContract] = (0, react_1.useState)(undefined);
    const [vaultContract, setVaultContract] = (0, react_1.useState)(undefined);
    const vaultDetails = props.vaultDetails;
    let { name, strategy_identifier, address, apy, tvl, main_protocol_identifier, creator_user_identifier, main_token_identifier, final_token_identifier, is_verified, is_trending, execution_interval, chain_id, strategy_object, } = vaultDetails;
    let steps = [];
    /**
     * Allows The User To Deposit Tokens Into The Vault
     * @param _amount The amount of the deposit token to deposit
     */
    const handleOperation = async (_amount, _operation) => {
        await provider.send("eth_requestAccounts", []);
        let depositTokenDecimals = main_token_details.decimals;
        const currentStrategyContract = new ethers.Contract(address, baseStrategyABI.default, signer);
        let result;
        if (_operation === "deposit") {
            let allownace = await depositTokenContract.allowance(accountAddress, address);
            if (ethers.utils.formatUnits(allownace, depositTokenDecimals) < _amount) {
                result = await depositTokenContract.approve(address, "10000000000000000000");
                await result.wait();
            }
            result = await currentStrategyContract.deposit(ethers.utils.parseUnits(_amount.toString(), depositTokenDecimals));
        }
        else if (_operation === "withdraw") {
            result = await currentStrategyContract.withdraw(ethers.utils.parseUnits(_amount.toString(), depositTokenDecimals));
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
            setUserDepositTokenBalance(await (0, utils_js_1.formatDecimals)(balance, main_token_details.decimals));
        }
    };
    const getUserShares = async () => {
        let depositTokenDecimals = main_token_details.decimals;
        let result = await vaultContract.userShares(accountAddress);
        let balance = ethers.utils.formatUnits(result, depositTokenDecimals);
        setUserShares(await (0, utils_js_1.formatDecimals)(balance, main_token_details.decimals));
    };
    const updateOnchainDetails = async () => {
        await getErc20Balance();
        await getUserShares();
    };
    const initializeData = async (vaultDetails) => {
        try {
            let mainTokenDetails;
            let finalTokenDetails;
            let networkDetails;
            let protocolDetails;
            let userDetails;
            let stepsDetails = [];
            mainTokenDetails = await (0, utils_js_1.getTokenDetails)(vaultDetails.main_token_identifier);
            finalTokenDetails = await (0, utils_js_1.getTokenDetails)(vaultDetails.final_token_identifier);
            networkDetails = await (0, utils_js_1.getNetworkDetails)(vaultDetails.chain_id);
            protocolDetails = await (0, utils_js_1.getProtocolDetails)(vaultDetails.main_protocol_identifier);
            userDetails = await (0, utils_1.getUserDetails)(vaultDetails.creator_user_identifier, "NA");
            for await (const step of strategy_object.strategy_initiation.base_steps) {
                let stepDetails = await (0, utils_js_1.getStepDetails)(step);
                stepsDetails.push(stepDetails);
            }
            for await (const step of strategy_object.steps_array) {
                let stepDetails = await (0, utils_js_1.getStepDetails)(step);
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
            setSteps(newStepsArr.map((step) => {
                let newStep = { ...step };
                newStep.width = 216;
                newStep.height = 56;
                return newStep;
            }));
            setUserDetails(userDetails);
            setVaultContract(new ethers.Contract(ethers.utils.getAddress(vaultDetails.address), baseStrategyABI.default, signer));
            await setDepositTokenContract(new ethers.Contract(ethers.utils.getAddress(mainTokenDetails.address), erc20ABI.default, signer));
            // await getErc20Balance();
            // await getUserShares();
        }
        catch (error) {
            console.log(error);
        }
    };
    const [nodesToLayout, setNodesToLayout] = (0, react_1.useState)([]);
    const [vaultModalWidth, setVaultModalWidth] = (0, react_1.useState)(0);
    // useEffect(() => {
    //   if (stateSteps.length > 0) {
    //     const layoutedNodes: any = layoutNodes(stateSteps, window.innerWidth);
    //     setNodesToLayout(layoutedNodes);
    //   }
    // }, [stateSteps]);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        if (main_token_details && depositTokenContract) {
            getErc20Balance();
        }
        if (vaultContract) {
            getUserShares();
        }
    }, [main_token_details, depositTokenContract, vaultContract]);
    if (!detailsLoading) {
        if (name !== undefined &&
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
            userDetails !== undefined) {
            return (<div className={vaultmodal_module_css_1.default.wrapper} onClick={() => props.modalHandler(undefined)}>
          <framer_motion_1.motion.div className={vaultmodal_module_css_1.default.modal_content} style={modalExpanded == "undefined"
                    ? { height: "850px", zIndex: 9999 }
                    : { height: `${modalExpanded}px`, zIndex: 9999 }} onClick={(event) => {
                    event.stopPropagation();
                }}>
            <div className={vaultmodal_module_css_1.default.vaultTitleSection}>
              <img src={main_token_details.logo} alt="" className={vaultmodal_module_css_1.default.vaultTitleImg}/>
              <div className={vaultmodal_module_css_1.default.vaultTitle}>{main_token_details.name}</div>
              <div className={vaultmodal_module_css_1.default.vaultSubTitle}>{name}</div>
            </div>
            <div className={vaultmodal_module_css_1.default.vaultMainDetails}>
              <div className={vaultmodal_module_css_1.default.vaultDetailTitle}>New APY</div>
              <div className={vaultmodal_module_css_1.default.vaultDetailContent}>{apy}%</div>
              <div className={vaultmodal_module_css_1.default.vaultDetailRewardTitle}>Reward Token</div>
              <div className={vaultmodal_module_css_1.default.vaultDetailRewardContent}>
                {final_token_details.symbol}
              </div>
              <img src={final_token_details.logo} alt="" className={vaultmodal_module_css_1.default.vaultRewardImg}/>
              <div className={vaultmodal_module_css_1.default.vaultDetailDepositTitle}>
                Your Deposits
              </div>
              <div className={vaultmodal_module_css_1.default.vaultDetailDepositContent}>
                {userShares + " " + main_token_details.symbol}
              </div>
              <div className={vaultmodal_module_css_1.default.vaultDetailSeperator}></div>
              <div className={vaultmodal_module_css_1.default.vaultDetailSeperator2}></div>
            </div>
            <div className={vaultmodal_module_css_1.default.vaultRewardsSection}>
              <div className={vaultmodal_module_css_1.default.vaultDetailTitle}>Your Earnings</div>
              <div className={vaultmodal_module_css_1.default.vaultDetailContent}>
                1,402 {final_token_details.symbol}
              </div>
            </div>
            <div className={vaultmodal_module_css_1.default.vaultOperationsSection}>
              <div className={vaultmodal_module_css_1.default.operationsHeader}>
                <button className={operationsStatus == "deposit"
                    ? vaultmodal_module_css_1.default.operationsSwitchBtnOff
                    : vaultmodal_module_css_1.default.operationsSwitchBtnOn} style={{ left: "230px", top: "14px" }} onClick={() => setOperationsStatus("withdraw")}>
                  Withdraw
                </button>
                <button className={operationsStatus == "withdraw"
                    ? vaultmodal_module_css_1.default.operationsSwitchBtnOff
                    : vaultmodal_module_css_1.default.operationsSwitchBtnOn} style={{ left: "10px", top: "14px" }} onClick={() => setOperationsStatus("deposit")}>
                  Deposit
                </button>
                <framer_motion_1.motion.div layout transition={{ duration: 0.3 }} className={vaultmodal_module_css_1.default.operationsSwitchOnLine} style={operationsStatus == "deposit" ? null : { left: "175px" }}></framer_motion_1.motion.div>
                <div className={vaultmodal_module_css_1.default.operationsTitle} style={{ top: "49px", left: "225px" }} onClick={() => setOperationInput(userDepositTokenBalance)}>
                  Balance:
                  {" " +
                    (operationsStatus == "deposit"
                        ? userDepositTokenBalance
                        : userShares)}
                </div>
                <div className={vaultmodal_module_css_1.default.operationsTitle}>
                  {operationsStatus == "deposit"
                    ? "Deposit Amount"
                    : "Withdraw Amount"}
                </div>

                <button className={vaultmodal_module_css_1.default.operationsMaxBtn} onClick={() => setOperationInput(userDepositTokenBalance)}>
                  Max
                </button>
                <img src={main_token_details.logo} alt="" className={vaultmodal_module_css_1.default.operationsInputImg}/>
                <div className={vaultmodal_module_css_1.default.operationsInputToken}>
                  {main_token_details.symbol}
                </div>
                <input type="number" className={vaultmodal_module_css_1.default.vaultOperationsInput} placeholder="0.00" onChange={(event) => setOperationInput(event.target.value)} value={operationInput}/>
              </div>
              <framer_motion_1.motion.button layout className={!isHoveringExecutionBtn
                    ? vaultmodal_module_css_1.default.vaultOperationsExecuteBtn
                    : vaultmodal_module_css_1.default.vaultOperationsExecuteBtnHover} style={{ zIndex: "99999999999" }} whileHover={{
                    background: "linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%)",
                    border: "0px solid transparent",
                    color: "black",
                }} onClick={() => operationInput > 0
                    ? handleOperation(operationInput, operationsStatus)
                    : alert("Please enter a valid amount")}>
                {operationsStatus == "deposit"
                    ? "Confirm Deposit"
                    : "Confirm Withdrawal"}
              </framer_motion_1.motion.button>
            </div>
            <div className={vaultmodal_module_css_1.default.vaultMiddleSection}>
              <div className={vaultmodal_module_css_1.default.vaultExtraDetailsTitleText}>
                Extra Details
              </div>
              <div className={vaultmodal_module_css_1.default.vaultExtraSection}>
                <div className={vaultmodal_module_css_1.default.vaultDetailTitle}>Daily Gas In</div>
                <div className={vaultmodal_module_css_1.default.vaultDetailContent} style={{ color: "#669F2A" }}>
                  +$10
                </div>
                <div className={vaultmodal_module_css_1.default.vaultDetailTitle} style={{ left: "219px", top: "-19.25px" }}>
                  Daily Gas Out
                </div>
                <div className={vaultmodal_module_css_1.default.vaultDetailContent} style={{ color: "#F04438", left: "219px", top: "-15.25px" }}>
                  -$7
                </div>
                <div className={vaultmodal_module_css_1.default.vaultDetailTitle} style={{ position: "relative", top: "10px" }}>
                  Vault Runs Every
                </div>
                <div className={vaultmodal_module_css_1.default.vaultDetailContent} style={{ top: "12px" }}>
                  {(0, utils_js_1.calculateInterval)(execution_interval)}
                </div>
              </div>
              <div className={vaultmodal_module_css_1.default.gasBalanceBox}>
                <div className={vaultmodal_module_css_1.default.vaultDetailTitle}>Gas Balance</div>
                <div className={vaultmodal_module_css_1.default.vaultDetailContent}>$10</div>
                <div className={vaultmodal_module_css_1.default.gasBalanceBtn}>Add Gas</div>
                <div className={vaultmodal_module_css_1.default.vaultDetailTitle} style={{ top: "90px" }}>
                  Gas Finishes in 10 Days
                </div>
              </div>
            </div>
            <div className={vaultmodal_module_css_1.default.deployerProfileSection}>
              <img src={props.vaultDetails.vaultMainImg} alt="" className={vaultmodal_module_css_1.default.profileImg}/>
              <div className={vaultmodal_module_css_1.default.profileName}>{userDetails.name}</div>
              <div className={vaultmodal_module_css_1.default.profileDescription}>
                {userDetails.description}
              </div>

              <div className={vaultmodal_module_css_1.default.profileSocialMediaSection}>
                <button className={vaultmodal_module_css_1.default.socialMediaBtn}>
                  <img src="twitter.svg" alt="" className={vaultmodal_module_css_1.default.socialMediaBtnImg} style={{ left: "-0.5px" }} onClick={() => window.open(userDetails.twitter, "_blank")}/>
                </button>
                <button className={vaultmodal_module_css_1.default.socialMediaBtn}>
                  <img src="discordicon.svg" alt="" className={vaultmodal_module_css_1.default.socialMediaBtnImg} style={{ left: "-1.5px", width: "15px", height: "13px" }}/>
                </button>
                <button className={vaultmodal_module_css_1.default.socialMediaBtn}>
                  <img src="shareicon.svg" alt="" className={vaultmodal_module_css_1.default.socialMediaBtnImg} style={{ left: "-1.5px" }}/>
                </button>
              </div>
            </div>
            <div className={vaultmodal_module_css_1.default.hiddenStrategyContainer}>
              {modalExpanded == "undefined" ? (<div className={vaultmodal_module_css_1.default.strategyBlur}></div>) : null}
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

              <framer_motion_1.motion.div layout className={vaultmodal_module_css_1.default.viewDetailsExpanderContainer} onClick={() => {
                    modalExpanded === "undefined"
                        ? setModalExpanded(`${950 + stateSteps.length * 80}`)
                        : setModalExpanded("undefined");
                }} style={modalExpanded !== "undefined"
                    ? { top: "580px" }
                    : { top: "763px" }}>
                <framer_motion_1.motion.div className={vaultmodal_module_css_1.default.viewDetailsText}>
                  {modalExpanded !== "undefined"
                    ? "Hide Strategy"
                    : "View Strategy"}
                </framer_motion_1.motion.div>
                <framer_motion_1.motion.img src="arrowdown.svg" alt="" className={vaultmodal_module_css_1.default.viewDetailsArrowDown} style={modalExpanded !== "undefined"
                    ? { transform: "rotate(270deg)" }
                    : null}/>
              </framer_motion_1.motion.div>
            </div>
          </framer_motion_1.motion.div>
          <div className={vaultmodal_module_css_1.default.wrapperAddon} style={modalExpanded !== "undefined"
                    ? { marginTop: `${parseInt(modalExpanded) + 21}px` }
                    : { marginTop: "871px" }}></div>
        </div>);
        }
        else {
            return (<div className={vaultmodal_module_css_1.default.wrapper} onClick={() => props.modalHandler(undefined)}>
          <framer_motion_1.motion.div className={vaultmodal_module_css_1.default.modal_content} style={modalExpanded == "undefined"
                    ? { height: "850px" }
                    : { height: `${modalExpanded}px` }} onClick={(event) => {
                    event.stopPropagation();
                }}>
            <LoadingScreen_1.LoadingScreen />
          </framer_motion_1.motion.div>
        </div>);
        }
    }
    else {
        return (<div className={vaultmodal_module_css_1.default.wrapper} onClick={() => props.modalHandler(undefined)}>
        <framer_motion_1.motion.div className={vaultmodal_module_css_1.default.modal_content} style={modalExpanded == "undefined"
                ? { height: "850px" }
                : { height: `${modalExpanded}px` }} onClick={(event) => {
                event.stopPropagation();
            }}>
          <LoadingScreen_1.LoadingScreen />
        </framer_motion_1.motion.div>
      </div>);
    }
};
exports.VaultModal = VaultModal;
//# sourceMappingURL=vaultModal.js.map