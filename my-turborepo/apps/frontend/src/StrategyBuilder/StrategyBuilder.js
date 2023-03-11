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
exports.StrategyBuilder = exports.NodeStep = exports.StrategyDraggableContainer = exports.StrategyBoilerplate = exports.ActionableTokensTab = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const DatabaseContext_1 = require("../Contexts/DatabaseContext");
const MotionVariants_1 = require("../MotionVariants");
const MediumNodes_1 = require("./MediumNodes");
const Enums_1 = require("./Enums");
const AutoLine_1 = require("./AutoLine");
const ConfirmStrategy_1 = require("./ConfirmStrategy");
const react_2 = require("@use-gesture/react");
const FrequencyModal_1 = require("./FrequencyModal");
const utils_1 = require("utils/utils");
const EditDistributionModal_1 = require("./EditDistributionModal");
const HoverDetails_1 = require("HoverDetails");
const TokenSwapModal_1 = require("TokenSwapModal");
const ActionableTokensTab = (props) => {
    const { actionableTokens, quickAddActions } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { fullTokensList } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const [testData, setTestData] = (0, react_1.useState)(null);
    const [useEffectRan, setUseEffectRan] = (0, react_1.useState)(false);
    const leftOverTokens = (0, react_1.useRef)(0);
    if (fullTokensList) {
        return (<div>
        <div className={strategyBuilder_module_css_1.default.actionableTokensTab}>
          <div className={strategyBuilder_module_css_1.default.actionableTokensOffText}>
            Actionable Tokens:{" "}
          </div>
          <div className={strategyBuilder_module_css_1.default.actionableTokensIconsContainer}>
            {!actionableTokens.length
                ? "Start Building The Strategy To See Actionable Tokens"
                : actionableTokens.map((token, index, arr) => {
                    if (index > 5) {
                        leftOverTokens.current = leftOverTokens.current + 1;
                        return <div key={index}></div>;
                    }
                    else {
                        return (<img src={token.logo} alt="" className={strategyBuilder_module_css_1.default.actionableTokenIcon} key={index}/>);
                    }
                })}
          </div>
          {leftOverTokens.current > 0 ? (<div className={strategyBuilder_module_css_1.default.actionableTokensMoreText}>{`+${leftOverTokens.current} More`}</div>) : null}
        </div>
      </div>);
    }
    else {
        return null;
    }
};
exports.ActionableTokensTab = ActionableTokensTab;
const StrategyBoilerplate = (props) => {
    /***************************************************************************
     * Navigation Decleration
     **************************************************************************/
    const navigate = (0, react_router_dom_1.useNavigate)();
    /***************************************************************************
     * @Strategy - Current Session's Strategy Context
     **************************************************************************/
    const { strategyName, setStrategyName, depositToken, setDepositToken, setShowPercentageBox, showPercentageBox, strategyProcessLocation, setStrategyProcessLocation, StrategyProcessSteps, strategySteps, actionableTokens, quickAddActions, baseSteps, strategyNetworks, executionInterval, setExecutionInterval, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    /**************************************************************************
     * @Database - Database Context
     *************************************************************************/
    const { fullProtocolsList, fullAddressesList, fullTokensList, fullNetworksList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, accountAddress, setAccountAddress, baseStrategyABI, erc20ABI, provider, signer, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    /**
     * @ContextState - Context About The Current Strategy State, Mostly
     * For Styling Purposes
     */
    const { style } = props;
    const showStrategyObject = () => {
        let strategyObject = {
            strategyName: strategyName,
            depositToken: depositToken,
            baseSteps: baseSteps,
            strategySteps: strategySteps,
            networks: strategyNetworks,
            quickAddActions: quickAddActions,
        };
        console.log(strategyObject);
    };
    return (<div className={strategyBuilder_module_css_1.default.blackTopHeader} style={{ ...style, zIndex: "11" }}>
      <div className={strategyBuilder_module_css_1.default.leftCornerProcess}>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.leftCornerTurnedOffText} whileHover={{
            color: "rgb(255, 255, 255, 255)",
            transition: { duration: 0.1 },
        }} layout style={style} onClick={() => showStrategyObject()}>
          Base Strategy
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.img src="/leftCornerProcessArrow.svg" alt="" className={strategyBuilder_module_css_1.default.leftCornerProcessArrow}/>
        <div className={strategyBuilder_module_css_1.default.leftCornerTurnedOnText}>Create Strategy</div>
      </div>
      <div className={strategyBuilder_module_css_1.default.rightProcessContainer}>
        <framer_motion_1.motion.button className={strategyBuilder_module_css_1.default.deployButtonRightCorner} variants={MotionVariants_1.ButtonVariants} whileHover={"hover"} onClick={() => props.openConfirmStrategy(true)}>
          Deploy Strategy
        </framer_motion_1.motion.button>
        <div className={strategyBuilder_module_css_1.default.strategyExecutionTimestampContainer}>
          <div className={strategyBuilder_module_css_1.default.strategyExecutionTimestampOffText}>
            Strategy Runs:
          </div>
          <div className={strategyBuilder_module_css_1.default.strategyExecutionTimestampOnText}>
            {executionInterval
            ? `${(0, utils_1.rawCalcInterval)(executionInterval).interval} ${(0, utils_1.toTitleCase)((0, utils_1.rawCalcInterval)(executionInterval).unit)} `
            : "Unset"}
          </div>
          <framer_motion_1.motion.img src="/editicon.svg" alt="" className={strategyBuilder_module_css_1.default.strategyExecutionTimestampEditIcon} whileHover={{ opacity: 0.8, transition: { duration: 0.2 } }} onClick={() => props.openFrequencyModal(true)}/>
        </div>
      </div>
    </div>);
};
exports.StrategyBoilerplate = StrategyBoilerplate;
const StrategyDraggableContainer = (props) => {
    const { currentDimensions } = props;
    const draggableContainerSize = (0, react_1.useRef)();
    return (<div style={{ overflow: "hidden" }}>
      <div className={strategyBuilder_module_css_1.default.draggableContainer} ref={draggableContainerSize} style={{ overflow: "hidden" }}>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.draggableBackground} drag dragElastic={1} style={{
            width: `200px`,
            height: `20000px`,
            overflow: "hidden",
        }}></framer_motion_1.motion.div>
      </div>
    </div>);
};
exports.StrategyDraggableContainer = StrategyDraggableContainer;
exports.NodeStep = react_1.default.forwardRef((props, ref) => {
    let { processStep } = props;
    const [nodeProcessStep, setNodeProcessStep] = (0, react_1.useState)(processStep);
    (0, react_1.useEffect)(() => {
        setNodeProcessStep(processStep);
    }, [processStep]);
    if (props.size === Enums_1.SizingEnum.MEDIUM) {
        return (<MediumNodes_1.MediumNode style={props.style} nodeProcessStep={nodeProcessStep} setNodeProcessStep={setNodeProcessStep} stepId={props.stepId} ref={ref} stepDetails={props.stepDetails} optionalAction={props.optionalAction} hoverHandler={props.hoverHandler}/>);
    }
    else {
        // TODO: - Add Mini Node Component
        return (<div>
        <div>Mini Node</div>
      </div>);
    }
});
const StrategyBuilder = (props) => {
    // Context About The Current Strategy
    const { strategySteps, setStrategySteps, d3StrategyHirarchy, d3StrategyHirarchySizing, executionInterval, showTokenModal, setShowTokenModal, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { fullProtocolsList } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    // Keeps Track Of The Current Size Of The Draggable Container
    const [draggableContainerSize, setDraggableContainerSize] = (0, react_1.useState)({
        width: {
            integer: window.innerWidth,
            unit: "px",
        },
        height: {
            integer: window.innerHeight,
            unit: "px",
        },
    });
    const [viewportSize, setViewportSize] = (0, react_1.useState)({
        width: {
            integer: window.innerWidth,
            unit: "px",
        },
        height: {
            integer: window.innerHeight,
            unit: "px",
        },
    });
    const draggableContainerRef = (0, react_1.useRef)();
    const draggableBackgroundRef = (0, react_1.useRef)();
    // Keeps track of current container zoom
    const [zoom, setZoom] = (0, react_1.useState)(1);
    (0, react_2.useGesture)({
        onPinch: ({ origin: [ox, oy], movement: [md], offset: [d] }) => setZoom((zoom) => (d / 5 > 1.25 ? 1 + 1.25 : 1 + d / 5)),
    }, {
        target: draggableContainerRef,
        eventOptions: { passive: false },
    });
    const [isConfirmStrategyOpen, setIsConfirmStrategyOpen] = (0, react_1.useState)(false);
    const [isFrequencyModalOpen, setIsFrequencyModalOpen] = (0, react_1.useState)(true);
    const [isEditDistributionOpen, setIsEditDistributionOpen] = (0, react_1.useState)(false);
    const [hoverOpen, setHoverOpen] = (0, react_1.useState)(false);
    // Opening frequency modal once when user enters the page if their timestamp is not
    // yet set
    (0, react_1.useEffect)(() => {
        if (!executionInterval) {
            // TODO: Set this when not testing
            // setIsFrequencyModalOpen(true);
        }
    }, []);
    // Sizing of the nodes
    // TODO: For the future, create mini / even large version of nodes, dynamically
    // TODO: Chaange based on zooming
    const [currentSize, setCurrentSize] = (0, react_1.useState)(Enums_1.SizingEnum.MEDIUM);
    (0, react_1.useEffect)(() => {
        window.addEventListener("resize", (e) => setViewportSize({
            width: e.target.innerWidth,
            height: e.target.innerHeight,
        }));
        return () => window.removeEventListener("resize", (e) => setViewportSize({
            width: e.target.innerWidth,
            height: e.target.innerHeight,
        }));
    }, []);
    (0, react_1.useEffect)(() => {
        let newObject;
        newObject = {
            width: {
                integer: viewportSize.width.integer >= d3StrategyHirarchySizing.width.integer
                    ? viewportSize.width.integer
                    : d3StrategyHirarchySizing.width.integer,
                unit: "px",
            },
            height: {
                integer: viewportSize.height.integer >= d3StrategyHirarchySizing.height.integer
                    ? viewportSize.height.integer
                    : d3StrategyHirarchySizing.height.integer,
                unit: "px",
            },
        };
        setDraggableContainerSize(newObject);
    }, [viewportSize, d3StrategyHirarchySizing]);
    (0, react_1.useEffect)(() => {
        console.log("zoom", zoom);
    }, [zoom]);
    (0, react_1.useEffect)(() => {
        console.log("Hover Opened!", hoverOpen);
    }, [hoverOpen]);
    return (<body style={{ overflow: "hidden" }}>
      <div className={strategyBuilder_module_css_1.default.pageDiv} style={{ overflowY: "hidden" }}>
        {isConfirmStrategyOpen && (<ConfirmStrategy_1.ConfirmStrategy modalHandler={setIsConfirmStrategyOpen}/>)}
        {showTokenModal && (<TokenSwapModal_1.TokenSwapModal target={showTokenModal.target} choiceHandler={showTokenModal.choiceHandler} modalHandler={setShowTokenModal}/>)}
        <exports.StrategyBoilerplate openConfirmStrategy={setIsConfirmStrategyOpen} openFrequencyModal={setIsFrequencyModalOpen} style={{ overflow: "hidden" }}/>
        <exports.ActionableTokensTab />
        {isFrequencyModalOpen && (<FrequencyModal_1.FrequencyModal modalHandler={setIsFrequencyModalOpen}/>)}
        {isEditDistributionOpen && (<EditDistributionModal_1.EditDistributionModal modalHandler={setIsEditDistributionOpen} parentId={isEditDistributionOpen.parentId} childId={isEditDistributionOpen.childId} unusedPercentage={100 -
                strategySteps
                    .filter((_step) => _step.parentId === isEditDistributionOpen.parentId)
                    .map((_step) => _step.percentage)
                    .reduce((a, b) => a + b, 0)} locationDetails={{
                top: isEditDistributionOpen.top,
                left: isEditDistributionOpen.left,
            }} percentage={isEditDistributionOpen.percentage}/>)}
        {hoverOpen && (<HoverDetails_1.HoverDetails top={hoverOpen.top} left={hoverOpen.left} text={hoverOpen.text}/>)}

        <div className={strategyBuilder_module_css_1.default.draggableContainer} style={{
            zIndex: "10",
            width: `${draggableContainerSize.width.integer}${draggableContainerSize.width.unit}`,
            height: `${draggableContainerSize.height.integer}${draggableContainerSize.height.unit}`,
            top: "0px",
            position: "absolute",
            overflow: "hidden",
            scale: zoom,
        }} ref={draggableContainerRef}>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.draggableBackground} drag dragElastic={0} dragMomentum={false} style={{
            width: `${draggableContainerSize.width.integer}${draggableContainerSize.width.unit}`,
            height: `${draggableContainerSize.height.integer}${draggableContainerSize.height.unit}`,
            scale: zoom,
        }} dragConstraints={{
            bottom: 0,
            top: parseInt(`${-200 +
                viewportSize.height.integer -
                draggableContainerSize.height.integer}`),
            left: parseInt(`${viewportSize.width.integer -
                draggableContainerSize.width.integer}`),
            right: 0,
            // right: parseInt(
            //   `${
            //     viewportSize.width.integer -
            //     draggableContainerSize.width.integer
            //   }`
            // ),
        }}>
            {/* <AddLiquidityConfig
          size={currentSize}
          stepId={1}
          style={{
            top: "96px",
            left: "400px",
          }}
        /> */}
            {d3StrategyHirarchy.map((step, index, arr) => {
            let tStyle = {
                top: `${96 + step.position.y}px`,
                left: `${draggableContainerSize.width.integer / 2 -
                    step.width / 2 +
                    step.position.x}px`,
                position: "absolute",
                zIndex: `1`,
            };
            let nodeChilds = step.children;
            if (step.type == "swapcomponent") {
                return (<div>
                    <div className={strategyBuilder_module_css_1.default.batchSwapBlock} style={tStyle} key={index}>
                      <div className={strategyBuilder_module_css_1.default.batchSwapText}>Swap</div>
                      <img src="/lifi.png" alt="" className={strategyBuilder_module_css_1.default.batchSwapImg}/>
                    </div>
                    {nodeChilds
                        ? nodeChilds
                            .filter((step) => step.type !== Enums_1.NodeStepEnum.PLACEHOLDER &&
                            !step.empty)
                            .map((child, indexx) => {
                            let newObj = {
                                ...child.data,
                                position: { x: child.x, y: child.y },
                            };
                            return (<AutoLine_1.AutoLine parentNode={{
                                    width: step.width,
                                    height: step.height,
                                    position: {
                                        x: draggableContainerSize.width.integer / 2 -
                                            step.width / 2 +
                                            step.position.x,
                                        y: 96 + step.position.y,
                                    },
                                    stepId: step.step_identifier,
                                }} childNode={{
                                    width: newObj.width,
                                    height: newObj.height,
                                    position: {
                                        x: draggableContainerSize.width.integer / 2 -
                                            newObj.width / 2 +
                                            newObj.position.x,
                                        y: 96 + newObj.position.y,
                                    },
                                    type: newObj.type,
                                    empty: newObj.empty ? newObj.empty : false,
                                    stepId: newObj.step_identifier,
                                    percentage: newObj.percentage,
                                }} key={indexx} percentageModalHandler={setIsEditDistributionOpen}/>);
                        })
                        : null}
                  </div>);
            }
            if (step.type == "deposittoken") {
                return (<div>
                    <img src={step.token.logo} alt="" className={strategyBuilder_module_css_1.default.depositTokenImg} style={tStyle} key={index}/>
                    {nodeChilds
                        ? nodeChilds
                            .filter((step) => step.type !== Enums_1.NodeStepEnum.PLACEHOLDER &&
                            !step.empty)
                            .map((child, indexx) => {
                            let newObj = {
                                ...child.data,
                                position: { x: child.x, y: child.y },
                            };
                            return (<AutoLine_1.AutoLine parentNode={{
                                    width: step.width,
                                    height: step.height,
                                    position: {
                                        x: draggableContainerSize.width.integer / 2 -
                                            step.width / 2 +
                                            step.position.x,
                                        y: 96 + step.position.y,
                                    },
                                    stepId: step.step_identifier,
                                }} childNode={{
                                    width: newObj.width,
                                    height: newObj.height,
                                    position: {
                                        x: draggableContainerSize.width.integer / 2 -
                                            newObj.width / 2 +
                                            newObj.position.x,
                                        y: 96 + newObj.position.y,
                                    },
                                    type: newObj.type,
                                    empty: newObj.empty ? newObj.empty : false,
                                    stepId: newObj.step_identifier,
                                    percentage: newObj.percentage,
                                }} key={indexx} percentageModalHandler={setIsEditDistributionOpen}/>);
                        })
                        : null}
                  </div>);
            }
            if (step.type == "tokens") {
                return (<div>
                    <div style={tStyle}>
                      <div className={strategyBuilder_module_css_1.default.baseTokensContainer}>
                        {step.tokens.map((token, index) => (<img src={token.logo} alt="" className={strategyBuilder_module_css_1.default.baseTokenImg} key={index}/>))}
                      </div>
                    </div>
                    {nodeChilds
                        ? nodeChilds
                            .filter((step) => step.type !== Enums_1.NodeStepEnum.PLACEHOLDER &&
                            !step.empty)
                            .map((child, indexx) => {
                            let newObj = {
                                ...child.data,
                                position: { x: child.x, y: child.y },
                            };
                            return (<AutoLine_1.AutoLine parentNode={{
                                    width: step.width,
                                    height: step.height,
                                    position: {
                                        x: draggableContainerSize.width.integer / 2 -
                                            step.width / 2 +
                                            step.position.x,
                                        y: 96 + step.position.y,
                                    },
                                    stepId: step.step_identifier,
                                }} childNode={{
                                    width: newObj.width,
                                    height: newObj.height,
                                    position: {
                                        x: draggableContainerSize.width.integer / 2 -
                                            newObj.width / 2 +
                                            newObj.position.x,
                                        y: 96 + newObj.position.y,
                                    },
                                    type: newObj.type,
                                    empty: newObj.empty ? newObj.empty : false,
                                    stepId: newObj.step_identifier,
                                    percentage: newObj.percentage,
                                }} key={indexx} percentageModalHandler={setIsEditDistributionOpen}/>);
                        })
                        : null}
                  </div>);
            }
            let doesHaveStepDetails = step.function_identifiers.length > 0;
            let isPlaceholder = step.type == Enums_1.NodeStepEnum.PLACEHOLDER;
            let currentNodeProcessStep;
            if (doesHaveStepDetails) {
                currentNodeProcessStep = Enums_1.NodeStepEnum.COMPLETE;
            }
            else if (step.type == Enums_1.NodeStepEnum.CHOOSE_ACTION) {
                currentNodeProcessStep = Enums_1.NodeStepEnum.CHOOSE_ACTION;
            }
            else if (step.type == Enums_1.NodeStepEnum.PLACEHOLDER) {
                currentNodeProcessStep = Enums_1.NodeStepEnum.PLACEHOLDER;
            }
            return (<div>
                  <exports.NodeStep size={currentSize} stepId={step.step_identifier} style={tStyle} processStep={currentNodeProcessStep} key={index} stepDetails={step} hoverHandler={setHoverOpen}/>
                  {nodeChilds
                    ? nodeChilds
                        .filter((step) => step.type !== Enums_1.NodeStepEnum.PLACEHOLDER &&
                        !step.empty)
                        .map((child, indexx) => {
                        let newObj = {
                            ...child.data,
                            position: { x: child.x, y: child.y },
                        };
                        return (<AutoLine_1.AutoLine parentNode={{
                                width: step.width,
                                height: step.height,
                                position: {
                                    x: draggableContainerSize.width.integer / 2 -
                                        step.width / 2 +
                                        step.position.x,
                                    y: 96 + step.position.y,
                                },
                                stepId: step.step_identifier,
                            }} childNode={{
                                width: newObj.width,
                                height: newObj.height,
                                position: {
                                    x: draggableContainerSize.width.integer / 2 -
                                        newObj.width / 2 +
                                        newObj.position.x,
                                    y: 96 + newObj.position.y,
                                },
                                type: newObj.type,
                                empty: newObj.empty ? newObj.empty : false,
                                stepId: newObj.step_identifier,
                                percentage: newObj.percentage,
                            }} key={indexx} percentageModalHandler={setIsEditDistributionOpen}/>);
                    })
                    : null}
                </div>);
        })}
          </framer_motion_1.motion.div>
        </div>
      </div>
    </body>);
};
exports.StrategyBuilder = StrategyBuilder;
//# sourceMappingURL=StrategyBuilder.js.map