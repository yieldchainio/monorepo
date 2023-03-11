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
exports.StakeConfig = exports.MediumConfig = void 0;
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
const CustomArgs_1 = require("./CustomArgs");
const lodash_1 = __importDefault(require("lodash"));
const MediumStakePoolDropdownRow = (props) => {
    const HarvestIdentifier = 4;
    const { actionsFunctions } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { poolDetails } = props;
    const { outflows, inflows, unlocked_functions } = poolDetails;
    const canHarvest = actionsFunctions
        .get(HarvestIdentifier)
        .find((harvestFunction) => {
        let harvestFuncIdentifier = harvestFunction.function_identifier;
        for (const unlockedFunc of unlocked_functions) {
            if (unlockedFunc.function_identifier == harvestFuncIdentifier) {
                return true;
            }
        }
    });
    const earnTokens = canHarvest
        ? unlocked_functions.find((unlockedFunction) => unlockedFunction.function_identifier == canHarvest.function_identifier)
        : unlocked_functions[0];
    const newPoolDetails = {
        ...poolDetails,
        earnAction: earnTokens,
    };
    return (<div>
      <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRow} whileHover={{
            backgroundColor: "rgba(15, 16, 17, 1)",
            transition: { duration: 0.1 },
        }} onClick={() => props.choiceHandler(newPoolDetails)}>
        <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowTextOff}>Stake</div>
        <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowIconsContainer}>
          {outflows.map((outflow) => (<img src={outflow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowLargeIcon} key={`outflow_${outflow.flow_identifier}`}/>))}
        </div>
        <img src="/mediumConfigStakePoolRowArrow.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowArrowIcon}/>
        <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowTextOn}>Earn</div>
        <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowIconsContainer} style={{ marginLeft: "9.6px" }}>
          {earnTokens.inflows
            ? earnTokens.inflows.map((rewardToken, index) => (<img src={rewardToken.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowSmallIcon} key={index}/>))
            : null}
        </div>
        <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolRowTextOff} style={{
            justifySelf: "flex-end",
            marginLeft: "16px",
            fontSize: "12px",
        }}>
          178% APY
        </div>
      </framer_motion_1.motion.div>
    </div>);
};
const MediumStakePoolDropdown = (props) => {
    const { top, left, poolsList } = props;
    const { actionableTokens } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    let filteredPoolsList = poolsList.filter((pool) => {
        let poolOutflows = lodash_1.default.clone(pool.outflows);
        for (const token of actionableTokens) {
            console.log("Doing token iteration", token);
            let indexOfTokenInsideOutflows = poolOutflows.findIndex((flow) => flow.token_details.token_identifier == token.token_identifier);
            if (indexOfTokenInsideOutflows !== -1) {
                poolOutflows.splice(indexOfTokenInsideOutflows, 1);
            }
        }
        return poolOutflows.length == 0 ? true : false;
    });
    return (<div>
      <div className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenu} style={{ top: `${top}px`, left: `${left}px` }}>
        <div>
          <input className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenuSearchBar} placeholder="Search For A Pool"/>
          <img src="/dropdownsearchicon.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenuSearchBarIcon} style={{ marginLeft: "4px" }}/>
        </div>

        <div className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenuRowsGrid}>
          {!filteredPoolsList.length ? (<div className={strategyBuilder_module_css_1.default.cantFindOptionText} style={{ marginTop: "16px", marginLeft: "40px" }}>{`You don't have any tokens that are 
            available to stake on this protocol`}</div>) : (filteredPoolsList.map((pool, index) => (<MediumStakePoolDropdownRow poolDetails={pool} choiceHandler={props.choiceHandler} key={index}/>)))}
        </div>
      </div>
    </div>);
};
const MediumConfig = (props, ref) => {
    /**
     * The Identifier Of The Current Action ("Stake")
     */
    let StakeIdentifier = 1;
    /**
     * @Contexts
     */
    const { fullProtocolsList, fullTokensList, fullActionsList, fullAddressesList, protocolsAddressesList, fullFunctionsList, actionsFunctions, fullParametersList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { actionableTokens, setActionableTokens, quickAddActions, setQuickAddActions, strategySteps, setStrategySteps, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
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
    const [isProtocolDropdownOpen, setIsProtocolDropdownOpen] = (0, react_1.useState)(false);
    // Keeps track of the pool dropdown, true when it should be opened,
    // False when it should be closed
    const [isPoolDropdownOpen, setIsPoolDropdownOpen] = (0, react_1.useState)(false);
    // Keeps Track Of The Current Chosen Protocol, To Display It Accordingl
    // In THe Dropdown Box, And Also Set The Pools Options
    const [chosenProtocol, setChosenProtocol] = (0, react_1.useState)(null);
    // Keeps Track Of The Last Chosen Protocol, To Display Details Accordingly
    const [lastChosenProtocol, setLastChosenProtocol] = (0, react_1.useState)(null);
    // Keeps Track Of The Current Chosen Pool, To Display It Accordingly &&
    // To Be Used Within the Assembled Step (IT includes all the needed details)
    const [chosenPool, setChosenPool] = (0, react_1.useState)(null);
    // Keeps Track Of the Current Percentage Allocated To The Step
    const [chosePercentage, setChosePercentage] = (0, react_1.useState)(strategySteps[strategySteps.findIndex((_step) => _step.step_identifier == stepId)].percentage);
    // Opens The Hover Details Popup
    const [openHoverDetails, setOpenHoverDetails] = (0, react_1.useState)(false);
    // Opens And Closes The Percentage Modal
    const [openPercentageModal, setOpenPercentageModal] = (0, react_1.useState)(false);
    // Keeps track of the (optional) custom arguments
    const [customArguments, setCustomArguments] = (0, react_1.useState)(null);
    // Keeping track of whether custom arguments are required
    const [customArgumentsRequired, setCustomArgumentsRequired] = (0, react_1.useState)(false);
    const [customArgumentsComplete, setCustomArgumentsComplete] = (0, react_1.useState)(false);
    const handleCustomArgsComplete = (argsArr) => {
        setCustomArguments(argsArr);
        setCustomArgumentsComplete(true);
    };
    (0, react_1.useEffect)(() => {
        if (chosenPool) {
            let args = chosenPool.arguments;
            if (args.find((arg) => arg.value.includes("abi.decode(current_custom_arguments"))) {
                setCustomArgumentsRequired(args
                    .filter((arg) => arg.value.includes("abi.decode(current_custom_arguments"))
                    .map((arg, index) => {
                    let newArg = { ...arg };
                    newArg.index = index;
                    return newArg;
                }));
            }
            else {
                setCustomArgumentsRequired(false);
            }
        }
    }, [chosenPool]);
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
        setLastChosenProtocol(chosenProtocol);
        setChosenProtocol(protocol);
        setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
        setChosenPool(null);
    };
    const poolChoiceHandler = (pool) => {
        setChosenPool(pool);
        setIsPoolDropdownOpen(!isPoolDropdownOpen);
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
    const handleDropDownClick = (target) => {
        if (target == "protocol") {
            if (isPoolDropdownOpen) {
                setIsPoolDropdownOpen(!isPoolDropdownOpen);
            }
            setIsProtocolDropdownOpen(!isProtocolDropdownOpen);
        }
        else if (target == "pool") {
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
        let stepIndex = strategySteps.findIndex((step) => {
            return step.step_identifier === stepId;
        });
        let step = {
            type: "Stake",
            action_identifier: StakeIdentifier,
            divisor: await (0, utils_js_1.calcDivisor)(chosePercentage),
            percentage: chosePercentage,
            function_identifiers: [chosenPool.function_identifier],
            address_identifiers: [
                await fullAddressesList.find((address) => address.functions.includes(chosenPool.function_identifier)).address_identifier,
            ],
            protocol_details: chosenProtocol,
            additional_args: Array.isArray(customArguments) ? customArguments : [],
            flow_identifiers: [
                ...chosenPool.outflows
                    .concat(chosenPool.inflows)
                    .map((flow) => flow.flow_identifier),
            ],
            step_identifier: stepId,
            parent_step_identifier: strategySteps[stepIndex].parent_step_identifier,
            outflows: chosenPool.outflows,
            inflows: chosenPool.inflows,
            children: [],
        };
        let tempActionableTokens = await chosenPool.inflows.map((flow) => flow.token_details);
        setActionableTokens([...actionableTokens.concat(tempActionableTokens)]);
        let tempQuickAddActions = { originStep: step, quickAddAction: chosenPool.earnAction };
        setQuickAddActions([...quickAddActions.concat(tempQuickAddActions)]);
        stepAssemblyHandler(step);
    };
    /**
     * @Component
     */
    return (<div>
      {openHoverDetails ? (<HoverDetails_1.HoverDetails top={openHoverDetails.top} left={openHoverDetails.left} text={openHoverDetails.text}/>) : null}
      {openPercentageModal ? (<editDistribution_1.EditPercentageModal setPercentage={handleChosenPercentage} locationDetails={openPercentageModal}/>) : null}
      {customArgumentsRequired && !customArgumentsComplete ? (<CustomArgs_1.CustomArgs style={{
                top: style.top,
                left: `${parseInt(style.left.split("px")[0]) +
                    (ownRef.current ? ownRef.current.offsetWidth : 0) +
                    50}px`,
                position: "absolute",
            }} customArgs={customArgumentsRequired} handler={handleCustomArgsComplete}/>) : null}
      <div className={strategyBuilder_module_css_1.default.mediumConfigContainer} style={style} ref={ownRef}>
        {isProtocolDropdownOpen && (<ProtocolDropdown_1.ProtocolDropDown top={`185`} left={`24`} choiceHandler={protocolChoiceHandler} protocolsList={actionsFunctions.get(StakeIdentifier)
                ? actionsFunctions
                    .get(StakeIdentifier)
                    .map((actionFunction) => actionFunction.protocol)
                : null}/>)}
        {isPoolDropdownOpen && (<MediumStakePoolDropdown top={`292.5`} left={`24`} choiceHandler={poolChoiceHandler} poolsList={actionsFunctions
                .get(StakeIdentifier)
                .filter((actionFunction) => {
                return (actionFunction.protocol.protocol_identifier ==
                    chosenProtocol.protocol_identifier);
            })}/>)}
        <div className={strategyBuilder_module_css_1.default.mediumConfigTitleContainer}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOff}>Action:</div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOn}>Stake</div>
          <img src="/mediumConfigTitleArrow.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigTitleArrow}/>
          <div className={strategyBuilder_module_css_1.default.mediumConfigPercentageContainer}>
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
        <div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownTitle}>Protocol</div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownContainer} onClick={(e) => handleDropDownClick("protocol")}>
            {chosenProtocol ? (<img src={chosenProtocol.logo} alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownIcon}/>) : null}
            <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownText} style={chosenProtocol ? {} : { color: "#626262" }}>
              {chosenProtocol ? chosenProtocol.name : "Choose Protocol"}
            </div>
            <img src="/mediumConfigTitleArrow.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownArrow}/>
          </div>
        </div>
        <div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownTitle}>Staking Pool</div>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigDropdownContainer} onClick={(e) => chosenProtocol ? handleDropDownClick("pool") : null} onMouseEnter={!chosenProtocol
            ? (e) => setOpenHoverDetails({
                top: e.clientY + window.scrollY,
                left: e.clientX,
                text: "Please Choose A Protocol First",
            })
            : null} onMouseLeave={!chosenProtocol ? () => setOpenHoverDetails(false) : null}>
            {chosenPool
            ? chosenPool.outflows.map((outflow, index) => (<img src={outflow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownIcon} key={index}/>))
            : null}
            <div className={strategyBuilder_module_css_1.default.mediumConfigDropdownText} style={chosenPool ? {} : { color: "#626262" }}>
              {chosenPool
            ? chosenPool.outflows.map((outflow, index, arr) => index !== 0
                ? `, ${outflow.token_details.symbol}`
                : `${outflow.token_details.symbol}`)
            : chosenProtocol
                ? "Choose Pool"
                : "Choose Protocol"}
            </div>
            {chosenPool ? (<div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolDropdownEarnContainer}>
                <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolDropdownEarnGradientText}>
                  Earn
                </div>
                <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolDropdownEarnIconsContainer}>
                  {chosenPool.inflows
                .concat(chosenPool.earnAction.inflows)
                .map((inflow, index) => (<img src={inflow.token_details.logo} alt="" key={index} className={strategyBuilder_module_css_1.default.mediumConfigStakePoolDropdownEarnIcon}/>))}
                </div>
                <div className={strategyBuilder_module_css_1.default.mediumConfigStakePoolDropdownEarnWhiteText}>
                  {chosenPool.inflows
                .concat(chosenPool.earnAction.inflows)
                .map((inflow, index) => `$${inflow.token_details.symbol}`)}
                </div>
              </div>) : null}
            {chosenProtocol ? (<img src="/mediumConfigTitleArrow.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownArrow}/>) : null}
          </framer_motion_1.motion.div>
        </div>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigCancelAction} onClick={() => handleCancelClick()}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigCancelActionText}>
            Cancel Action
          </div>
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.button className={strategyBuilder_module_css_1.default.mediumConfigDoneButton} variants={MotionVariants_1.ButtonVariants} initial="normal" whileHover="hover" onClick={chosenProtocol && chosenPool
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
const StakeConfig = (props, ref) => {
    const { size, style, stepId } = props;
    return (<div>
      {size === Enums_1.SizingEnum.MEDIUM ? (<exports.MediumConfig style={style} stepAssemblyHandler={props.stepAssemblyHandler} stepId={stepId} ref={ref} setNodeProcessStep={props.setNodeProcessStep}/>) : (<h1 style={{ color: "white" }}>LOOOOOOOSER </h1>)}
    </div>);
};
exports.StakeConfig = StakeConfig;
//# sourceMappingURL=Stake.js.map