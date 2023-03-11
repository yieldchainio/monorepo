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
exports.BaseStrategyTab = exports.BaseStrategyLargeTab = exports.BaseStrategyMiniTab = void 0;
const react_1 = __importStar(require("react"));
const baseMiniTab_module_css_1 = __importDefault(require("./css/baseMiniTab.module.css"));
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const editDistribution_1 = require("./editDistribution");
const StepBlockMini_1 = require("./StepBlockMini");
const utils_1 = require("utils/utils");
const Lines_1 = require("./Lines");
/**
 * The @Mini Tab Component That Sticks To The Bottom Of The Screen
 * Whilst Choosing The Base Steps Of The Strategy
 */
const BaseStrategyMiniTab = (props) => {
    /***************************************************************************
     * Navigation Decleration
     **************************************************************************/
    /***************************************************************************
     * @Styling States
     **************************************************************************/
    const [isHoveringContinue, setIsHoveringContinue] = (0, react_1.useState)(false);
    const [isHoveringExpand, setIsHoveringExpand] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    /***************************************************************************
     * @Strategy - Current Session's Strategy Context
     **************************************************************************/
    const { strategyName, setStrategyName, depositToken, setDepositToken, baseSteps, setBaseSteps, showPercentageBox, setShowPercentageBox, handleBaseStepAdd, unusedBaseBalance, setUnusedBaseBalance, isModalOpen, setIsModalOpen, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    /***************************************************************************
     * @handles A Base Step Being Added, Adds It To The Global
     * State, Will Add Some Animations In The Future @TODO
     **************************************************************************/
    /**************************************************************************
     * @Database - Database Context
     *************************************************************************/
    const { fullProtocolsList, fullAddressesList, fullTokensList, fullNetworksList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, accountAddress, setAccountAddress, baseStrategyABI, erc20ABI, provider, signer, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const handleExpand = () => {
        props.expandHandler(true);
        setIsModalOpen(true);
    };
    return (<div>
      {<editDistribution_1.EditDistributionModal setDivisor={handleBaseStepAdd} style={{ top: `400px` }}/>}
      <div className={baseMiniTab_module_css_1.default.miniTabBody}>
        <div className={baseMiniTab_module_css_1.default.vaultDepositTokenTitle}>
          Vault Deposit Token:
        </div>
        <img src={depositToken.logo} alt="" className={baseMiniTab_module_css_1.default.depositTokenImg}/>
        <div className={baseMiniTab_module_css_1.default.depositTokenName}>{depositToken.symbol}</div>
        <div className={baseMiniTab_module_css_1.default.baseStepsTitle}>Base Steps:</div>
        {baseSteps.length > 0 ? (<div className={baseMiniTab_module_css_1.default.baseStepsText}>
            {baseSteps
                .map((bStep) => bStep.type)
                .join(", ")
                .slice(0, 17)}
            {baseSteps.length > 1 ? "..." : ""}
          </div>) : (<div className={baseMiniTab_module_css_1.default.baseStepsText}>Choose Base Steps</div>)}
        <framer_motion_1.motion.img src="/expandicon.svg" alt="" className={baseMiniTab_module_css_1.default.expandIcon} whileHover={{
            scale: 1.05,
            transition: { duration: 0.1 },
        }} onClick={() => handleExpand()}/>
        {unusedBaseBalance > 0 && (<button className={baseMiniTab_module_css_1.default.continueBtnOff}>
            Unused %: {unusedBaseBalance}%
          </button>)}

        <framer_motion_1.motion.div>
          <framer_motion_1.motion.button className={baseMiniTab_module_css_1.default.continueBtnOn} whileHover={{ scale: 1.1 }} onHoverStart={() => setIsHoveringContinue(!isHoveringContinue)} onHoverEnd={() => setIsHoveringContinue(!isHoveringContinue)} onClick={() => navigate(`/strategy-builder`)}>
            Continue
          </framer_motion_1.motion.button>
          <framer_motion_1.motion.svg layout width="10" height="8" viewBox="0 0 10 8" xmlns="http://www.w3.org/2000/svg" className={baseMiniTab_module_css_1.default.continueArrowImg} style={isHoveringContinue ? { scale: 1.1 } : {}}>
            <path fill="currentColor" d="M7.53388e-07 3.49495L6.15381e-07 4.50505L7.57576 4.50505L4.10353 7.28283L5 8L10 4L5 -2.79694e-07L4.10354 0.717171L7.57576 3.49495L7.53388e-07 3.49495Z"/>
          </framer_motion_1.motion.svg>
        </framer_motion_1.motion.div>
      </div>
    </div>);
};
exports.BaseStrategyMiniTab = BaseStrategyMiniTab;
/***************************************************************************
 * @handles Calcualtes How The Steps Blocks Should Be Spread, Returns
 * Component That Renders The Steps With The Correct Spacing & Connective
 * Lines
 **************************************************************************/
const calculateBaseChildSpread = async (props) => {
    const { steps } = props;
    let newSteps = [];
    if (steps.length == 1) {
        return <div></div>;
    }
};
const BaseStrategyLargeTab = (props) => {
    /***************************************************************************
     * Navigation Decleration
     **************************************************************************/
    const navigate = (0, react_router_dom_1.useNavigate)();
    /***************************************************************************
     * @Styling States & Handlers
     **************************************************************************/
    const [isHoveringContinue, setIsHoveringContinue] = (0, react_1.useState)(false);
    const [isHoveringMinimize, setIsHoveringMinimize] = (0, react_1.useState)(false);
    const handleMinimize = () => {
        props.expandHandler(false);
        setIsModalOpen(false);
    };
    /***************************************************************************
     * @Strategy - Current Session's Strategy Context
     **************************************************************************/
    const { strategyName, setStrategyName, depositToken, setDepositToken, baseSteps, setBaseSteps, showPercentageBox, setShowPercentageBox, handleBaseStepAdd, unusedBaseBalance, setUnusedBaseBalance, isModalOpen, setIsModalOpen, strategyProcessLocation, setStrategyProcessLocation, StrategyProcessSteps, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    /**************************************************************************
     * @Database - Database Context
     *************************************************************************/
    const { fullProtocolsList, fullAddressesList, fullTokensList, fullNetworksList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, accountAddress, setAccountAddress, baseStrategyABI, erc20ABI, provider, signer, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    /**************************************************************************
     * @Refds - Refrences to Components & Elements
     *************************************************************************/
    /**************************************************************************
     * @BaseStrategy - Handlers & State For The Visual Base Strategy
     *************************************************************************/
    // Keeps Track Of The Token Outflows Of The Base Steps
    const [baseOutflows, setBaseOutflows] = (0, react_1.useState)(null);
    // Keeps Track Of Each Outflow And If It Is Bundled Or Not
    const [stepIdToOutflows, setStepIdToOutflows] = (0, react_1.useState)(new Map());
    // Ref For The base Node (Multiswapper)
    const baseNodeRef = (0, react_1.useRef)();
    // Refs For Each One Of The Tokens In The Base Strategy
    const largeTokensRef = (0, react_1.useRef)(new Array());
    const [refsLoaded, setRefsLoaded] = (0, react_1.useState)(false);
    // Relates Tokens Refs To Their Child Nodes' Refs
    /**
     * Type Of Line To Be Returned For The Connective Lines
     */
    let LineType;
    (function (LineType) {
        LineType["Straight"] = "straight";
        LineType["Right"] = "right";
        LineType["Left"] = "left";
    })(LineType || (LineType = {}));
    let nodeType;
    (function (nodeType) {
        nodeType["BASE"] = "base";
        nodeType["MINISTEP"] = "ministep";
        nodeType["LARGETOKEN"] = "largeToken";
    })(nodeType || (nodeType = {}));
    (0, react_1.useEffect)(() => {
        if (baseNodeRef.current) {
            setRefsLoaded(true);
        }
        return () => {
            setRefsLoaded(false);
        };
    }, []);
    const renderOutflowStepNode = () => {
        let arrToRender = [];
        for (const step of baseSteps) {
            let currentOutflows = step.outflows;
            let parentNodeX = baseNodeRef.current.offsetLeft;
            let parentNodeY = baseNodeRef.current.offsetTop;
            let currentIndex = step.step_identifier;
            let currentWidth = currentOutflows.length <= 2 ? 64 * currentOutflows.length : 64 * 3;
            let pingPongResults = (0, utils_1.pingPongSymmetricalBlockSpread)(baseSteps, currentIndex, parentNodeX, 188, currentWidth, 140, 225);
            let tokensHeight = parentNodeY + 108;
            let currentNodeHorizontalPosition = pingPongResults[0];
            // This Is To Change The Positions Slightly If There Are Multiple Tokens
            // Inside A Single Step's Outflows Bundle
            currentNodeHorizontalPosition =
                currentOutflows.length > 1
                    ? currentNodeHorizontalPosition -
                        currentWidth * currentOutflows.length +
                        currentWidth / 2
                    : currentNodeHorizontalPosition - currentWidth / 2;
            let isCurrentNodeSymmetrical = pingPongResults[1];
            let symmetricIndex = !isCurrentNodeSymmetrical
                ? (currentIndex - 1) / 2
                : (0, utils_1.isNumSymmetric)(baseSteps.length / 2)
                    ? currentIndex / 2
                    : currentIndex / 2 - 1;
            let parentNodeRightAnchor = parentNodeX + 188;
            let parentNodeLeftAnchor = parentNodeX;
            let parentNodeBottomAnchorX = parentNodeX + 93;
            let parentNodeBottomAnchorY = parentNodeY + 56;
            let currentChildWidth = currentOutflows.length <= 1 ? 64 : 64 * currentOutflows.length - 15;
            let currentRenderItem = (<div>
          {currentIndex == 0 && !isCurrentNodeSymmetrical ? (<div>
              <StepBlockMini_1.MiniStepBlock stepDetails={step} key={step.step_identifier} style={{
                        position: "absolute",
                        top: `${tokensHeight + 64 + 156 - 10}px`,
                        left: `${parentNodeBottomAnchorX - 108}px`,
                    }}/>
              <Lines_1.StraightLine top={tokensHeight - 52} height={52} left={parentNodeBottomAnchorX} percentage={step.percentage}/>
              <Lines_1.StraightLine top={tokensHeight + 64 - 2} height={156} left={parentNodeBottomAnchorX} percentage={100}/>
            </div>) : isCurrentNodeSymmetrical ? (<div>
              <Lines_1.RightLine height={81} width={173 + symmetricIndex * 225} top={parentNodeY + 27} left={parentNodeRightAnchor} percentage={step.percentage}/>
              {<div>
                  <StepBlockMini_1.MiniStepBlock stepDetails={step} key={step.step_identifier} style={{
                            position: "absolute",
                            top: `${tokensHeight + 64 + 156 - 10}px`,
                            left: `${parentNodeRightAnchor +
                                (173 + symmetricIndex * 225) -
                                108}px`,
                        }}/>
                  <Lines_1.StraightLine top={tokensHeight + 64 - 2} height={156} left={parentNodeRightAnchor + (173 + symmetricIndex * 225)} percentage={100}/>
                </div>}
            </div>) : (<div>
              <Lines_1.LeftLine height={81} width={173 + symmetricIndex * 225} top={parentNodeY + 27} left={parentNodeLeftAnchor - (173 + symmetricIndex * 225)} percentage={step.percentage}/>
              <StepBlockMini_1.MiniStepBlock stepDetails={step} key={step.step_identifier} style={{
                        position: "absolute",
                        top: `${tokensHeight + 64 + 156 - 10}px`,
                        left: `${parentNodeLeftAnchor - (173 + symmetricIndex * 225) - 108}px`,
                    }}/>
              <Lines_1.StraightLine top={tokensHeight + 64 - 2} height={156} left={parentNodeLeftAnchor - (173 + symmetricIndex * 225)} percentage={100}/>
            </div>)}
          <div className={baseMiniTab_module_css_1.default.largeTokenImgsContainer} style={{
                    top: `${tokensHeight}px`,
                    left: `${currentNodeHorizontalPosition}px`,
                }} data-outflows={step.outflows} ref={(el) => (largeTokensRef.current[largeTokensRef.current.length] = el)} data-parentnode={baseNodeRef.current}>
            {currentOutflows.map((flow, index, arr) => {
                    if (index <= 1) {
                        return (<div>
                    <img src={flow.token_details.logo} alt="" className={baseMiniTab_module_css_1.default.bigTokenImg} key={flow.flow_identifier} style={arr.length <= 1 ? { margin: "0px" } : {}}/>
                  </div>);
                    }
                    else {
                        return <h1>+{arr.length - 2}</h1>;
                    }
                })}
          </div>
        </div>);
            arrToRender.push(currentRenderItem);
        }
        return arrToRender;
    };
    // const handleLargeTokenPositions = () => {
    //   /**
    //    * If There is Only One Node In The Array, It Will Just Return It
    //    * Coming Out Of The base Node With A Straight, Centered Line
    //    */
    //   if (nodesArr.length == 1) {
    //     let node = renderNodeType(nodesArr[0], typesArr[0]);
    //     let x = "x";
    //     return <div></div>;
    //   }
    // };
    return (<div className={baseMiniTab_module_css_1.default.wrapper} onClick={() => handleMinimize()}>
      <div className={baseMiniTab_module_css_1.default.baseLargeTab} onClick={(e) => e.stopPropagation()}>
        <framer_motion_1.motion.img src="/minimizeicon.svg" alt="" className={baseMiniTab_module_css_1.default.minimizeIcon} whileHover={{ scale: 0.95 }} onClick={() => handleMinimize()} style={{ left: `${window.innerWidth}px` }}/>
        <div className={baseMiniTab_module_css_1.default.strategyName}>{strategyName}</div>
        <div className={baseMiniTab_module_css_1.default.baseStrategyContainer}>
          <framer_motion_1.motion.div className={baseMiniTab_module_css_1.default.baseStrategyBackground} drag dragConstraints={{ top: 0, bottom: 0 }}>
            <img src={depositToken.logo} alt="" className={baseMiniTab_module_css_1.default.depositTokenImgBigTab}/>
            <div className={baseMiniTab_module_css_1.default.depositTokenNameContainer}>
              <div className={baseMiniTab_module_css_1.default.depositTokenNameText}>
                ${depositToken.symbol}
              </div>
            </div>
            <img src="/straightline.svg" alt="" className={baseMiniTab_module_css_1.default.whiteLine}/>
            <div className={baseMiniTab_module_css_1.default.batchSwapBlock} ref={baseNodeRef}>
              <div className={baseMiniTab_module_css_1.default.batchSwapText}>Swap</div>
              <img src="/lifi.png" alt="" className={baseMiniTab_module_css_1.default.batchSwapImg}/>
            </div>
            {baseSteps.length > 0 && refsLoaded
            ? renderOutflowStepNode()
            : null}
            {/* {baseSteps.map((bStep: any, index: number) => (
          <MiniStepBlock
            stepDetails={bStep}
            key={index}
            style={{ position: "absolute", top: "1000px" }}
          />
        ))} */}
          </framer_motion_1.motion.div>
        </div>
      </div>
    </div>);
};
exports.BaseStrategyLargeTab = BaseStrategyLargeTab;
const MotionMiniTab = (0, framer_motion_1.motion)(exports.BaseStrategyMiniTab);
const MotionLargeTab = (0, framer_motion_1.motion)(exports.BaseStrategyLargeTab);
const BaseStrategyTab = (props) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    return (<div>
      {isExpanded ? (<exports.BaseStrategyLargeTab expandHandler={setIsExpanded}/>) : (<exports.BaseStrategyMiniTab expandHandler={setIsExpanded}/>)}
    </div>);
};
exports.BaseStrategyTab = BaseStrategyTab;
//# sourceMappingURL=BaseStrategyTab.js.map