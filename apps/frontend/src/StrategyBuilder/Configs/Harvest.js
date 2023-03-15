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
exports.HarvestConfig = exports.MediumConfig = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("../../Contexts/DatabaseContext");
const MotionVariants_1 = require("../../MotionVariants");
const HoverDetails_1 = require("../../HoverDetails");
const Enums_1 = require("../Enums");
const utils_js_1 = require("../../utils/utils.js");
const editDistribution_1 = require("../../editDistribution");
const Enums_2 = require("../Enums");
const CustomArgs_1 = require("./CustomArgs");
const MediumChoiceRow = (props) => {
    const { originStep, earnAction, clickHandler, currentlyClicked, index } = props;
    return (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.harvestRowContainer} style={currentlyClicked
            ? {
                background: "linear-gradient(rgb(45, 45, 45), rgb(45, 45, 45)) padding-box, linear-gradient(90deg, rgb(0, 178, 236) 0%, rgb(217, 202, 15) 100%) border-box",
                borderTop: "1px solid transparent",
                borderBottom: "1px solid transparent",
            }
            : {}} layout onClick={() => clickHandler(earnAction, index)}>
      <div className={strategyBuilder_module_css_1.default.harvestRowOriginActionFlex}>
        <div className={strategyBuilder_module_css_1.default.harvestRowOriginActionText}>Stake</div>
        <div className={strategyBuilder_module_css_1.default.harvestRowOriginActionTokensContainer}>
          {originStep.outflows.map((outflow) => {
            return (<img src={outflow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.harvestRowOriginActionTokenIcon}/>);
        })}
        </div>
      </div>
      <img src="/harvestarrow.svg" alt="" className={strategyBuilder_module_css_1.default.harvestRowArrowIcon}/>
      <div className={strategyBuilder_module_css_1.default.harvestRowEarnGradientText}>Earn</div>
      <div className={strategyBuilder_module_css_1.default.harvestRowHarvestActionFlex}>
        <div className={strategyBuilder_module_css_1.default.harvestRowHarvestActionTokensContainer}>
          {earnAction.inflows.map((inflow, index) => {
            if (index < 2) {
                return (<img src={inflow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.harvestRowHarvestActionTokenIcon} key={index}/>);
            }
            else {
                return null;
            }
        })}
        </div>
        <div className={strategyBuilder_module_css_1.default.harvestRowHarvestActionTokensText}>
          {earnAction.inflows.length > 2
            ? `+${earnAction.inflows.length - 2}`
            : ""}
        </div>
      </div>
      <div className={strategyBuilder_module_css_1.default.harvestRowSelectionCircle} style={currentlyClicked
            ? {
                borderRadius: "50%",
                background: "linear-gradient(#68DAFF, #FFF576) padding-box, linear-gradient(90deg, #00B2EC 0%, #D9CA0F 100%) border-box",
                border: "1.2px solid transparent",
            }
            : {}} onClick={() => clickHandler(earnAction, index)}>
        {currentlyClicked && (<div className={strategyBuilder_module_css_1.default.harvestRowSelectionInnerCircle} onClick={() => clickHandler(earnAction, index)}></div>)}
      </div>
    </framer_motion_1.motion.div>);
};
const MediumConfig = (props, ref) => {
    /**
     * The Identifier Of The Current Action ("Stake")
     */
    let HarvestIdentifier = 4;
    /**
     * @Contexts
     */
    const { fullProtocolsList, fullTokensList, fullActionsList, fullAddressesList, protocolsAddressesList, fullFunctionsList, actionsFunctions, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
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
    // Keeps track of current harvest-able positions
    const [harvestablePositions, setHarvestablePositions] = (0, react_1.useState)([]);
    // Keeps Track Of the Current Percentage Allocated To The Step
    const [chosePercentage, setChosePercentage] = (0, react_1.useState)(strategySteps[strategySteps.findIndex((_step) => _step.step_identifier == stepId)].percentage);
    // Opens The Hover Details Popup
    const [openHoverDetails, setOpenHoverDetails] = (0, react_1.useState)(false);
    // Opens And Closes The Percentage Modal
    const [openPercentageModal, setOpenPercentageModal] = (0, react_1.useState)(false);
    // Keeps track of the (optional) custom arguments
    const [customArguments, setCustomArguments] = (0, react_1.useState)(null);
    // Current chosen harvest action
    const [chosenHarvestPosition, setChosenHarvestPosition] = (0, react_1.useState)(null);
    const [availableHarvests, setAvailableHarvests] = (0, react_1.useState)([]);
    // Keeping track of whether custom arguments are required
    const [customArgumentsRequired, setCustomArgumentsRequired] = (0, react_1.useState)(false);
    const [customArgumentsComplete, setCustomArgumentsComplete] = (0, react_1.useState)(false);
    const handleCustomArgsComplete = (argsArr) => {
        setCustomArguments(argsArr);
        setCustomArgumentsComplete(true);
    };
    const harvestUseEffect = async () => {
        let doesHaveHarvest = [...quickAddActions];
        console.log("Quick add actions ser", quickAddActions);
        if (doesHaveHarvest.length > 0) {
            let promises = await doesHaveHarvest.asyncFilter(async (func) => {
                let action = await (0, utils_js_1.getFunctionAction)(func.quickAddAction.function_identifier);
                return (action === null || action === void 0 ? void 0 : action.action_identifier) === HarvestIdentifier;
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
    (0, react_1.useEffect)(() => {
        harvestUseEffect();
    }, [strategySteps, quickAddActions]);
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
    (0, react_1.useEffect)(() => {
        if (chosenHarvestPosition) {
            let args = chosenHarvestPosition.function.arguments;
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
    }, [chosenHarvestPosition]);
    const handleHarvestChoice = (position, index) => {
        console.log("POsiton Chosen ser", position, index);
        setChosenHarvestPosition({ function: position, index: index });
    };
    const handleChosenPercentage = (percentage) => {
        setChosePercentage(percentage);
        setOpenPercentageModal(!openPercentageModal);
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
    /**
     * @AssembleStep - Assembles The Step Object Using The Configured Settings
     */
    const assembleStep = async () => {
        let step = {
            type: "Harvest",
            action_identifier: HarvestIdentifier,
            divisor: await (0, utils_js_1.calcDivisor)(chosePercentage),
            percentage: chosePercentage,
            function_identifiers: [
                chosenHarvestPosition.function.function_identifier,
            ],
            address_identifiers: [
                (await (0, utils_js_1.getFunctionAddress)(chosenHarvestPosition.function.function_identifier)).address_identifier,
            ],
            protocol_details: await (0, utils_js_1.getProtocolByFunction)(chosenHarvestPosition.function.function_identifier),
            additional_args: Array.isArray(customArguments) ? customArguments : [],
            flow_identifiers: [
                chosenHarvestPosition.function.inflows.map((inflow) => inflow.flow_identifier),
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
        tempQuickAddActions.splice(quickAddActions.findIndex((qAction) => qAction.quickAddAction.function_identifier ==
            chosenHarvestPosition.function.function_identifier), 1);
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
    return (<div>
      {openHoverDetails ? (<HoverDetails_1.HoverDetails top={openHoverDetails.top.toString()} left={openHoverDetails.left} text={openHoverDetails.text}/>) : null}
      {openPercentageModal ? (<editDistribution_1.EditPercentageModal setPercentage={handleChosenPercentage} locationDetails={openPercentageModal}/>) : null}
      {customArgumentsRequired && !customArgumentsComplete ? (<CustomArgs_1.CustomArgs style={{
                top: style.top,
                left: `${parseInt(style.left.split("px")[0]) +
                    (ownRef.current ? ownRef.current.offsetWidth : 0) +
                    50}px`,
                position: "absolute",
            }} customArgs={customArgumentsRequired} handler={handleCustomArgsComplete}/>) : null}
      <div className={strategyBuilder_module_css_1.default.harvestMediumConfigContainer} style={style} ref={ownRef}>
        <div className={strategyBuilder_module_css_1.default.mediumConfigTitleContainer} style={{ marginBottom: "24px" }}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOff}>Action:</div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOn}>Harvest</div>
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
        <div className={strategyBuilder_module_css_1.default.harvestAbleTitle}>Harvest-able Positions:</div>
        <div className={strategyBuilder_module_css_1.default.harvestChoiceGrid}>
          {availableHarvests.map((harvest, index) => (<div>
              <MediumChoiceRow currentlyClicked={chosenHarvestPosition
                ? chosenHarvestPosition.index === index
                : false} clickHandler={handleHarvestChoice} index={index} earnAction={harvest.quickAddAction} originStep={harvest.originStep} fullharvest={harvest} key={index}/>
            </div>))}
        </div>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigCancelAction} onClick={() => handleCancelClick()}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigCancelActionText}>
            Cancel Action
          </div>
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.button className={strategyBuilder_module_css_1.default.mediumConfigDoneButton} variants={MotionVariants_1.ButtonVariants} initial="normal" whileHover="hover" onClick={chosenHarvestPosition
            ? () => assembleStep()
            : (e) => setOpenHoverDetails({
                top: e.clientY + window.scrollY,
                left: e.clientX,
                text: "You Must Choose A Pool Before Adding This Step",
            })} style={{
            position: "absolute",
            top: "calc(100% - 64px)",
            left: "179px",
        }}>
          Add +
        </framer_motion_1.motion.button>
      </div>
    </div>);
};
exports.MediumConfig = MediumConfig;
const HarvestConfig = (props) => {
    const { size, style, stepId } = props;
    return (<div>
      {size === Enums_1.SizingEnum.MEDIUM ? (<exports.MediumConfig style={style} stepAssemblyHandler={props.stepAssemblyHandler} stepId={stepId} setNodeProcessStep={props.setNodeProcessStep}/>) : (<h1 style={{ color: "white" }}>LOOOOOOOSER </h1>)}
    </div>);
};
exports.HarvestConfig = HarvestConfig;
//# sourceMappingURL=Harvest.js.map