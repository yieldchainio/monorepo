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
exports.AddLiquidityConfig = exports.MediumConfig = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("../../Contexts/DatabaseContext");
const MotionVariants_1 = require("../../MotionVariants");
const HoverDetails_1 = require("../../HoverDetails");
const Enums_1 = require("../Enums");
const ProtocolDropdown_1 = require("./ProtocolDropdown");
const utils_js_1 = require("../../utils/utils.js");
const editDistribution_1 = require("../../editDistribution");
const Enums_2 = require("../Enums");
const ethers_1 = require("ethers");
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const MediumConfig = (props, ref) => {
    /**
     * The Identifier Of The Current Action ("Add Liquidity")
     */
    let AddLiquidityIdentifier = 3;
    /**
     * @Contexts
     */
    const { fullProtocolsList, fullTokensList, fullActionsList, fullAddressesList, protocolsAddressesList, fullFunctionsList, actionsFunctions, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { actionableTokens, setActionableTokens, quickAddActions, setQuickAddActions, strategySteps, setStrategySteps, setShowTokenModal, showTokenModal, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    /**
     * @States
     */
    const { style, stepId, stepAssemblyHandler, setNodeProcessStep } = props;
    // Keeps track of the protocol dropdown, true when it should be opened,
    // False when it should be closed
    const [isProtocolDropdownOpen, setIsProtocolDropdownOpen] = (0, react_1.useState)(false);
    // Keeps track of the pool dropdown, true when it should be opened,
    // False when it should be closed
    const [isTokenSwapModalOpen, setIsTokenSwapModalOpen] = (0, react_1.useState)(false);
    // Keeps Track Of The Current Chosen Protocol, To Display It Accordingl
    // In THe Dropdown Box, And Also Set The Pools Options
    const [chosenProtocol, setChosenProtocol] = (0, react_1.useState)(null);
    // Keeps Track Of the Current Percentage Allocated To The Step
    const [chosePercentage, setChosePercentage] = (0, react_1.useState)(
    // strategySteps[
    //   strategySteps.findIndex((_step: any) => _step.step_identifier == stepId)
    // ].percentage
    50);
    // Opens The Hover Details Popup
    const [openHoverDetails, setOpenHoverDetails] = (0, react_1.useState)(false);
    // Opens And Closes The Percentage Modal
    const [openPercentageModal, setOpenPercentageModal] = (0, react_1.useState)(false);
    // Keeps track of the selected tokens
    const [chosenTokenOne, setChosenTokenOne] = (0, react_1.useState)(null);
    const [chosenTokenTwo, setChosenTokenTwo] = (0, react_1.useState)(null);
    // Keeps track of the (optional) custom arguments
    const [customArguments, setCustomArguments] = (0, react_1.useState)([]);
    // Keeping track of whether custom arguments are required
    const [customArgumentsRequired, setCustomArgumentsRequired] = (0, react_1.useState)(false);
    // Refs for different objects
    const protocolRef = (0, react_1.useRef)(null);
    const tokenOneRef = (0, react_1.useRef)(null);
    const tokenTwoRef = (0, react_1.useRef)(null);
    /**
     * @Handlers
     */
    const ownRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        if (ownRef.current) {
            let tStepsArr = [...strategySteps];
            let index = tStepsArr.findIndex((step) => {
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
    const handleChosenPercentage = (percentage) => {
        setChosePercentage(percentage);
        setOpenPercentageModal(!openPercentageModal);
    };
    const protocolChoiceHandler = (protocol) => {
        setChosenProtocol(protocol);
        setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
    };
    const handleCancelClick = () => {
        let tStepsArr = [...strategySteps];
        let _stepDetails = tStepsArr.find((step_) => step_.step_identifier == stepId);
        let index = tStepsArr.findIndex((_step) => {
            return _step.step_identifier === _stepDetails.step_identifier;
        });
        let newObj = tStepsArr[index];
        newObj.type = Enums_2.NodeStepEnum.CHOOSE_ACTION;
        tStepsArr[index] = newObj;
        // setStrategySteps(tStepsArr);
        setNodeProcessStep(Enums_2.NodeStepEnum.CHOOSE_ACTION);
    };
    const handleTokenChoice = (token, target) => {
        if (target === "tokenOne") {
            setChosenTokenOne(token);
        }
        else if (target === "tokenTwo") {
            setChosenTokenTwo(token);
        }
        else {
        }
        setShowTokenModal(false);
    };
    const handleDropDownClick = (target) => {
        if (target == "protocol") {
            if (isTokenSwapModalOpen) {
                setShowTokenModal(!isTokenSwapModalOpen);
            }
            setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
        }
        else if (target == "pool") {
            if (isProtocolDropdownOpen) {
                setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
            }
            setShowTokenModal(!isTokenSwapModalOpen);
        }
    };
    const handleTokenOpenClick = (target, ref) => {
        if (chosenProtocol) {
            setShowTokenModal(target);
        }
        else {
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
        let addLiqAddress = fullAddressesList.find((address) => address.functions.includes(functionId));
        // Regex protocol name to remove all spacing
        let clientName = chosenProtocol.name.replace(/\s/g, "").toLowerCase();
        let step = {
            type: "Add Liquidity",
            action_identifier: AddLiquidityIdentifier,
            divisor: await (0, utils_js_1.calcDivisor)(chosePercentage),
            percentage: chosePercentage,
            function_identifiers: [functionId],
            address_identifiers: [addLiqAddress.address_identifier],
            protocol_details: chosenProtocol,
            additional_args: [
                `"${clientName}"`,
                [ethers_1.ethers.utils.getAddress(chosenTokenOne.address)],
                [ethers_1.ethers.utils.getAddress(chosenTokenTwo.address)],
                [`${chosenTokenOne.symbol.toUpperCase()}_BALANCE / activeDivisor`],
                [`${chosenTokenTwo.symbol.toUpperCase()}_BALANCE / activeDivisor`],
                40,
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
                        name: `${chosenTokenOne.symbol}-${chosenTokenTwo.symbol} LP-Token ${lodash_1.default.camelCase(chosenProtocol.name)} `,
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
                name: `${chosenTokenOne.symbol}-${chosenTokenTwo.symbol} LP-Token ${lodash_1.default.camelCase(chosenProtocol.name)} `,
                logo: chosenProtocol.logo,
                symbol: `${chosenTokenOne.symbol}-${chosenTokenTwo.symbol}-LP`,
            },
        ];
        setActionableTokens([...actionableTokens.concat(tempActionableTokens)]);
        stepAssemblyHandler(step);
    };
    const [protocolsList, setProtocolsList] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        (async () => {
            let addLiqProtocolIDs = await (await axios_1.default.get(`https://api.yieldchain.io/actions/${"addliquidity"}`)).data.actionTable.map((t) => t.function_identifier);
            let protocols = fullProtocolsList.filter((protocol) => addLiqProtocolIDs.includes(protocol.protocol_identifier));
            setProtocolsList(protocols);
        })();
        return () => {
            setProtocolsList([]);
        };
    }, [fullProtocolsList]);
    /**
     * @Component
     */
    return (<div>
      {/* {isTokenSwapModalOpen ? (
          <TokenSwapModal
            choiceHandler={handleTokenChoice}
            target={isTokenSwapModalOpen}
            handleModal={setIsTokenSwapModalOpen}
          />
        ) : null} */}
      {openHoverDetails ? (<HoverDetails_1.HoverDetails top={openHoverDetails.top.toString()} left={openHoverDetails.left} text={openHoverDetails.text}/>) : null}
      {openPercentageModal ? (<editDistribution_1.EditPercentageModal setPercentage={handleChosenPercentage} locationDetails={openPercentageModal}/>) : null}
      <div className={strategyBuilder_module_css_1.default.mediumConfigContainer} style={style} ref={ownRef}>
        {isProtocolDropdownOpen && (<ProtocolDropdown_1.ProtocolDropDown top={`185`} left={`24`} choiceHandler={protocolChoiceHandler} protocolsList={protocolsList}/>)}

        <div className={strategyBuilder_module_css_1.default.mediumConfigTitleContainer}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOff}>Action:</div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOn}>Add Liquidity</div>
          <img src="/mediumConfigTitleArrow.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigTitleArrow}/>
          <div className={strategyBuilder_module_css_1.default.mediumConfigPercentageContainer} style={{ marginLeft: "53px" }}>
            <div className={strategyBuilder_module_css_1.default.mediumConfigPercentageText}>
              {chosePercentage}%
            </div>
            <img src="/mediumCompleteStepEditIcon.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigPercentageIcon} onClick={(e) => setOpenPercentageModal({
            mouse_location: {
                width: e.clientX,
                height: e.clientY + window.scrollY,
            },
        })}/>
          </div>
        </div>
        <div className={strategyBuilder_module_css_1.default.addLiquidityMidFlexBox}>
          <div className={strategyBuilder_module_css_1.default.addLiquidityProtocolFlexContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownTitle}>Protocol</div>
            <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownContainer} onClick={(e) => handleDropDownClick("protocol")} ref={protocolRef}>
              {chosenProtocol ? (<img src={chosenProtocol.logo} alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownIcon}/>) : null}
              <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownText} style={chosenProtocol ? {} : { color: "#626262" }}>
                {chosenProtocol ? chosenProtocol.name : "Choose Protocol"}
              </div>

              <img src="/mediumConfigTitleArrow.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownArrow}/>
            </div>
          </div>
          <div className={strategyBuilder_module_css_1.default.addLiquidityPairsFlexContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownTitle}>
              Liquidity Pair
            </div>

            <div className={strategyBuilder_module_css_1.default.addLiquidityPairContainersFlexRow}>
              {/** Token #1 */}
              <div className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenDropdownContainer} onClick={() => handleTokenOpenClick({ target: "tokenOne", choiceHandler: handleTokenChoice }, tokenOneRef)} ref={tokenOneRef}>
                {chosenTokenOne ? (<img src={chosenTokenOne.logo} alt="" className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenIcon}/>) : null}
                {chosenTokenOne ? (<div className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenDropdownText}>
                    {chosenTokenOne.symbol}
                  </div>) : (<div className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenDropdownText} style={{ color: "#626262", marginLeft: "6px" }}>
                    Select Token.......
                  </div>)}
                {chosenProtocol ? (<img src="/liquiditydropdownarrow.svg" alt="" className="" style={{
                position: "relative",
                left: `${chosenTokenOne ? 0 : -10}px`,
                cursor: "pointer",
            }}/>) : null}
              </div>
              <img src="/liquidityplusicon.svg" alt="" className=""/>

              {/** Token #2 */}
              <div className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenDropdownContainer} onClick={() => handleTokenOpenClick({
            target: "tokenTwo",
            choiceHandler: handleTokenChoice,
        }, tokenTwoRef)} ref={tokenTwoRef}>
                {chosenTokenTwo ? (<img src={chosenTokenTwo.logo} alt="" className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenIcon}/>) : null}
                {chosenTokenTwo ? (<div className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenDropdownText}>
                    {chosenTokenTwo.symbol}
                  </div>) : (<div className={strategyBuilder_module_css_1.default.addLiquidityMediumConfigTokenDropdownText} style={{ color: "#626262", marginLeft: "6px" }}>
                    Select Token.......
                  </div>)}
                {chosenProtocol ? (<img src="/liquiditydropdownarrow.svg" alt="" className="" style={{
                position: "relative",
                left: `${chosenTokenOne ? 0 : -10}px`,
                cursor: "pointer",
            }}/>) : null}
              </div>
            </div>
          </div>
        </div>
        <div></div>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigCancelAction} onClick={() => handleCancelClick()}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigCancelActionText}>
            Cancel Action
          </div>
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.button className={strategyBuilder_module_css_1.default.mediumConfigDoneButton} variants={MotionVariants_1.ButtonVariants} initial="normal" whileHover="hover" onClick={chosenProtocol && chosenTokenOne
            ? () => assembleStep()
            : (e) => setOpenHoverDetails({
                top: e.clientY + window.scrollY,
                left: e.clientX,
                text: "You Must Choose A Pool Before Adding This Step",
            })}>
          Add +
        </framer_motion_1.motion.button>
      </div>
    </div>);
};
exports.MediumConfig = MediumConfig;
const AddLiquidityConfig = (props) => {
    const { size, style, stepId } = props;
    return (<div>
      {size === Enums_1.SizingEnum.MEDIUM ? (<exports.MediumConfig style={style} stepAssemblyHandler={props.stepAssemblyHandler} stepId={stepId} setNodeProcessStep={props.setNodeProcessStep}/>) : (<h1 style={{ color: "white" }}>LOOOOOOOSER </h1>)}
    </div>);
};
exports.AddLiquidityConfig = AddLiquidityConfig;
//# sourceMappingURL=AddLiquidity.js.map