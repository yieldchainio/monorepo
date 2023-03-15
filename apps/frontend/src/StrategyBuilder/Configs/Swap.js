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
exports.SwapConfig = exports.MediumConfig = void 0;
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
const TokenSwapModal_1 = require("../../TokenSwapModal");
const ethers = __importStar(require("ethers"));
const MediumConfig = (props) => {
    /**
     * The Identifier Of The Current Action ("Stake")
     */
    let StakeIdentifier = 1;
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
    // Keeps track of the pool dropdown, true when it should be opened,
    // False when it should be closed
    const [isTokenModalOpen, setIsTokenModalOpen] = (0, react_1.useState)(false);
    // Keeps Track Of The Current Chosen Pool, To Display It Accordingly &&
    // To Be Used Within the Assembled Step (IT includes all the needed details)
    const [chosenFromToken, setChosenFromToken] = (0, react_1.useState)(null);
    const [chosenToToken, setChosenToToken] = (0, react_1.useState)(null);
    // Keeps Track Of the Current Percentage Allocated To The Step
    const [chosePercentage, setChosePercentage] = (0, react_1.useState)(strategySteps[strategySteps.findIndex((_step) => _step.step_identifier == stepId)].percentage);
    // Opens The Hover Details Popup
    const [openHoverDetails, setOpenHoverDetails] = (0, react_1.useState)(false);
    // Opens And Closes The Percentage Modal
    const [openPercentageModal, setOpenPercentageModal] = (0, react_1.useState)(false);
    // Keeps track of the (optional) custom arguments
    const [customArguments, setCustomArguments] = (0, react_1.useState)([]);
    // Keeping track of whether custom arguments are required
    const [customArgumentsRequired, setCustomArgumentsRequired] = (0, react_1.useState)(false);
    // Currently swap go through Li.Fi, so there is a single
    // Function identifier for all swaps
    const SwapFunctionIdentifier = 14;
    const [chosenDex, setChosenDex] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (fullProtocolsList) {
            let LifiProtocolDetails = fullProtocolsList.find((protocol) => protocol.protocol_identifier == 3);
            setChosenDex(LifiProtocolDetails);
        }
    }, [fullProtocolsList]);
    // Assemble the step object using user's token choices
    const assembleStep = async () => {
        let step = {
            type: "Swap",
            action_identifier: StakeIdentifier,
            divisor: await (0, utils_js_1.calcDivisor)(chosePercentage),
            percentage: chosePercentage,
            function_identifiers: [SwapFunctionIdentifier],
            address_identifiers: [
                (await protocolsAddressesList.find((protocolAddressPair) => protocolAddressPair.protocol_identifier ==
                    chosenDex.protocol_identifier)).address_identifier,
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
        let fromTokenIndex = actionAbleTokensCopy.findIndex((token) => token.token_identifier == chosenFromToken.token_identifier);
        actionAbleTokensCopy.splice(fromTokenIndex, 1, chosenToToken);
        setActionableTokens(actionAbleTokensCopy);
        stepAssemblyHandler(step);
    };
    // Token Choice handler, passed down as props
    const handleTokenChoice = (token, target) => {
        if (target === "from") {
            setChosenFromToken(token);
        }
        else if (target === "to") {
            setChosenToToken(token);
        }
        else {
        }
        setIsTokenModalOpen(false);
    };
    /**
     * @Handlers
     */
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
    /**
     * @Component
     */
    return (<div>
      {openHoverDetails ? (<HoverDetails_1.HoverDetails top={openHoverDetails.top} left={openHoverDetails.left} text={openHoverDetails.text}/>) : null}
      {openPercentageModal ? (<editDistribution_1.EditPercentageModal setPercentage={handleChosenPercentage} locationDetails={openPercentageModal}/>) : null}
      {isTokenModalOpen ? (<TokenSwapModal_1.TokenSwapModal choiceHandler={handleTokenChoice} target={isTokenModalOpen} handleModal={setIsTokenModalOpen} tokensList={actionableTokens} isStrategy={true}/>) : null}
      <div className={strategyBuilder_module_css_1.default.mediumSwapConfigContainer} style={style}>
        <div className={strategyBuilder_module_css_1.default.mediumConfigTitleContainer}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOff}>Action:</div>
          <div className={strategyBuilder_module_css_1.default.mediumConfigTitleTextOn}>Swap</div>
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
          <div className={strategyBuilder_module_css_1.default.mediumSwapConfigHeadDexContainer}>
            <div className={strategyBuilder_module_css_1.default.mediumSwapConfigDexTitle}>DEX</div>
            <div className={strategyBuilder_module_css_1.default.mediumSwapConfigDexContainer}>
              <img src="/lifi.svg" alt="" className={strategyBuilder_module_css_1.default.mediumSwapConfigTokenIcon} style={{ background: "#F5B5FF" }}/>
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigOnText}>LI.FI</div>
            </div>
          </div>
        </div>
        <div>
          <div className={strategyBuilder_module_css_1.default.mediumSwapSwappingContainer}>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumSwapConfigTokenDropdownContainer} whileHover={{
            backgroundColor: "rgba(5, 5, 5, 0.6)",
            transition: { duration: 0.1 },
        }} onClick={() => setIsTokenModalOpen("from")}>
              {chosenFromToken && (<div>
                  <div className={strategyBuilder_module_css_1.default.mediumSwapConfigPriceContainer}>
                    $2.414
                  </div>
                  <img src={chosenFromToken.logo} alt="" className={strategyBuilder_module_css_1.default.mediumSwapConfigTokenIcon} style={{ marginBottom: "16px" }}/>
                </div>)}
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigOffText} style={chosenFromToken ? { top: "181px" } : { top: "175px" }}>
                From
              </div>
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigOnText} style={!chosenFromToken
            ? { color: "#676771", marginTop: "6px" }
            : { marginLeft: "-20px" }}>
                {!chosenFromToken ? "Choose Token" : chosenFromToken.symbol}
              </div>

              <img src="/dropdownarrowdown.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownArrow} style={{
            top: "-1px",
            left: chosenFromToken ? "-56px" : "-86px",
            position: "relative",
        }}/>
            </framer_motion_1.motion.div>
            <div className={strategyBuilder_module_css_1.default.mediumSwapConfigPairDetailsContainer}>
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigSwapElipse}>
                <img src="/configswapicon.svg" alt="" className={strategyBuilder_module_css_1.default.mediumSwapConfigSwapIcon}/>
              </div>
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigPairDetailsLine}></div>
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigPairDetailsText}>
                1 CAKE = 1 BNB
              </div>
            </div>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumSwapConfigTokenDropdownContainer} style={{ marginTop: "0px" }} onClick={() => setIsTokenModalOpen("to")}>
              {chosenToToken && (<div>
                  <div className={strategyBuilder_module_css_1.default.mediumSwapConfigPriceContainer}>
                    $2.414
                  </div>
                  <img src={chosenToToken.logo} alt="" className={strategyBuilder_module_css_1.default.mediumSwapConfigTokenIcon} style={{ marginBottom: "16px" }}/>
                </div>)}
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigOffText} style={chosenToToken ? { top: "210.5" } : { top: "287px" }}>
                To
              </div>
              <div className={strategyBuilder_module_css_1.default.mediumSwapConfigOnText} style={!chosenToToken
            ? { color: "#676771", marginTop: "6px" }
            : { marginLeft: "-20px" }}>
                {!chosenToToken ? "Choose Token" : chosenToToken.symbol}
              </div>
              <img src="/dropdownarrowdown.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigDropdownArrow} style={{
            top: "-1px",
            left: chosenToToken ? "-56px" : "-86px",
            position: "relative",
        }}/>
            </framer_motion_1.motion.div>
          </div>
        </div>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigCancelAction} onClick={() => handleCancelClick()}>
          <div className={strategyBuilder_module_css_1.default.mediumConfigCancelActionText}>
            Cancel Action
          </div>
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigDoneButton} variants={MotionVariants_1.ButtonVariants} initial="normal" whileHover="hover" onClick={chosenFromToken && chosenToToken
            ? () => assembleStep()
            : (e) => setOpenHoverDetails({
                top: e.clientY + window.scrollY,
                left: e.clientX,
                text: `${chosenFromToken.symbol + " -> " + chosenToToken.symbol}`,
            })} style={{ position: "absolute" }}>
          Add +
        </framer_motion_1.motion.div>
      </div>
    </div>);
};
exports.MediumConfig = MediumConfig;
const SwapConfig = (props) => {
    const { size, style, stepId } = props;
    return (<div>
      {size === Enums_1.SizingEnum.MEDIUM ? (<exports.MediumConfig style={style} stepAssemblyHandler={props.stepAssemblyHandler} stepId={stepId} setNodeProcessStep={props.setNodeProcessStep}/>) : (<h1 style={{ color: "white" }}>LOOOOOOOSER </h1>)}
    </div>);
};
exports.SwapConfig = SwapConfig;
//# sourceMappingURL=Swap.js.map