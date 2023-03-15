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
exports.MediumNode = exports.MediumPlaceholderNode = exports.MediumCompleteStep = exports.MediumChooseAction = exports.MediumActionButton = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("../Contexts/DatabaseContext");
const AnimationVariants_1 = require("./AnimationVariants");
const HoverDetails_1 = require("../HoverDetails");
const Enums_1 = require("./Enums");
const Stake_1 = require("./Configs/Stake");
const Swap_1 = require("./Configs/Swap");
const AddLiquidity_1 = require("./Configs/AddLiquidity");
const Harvest_1 = require("./Configs/Harvest");
const utils_1 = require("utils/utils");
const MediumActionButton = (props) => {
    const { actionDetails } = props;
    return (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumActionButton} variants={AnimationVariants_1.ChooseActionButtonVariants} whileHover="hover" whileTap="tap" onClick={() => props.handleActionChoice(actionDetails)} style={props.style ? props.style : {}} animate={props.animate ? props.animate : {}} transition={props.transition ? props.transition : {}}>
      <img src={`/${actionDetails.name.toLowerCase().split(" ").join("")}icon.svg`} alt="" className={strategyBuilder_module_css_1.default.mediumActionButtonIcon} style={props.imgStyle ? props.imgStyle : {}}/>
      <div className={strategyBuilder_module_css_1.default.mediumActionButtonText} style={props.nameStyle ? props.nameStyle : {}}>
        {actionDetails.name}
      </div>
    </framer_motion_1.motion.div>);
};
exports.MediumActionButton = MediumActionButton;
exports.MediumChooseAction = react_1.default.forwardRef((props, ref) => {
    const { fullActionsList } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { strategySteps, setStrategySteps, quickAddActions } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { actionsFunctions } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { handleActionChoice, style, stepDetails, setNodeProcessStep } = props;
    // Settings Sizing Propreties
    const ownRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        setNodeProcessStep(Enums_1.NodeStepEnum.CHOOSE_ACTION);
        if (ownRef.current) {
            let tStepsArr = [...strategySteps];
            let index = tStepsArr.findIndex((step, i, arr) => {
                return step.step_identifier === stepDetails.step_identifier;
            });
            tStepsArr[index] = {
                ...tStepsArr[index],
                width: ownRef.current.offsetWidth,
                height: ownRef.current.offsetHeight,
            };
            setStrategySteps(tStepsArr);
        }
        else {
        }
    }, []);
    const [readyToList, setReadyToList] = (0, react_1.useState)(false);
    const filterAction = async (action) => {
        let isActionHidden = action.hidden;
        let isActionInQuickAdd = !quickAddActions || !quickAddActions.length
            ? false
            : await quickAddActions.find(async (qAction) => (await (0, utils_1.getFunctionAction)(qAction.function_identifier)).action_identifier === action.action_identifier);
        let isActionUnlocked = isActionInQuickAdd
            ? true
            : actionsFunctions
                .get(action.action_identifier)
                .find((fAction) => fAction.unlocked_by == null)
                ? true
                : false;
        if (!isActionHidden && isActionUnlocked) {
            return action;
        }
        else {
            return null;
        }
    };
    const filterActions = async (actions) => {
        let filteredActions = [];
        for await (let action of actions) {
            if (await filterAction(action)) {
                filteredActions.push(action);
            }
        }
        setReadyToList(filteredActions);
    };
    (0, react_1.useEffect)(() => {
        if (actionsFunctions &&
            actionsFunctions.size > 1 &&
            actionsFunctions.size == fullActionsList.length) {
            filterActions(fullActionsList);
        }
    }, [
        actionsFunctions ? actionsFunctions.size : actionsFunctions,
        fullActionsList.length,
        fullActionsList,
    ]);
    return (<div className={strategyBuilder_module_css_1.default.mediumChooseActionContainer} style={style} ref={ownRef}>
      <div className={strategyBuilder_module_css_1.default.mediumActionTitleContainer}>
        <div className={strategyBuilder_module_css_1.default.mediumChooseActionTitle}>Select Action</div>
        <framer_motion_1.motion.img src="/mediumCloseIcon.svg" alt="" className={strategyBuilder_module_css_1.default.mediumCloseIcon} whileHover={{ scale: 0.9 }} onClick={() => console.log(quickAddActions, "quickAddActions")}/>
      </div>

      <div className={strategyBuilder_module_css_1.default.mediumActionButtonsGridContainer}>
        {readyToList
            ? readyToList
                .sort((a, b) => a.popularity - b.popularity)
                .map((action, index) => {
                if (action.hidden)
                    return null;
                return (<exports.MediumActionButton actionDetails={action} handleActionChoice={props.handleActionChoice} key={index}/>);
            })
            : null}
      </div>
    </div>);
});
exports.MediumCompleteStep = react_1.default.forwardRef((props, ref) => {
    const { stepDetails, style, setNodeProcessStep } = props;
    const { strategySteps, setStrategySteps } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const [isHoveringExpandDots, setIsHoveringExpandDots] = (0, react_1.useState)(false);
    const [doesHaveChildren, setDoesHaveChildren] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (strategySteps.find((step) => {
            return (step.parent_step_identifier === stepDetails.step_identifier &&
                step.type !== Enums_1.NodeStepEnum.CHOOSE_ACTION &&
                step.type !== Enums_1.NodeStepEnum.CONFIG_ACTION &&
                step.type !== Enums_1.NodeStepEnum.PLACEHOLDER);
        })) {
            setDoesHaveChildren(true);
        }
        else {
            setDoesHaveChildren(false);
        }
    }, [strategySteps]);
    const ownRef = (0, react_1.useRef)(null);
    const rightPlusRef = (0, react_1.useRef)(null);
    const leftPlusRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        if (ownRef.current) {
            let tStepsArr = [...strategySteps];
            let index = tStepsArr.findIndex((step) => step.step_identifier == stepDetails.step_identifier);
            tStepsArr[index] = {
                ...tStepsArr[index],
                width: ownRef.current.offsetWidth,
                height: ownRef.current.offsetHeight,
            };
            setStrategySteps(tStepsArr);
        }
    }, []);
    const addAnotherChild = (from) => {
        let tStepsArr = [...strategySteps];
        let unusedPercentage = 100 -
            tStepsArr
                .filter((_step) => _step.parent_step_identifier === stepDetails.step_identifier)
                .map((_step) => _step.percentage)
                .reduce((a, b) => a + b);
        let tChild = {
            step_identifier: tStepsArr.length,
            parent_step_identifier: stepDetails.step_identifier,
            type: Enums_1.NodeStepEnum.CHOOSE_ACTION,
            function_identifiers: [],
            percentage: unusedPercentage,
            divisor: (0, utils_1.calcDivisor)(unusedPercentage),
        };
        if (unusedPercentage <= 0) {
            props.hoverHandler({
                text: "You can't use more than 100%.",
                top: from == "left"
                    ? leftPlusRef.current.getBoundingClientRect().top -
                        5 +
                        window.scrollY
                    : rightPlusRef.current.getBoundingClientRect().top -
                        5 +
                        window.scrollY,
                left: from == "left"
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
    return (<div>
      {isHoveringExpandDots && (<HoverDetails_1.HoverDetails top={isHoveringExpandDots.top} left={isHoveringExpandDots.left} text={"Show Options"}/>)}

      <div className={strategyBuilder_module_css_1.default.mediumCompleteStepContainer} style={style} ref={ownRef}>
        <div className={strategyBuilder_module_css_1.default.mediumCompleteStepTitleContainer}>
          {doesHaveChildren ? (<div>
              <framer_motion_1.motion.img className={strategyBuilder_module_css_1.default.mediumCompleteStepChildAddPlusIcon} alt="" src="/addchildplus.svg" onClick={() => addAnotherChild("left")} ref={leftPlusRef} whileHover={{ scale: 1.05 }}/>
              <framer_motion_1.motion.img className={strategyBuilder_module_css_1.default.mediumCompleteStepChildAddPlusIcon} alt="" src="/addchildplus.svg" style={{ left: "305px" }} onClick={() => addAnotherChild("right")} ref={rightPlusRef} whileHover={{ scale: 1.05 }}/>
            </div>) : null}
          <img src={stepDetails.protocol_details.logo} alt="" className={strategyBuilder_module_css_1.default.mediumCompleteStepProtocolIcon} style={{ borderRadius: "50%" }}/>
          <div className={strategyBuilder_module_css_1.default.mediumCompleteStepDetailContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumCompleteStepDetailText}>
              Action:{" "}
              {stepDetails.type.length > 7
            ? stepDetails.type.slice(0, 7) + "..."
            : stepDetails.type}
            </div>
          </div>
          <div className={strategyBuilder_module_css_1.default.mediumCompleteStepDetailContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumCompleteStepDetailText}>
              {stepDetails.percentage}%
            </div>
            <img src="/mediumCompleteStepEditIcon.svg" alt="" className={strategyBuilder_module_css_1.default.mediumCompleteStepEditIcon}/>
          </div>
          <framer_motion_1.motion.img src="/mediumCompleteStepExpandDots.svg" alt="" className={strategyBuilder_module_css_1.default.mediumCompleteStepExpandDots} onMouseEnter={(e) => {
            setIsHoveringExpandDots({
                top: e.clientY + window.scrollY,
                left: e.clientX,
            });
        }} onMouseLeave={() => setIsHoveringExpandDots(false)}/>
        </div>
        <div className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowsContainer}>
          <div className={strategyBuilder_module_css_1.default.mediumCompleteStepSingleFlowContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowsText}>Outflows:</div>
            <div className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowIconsContainer}>
              {stepDetails.outflows.map((outflow, index) => (<img src={outflow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowIcon} key={index}/>))}
            </div>
          </div>
          <div className={strategyBuilder_module_css_1.default.mediumCompleteStepSingleFlowContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowsText}>Inflows:</div>
            <div className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowIconsContainer}>
              {stepDetails.inflows.length > 0 ? (stepDetails.inflows.map((inflow) => (<img src={inflow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowIcon}/>))) : (<img src="/thin-x.svg" alt="" className={strategyBuilder_module_css_1.default.mediumCompleteStepFlowIcon}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
});
const MediumPlaceholderNode = (props) => {
    const { stepId, style, parentStepId, isEmpty, stepDetails } = props;
    const { nodeProcessStep, setNodeProcessStep } = props;
    const { strategySteps, setStrategySteps } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const [isHovering, setIsHovering] = (0, react_1.useState)(false);
    const handleAddStepClick = () => {
        if (isEmpty)
            return;
        setNodeProcessStep(Enums_1.NodeStepEnum.CHOOSE_ACTION);
        let tempStratSteps = [...strategySteps];
        let unusedPercentage;
        try {
            tempStratSteps
                .filter((_step) => _step.parent_step_identifier == stepDetails.step_identifier)
                .map((_step) => _step.percentage)
                .reduce((a, b) => a - b);
        }
        catch (e) {
            unusedPercentage = 100;
        }
        tempStratSteps.push({
            type: Enums_1.NodeStepEnum.CHOOSE_ACTION,
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
        return (<framer_motion_1.motion.div style={{
                ...style,
                borderRadius: "8px",
                background: "none",
                zIndex: "5",
                cursor: "pointer",
            }} className={strategyBuilder_module_css_1.default.mediumPlaceholderNodeContainer} whileHover={{ ...hoverStyle }}>
        {!isEmpty && (<div>
            <framer_motion_1.motion.img src="/addStepPlaceholder.svg" alt="" onMouseEnter={() => setIsHovering(!isEmpty && true)} onMouseLeave={() => setIsHovering(!isEmpty && !false)} onClick={() => handleAddStepClick()} style={{ cursor: "pointer" }} className={strategyBuilder_module_css_1.default.mediumPlaceholderNodeSvg}/>

            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumPlaceholderNodeText} style={{ position: "absolute", top: "37%", left: "35%" }}>
              Add Step +
            </framer_motion_1.motion.div>
          </div>)}
      </framer_motion_1.motion.div>);
    }
    else {
        return (<div style={{
                ...style,
                borderRadius: "8px",
                zIndex: "5",
                cursor: "pointer",
            }}></div>);
    }
};
exports.MediumPlaceholderNode = MediumPlaceholderNode;
exports.MediumNode = react_1.default.forwardRef((props, ref) => {
    const { stepId, style, optionalAction } = props;
    const { nodeProcessStep, setNodeProcessStep } = props;
    const { strategySteps, setStrategySteps } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const [currentStepDetails, setCurrentStepDetails] = (0, react_1.useState)(props.stepDetails);
    (0, react_1.useEffect)(() => {
        setCurrentStepDetails(props.stepDetails);
    }, [props.stepDetails, props.stepId]);
    const [currentAction, setCurrentAction] = (0, react_1.useState)(null);
    const handleActionChoice = (action) => {
        setCurrentAction(action);
        setNodeProcessStep(Enums_1.NodeStepEnum.CONFIG_ACTION);
    };
    const handleStepAdd = (stepDetails) => {
        let tempStratSteps = [...strategySteps];
        let stepIndex = tempStratSteps.findIndex((step) => {
            return step.step_identifier === stepDetails.step_identifier;
        });
        tempStratSteps[stepIndex] = stepDetails;
        setStrategySteps(tempStratSteps);
        setCurrentStepDetails(stepDetails);
        setNodeProcessStep(Enums_1.NodeStepEnum.COMPLETE);
    };
    // This is just for the landing page so that i can pass in a pre-made step detail
    (0, react_1.useEffect)(() => {
        if (optionalAction != null || undefined) {
            setCurrentAction(optionalAction);
        }
        return () => { };
    }, [props]);
    let nodeSettings = {
        style: {
            position: "absolute",
            top: props.style.top,
            left: props.style.left,
            zIndex: props.style.zIndex,
        },
        size: Enums_1.SizingEnum.MEDIUM,
        currentStepDetails: currentStepDetails,
        stepAssemblyHandler: handleStepAdd,
        stepId: stepId,
        ref: ref,
        setNodeProcessStep: setNodeProcessStep,
    };
    /************************************************************/
    let Stake_Config = (<div>
      <Stake_1.StakeConfig {...nodeSettings}/>
    </div>);
    let Swap_Config = (<div>
      <Swap_1.SwapConfig {...nodeSettings}/>
    </div>);
    let AddLiquidity_Config = (<div>
      <AddLiquidity_1.AddLiquidityConfig {...nodeSettings}/>
    </div>);
    let Harvest_Config = (<div>
      <Harvest_1.HarvestConfig {...nodeSettings}/>
    </div>);
    /************************************************************/
    if (nodeProcessStep === Enums_1.NodeStepEnum.CHOOSE_ACTION) {
        return (<exports.MediumChooseAction handleActionChoice={handleActionChoice} style={nodeSettings.style} ref={ref} stepDetails={currentStepDetails} stepId={stepId} setNodeProcessStep={setNodeProcessStep}/>);
    }
    else if (nodeProcessStep === Enums_1.NodeStepEnum.CONFIG_ACTION && currentAction) {
        return eval(`${currentAction.name.split(" ").join("")}_Config`);
    }
    else if (nodeProcessStep === Enums_1.NodeStepEnum.COMPLETE) {
        return (<exports.MediumCompleteStep style={nodeSettings.style} stepDetails={currentStepDetails} setNodeProcessStep={setNodeProcessStep} stepId={stepId} ref={ref} hoverHandler={props.hoverHandler}/>);
    }
    else if (nodeProcessStep === Enums_1.NodeStepEnum.PLACEHOLDER) {
        return (<exports.MediumPlaceholderNode style={nodeSettings.style} parentStepId={currentStepDetails.parent_step_identifier} stepDetails={currentStepDetails} stepId={stepId} setNodeProcessStep={setNodeProcessStep} isEmpty={currentStepDetails.empty}/>);
    }
    else {
        return (<div>
        <h1>ERROR</h1>
      </div>);
    }
});
//# sourceMappingURL=MediumNodes.js.map