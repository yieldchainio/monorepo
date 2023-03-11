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
exports.EditDistributionModal = void 0;
const react_1 = __importStar(require("react"));
const editDistribution_module_css_1 = __importDefault(require("../css/editDistribution.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("../Contexts/DatabaseContext");
const utils_1 = require("../utils/utils");
const EditDistributionModal = (props) => {
    // Strategy Context
    const { strategySteps, setStrategySteps, actionableTokens, setActionableTokens, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    // Props
    const { parentId, childId, modalHandler, unusedPercentage } = props;
    const { setPercentage, locationDetails } = props;
    const [customPercentage, setCustomPercentage] = (0, react_1.useState)(0);
    const [currentChoice, setCurrentChoice] = (0, react_1.useState)(100);
    const handlePercentageChoice = async (percentage) => {
        // Setting the percentage to the unused percentage if the percentage is above the unused percentage.
        // (i.e , i there is 40% left, and the user tries to use 80% - we use 40% instead, as that is the maximum left)
        let isAboveLimit = percentage > unusedPercentage;
        if (isAboveLimit) {
            setPercentage(unusedPercentage);
            modalHandler(false);
            return;
        }
        // Index of the child step within the strategy Steps Array
        let childStepIndex = strategySteps.findIndex((_step) => _step.step_identifier == childId);
        // Index of parent step (to use for finding actionable tokens from outflows)
        let parentStepIndex = strategySteps.findIndex((_step) => _step.step_identifier == parentId);
        // Changing the percentage & divisors
        let tArr = [...strategySteps];
        tArr[childStepIndex].percentage = percentage;
        tArr[childStepIndex].divisor = await (0, utils_1.calcDivisor)(percentage);
        // Setting the strategy steps to the new array, closing the modal
        setStrategySteps(tArr);
        modalHandler(false);
        let tempActionableTokens = [...actionableTokens];
        if (unusedPercentage + percentage >= 100) {
            console.log("percentage has left, Iterating over parent tokens", strategySteps[parentStepIndex].inflows);
            for (const token of strategySteps[parentStepIndex].inflows) {
                let isInActionableTokens = tempActionableTokens.find((_token) => {
                    return (_token.token_identifier == token.token_details.token_identifier);
                });
                if (!isInActionableTokens) {
                    tempActionableTokens.push(token.token_details);
                }
            }
            if (tempActionableTokens.length > actionableTokens.length) {
                setActionableTokens(tempActionableTokens);
            }
        }
        console.log("Strategy Steps", strategySteps);
    };
    const handleCustomPercentage = (event) => {
        if (event > 100) {
            setCustomPercentage(100);
            return;
        }
        if (event < 0.1) {
            setCustomPercentage(0.1);
            return;
        }
        if (event > 0.1 && event < 100) {
            setCustomPercentage(event);
            return;
        }
    };
    return (<div style={{ height: "500px", width: "0px", zIndex: "999999999999999999" }}>
      <div className={editDistribution_module_css_1.default.modalBody} onClick={(e) => e.stopPropagation()} style={{
            top: `${locationDetails.top}px`,
            left: `${locationDetails.left}px`,
            zIndex: "999999999999999999999999999999999999",
            border: "1px solid rgba(255, 255, 255, 0.25)",
        }}>
        <div className={editDistribution_module_css_1.default.title}>Set % Of Deposit</div>
        <framer_motion_1.motion.button className={editDistribution_module_css_1.default.percentageBtn} key={25} onClick={() => setCurrentChoice(25)} style={currentChoice == 25 ? { border: "0.5px solid white" } : {}} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}>
          25%
        </framer_motion_1.motion.button>
        <framer_motion_1.motion.button className={editDistribution_module_css_1.default.percentageBtn} key={50} onClick={() => setCurrentChoice(50)} style={currentChoice == 50
            ? { border: "0.5px solid white", left: "66px" }
            : { left: "66px" }} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}>
          50%
        </framer_motion_1.motion.button>
        <framer_motion_1.motion.button className={editDistribution_module_css_1.default.percentageBtn} style={currentChoice == 75
            ? { border: "0.5px solid white", left: "116px" }
            : { left: "116px" }} key={75} onClick={() => setCurrentChoice(75)} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}>
          75%
        </framer_motion_1.motion.button>
        <framer_motion_1.motion.button className={editDistribution_module_css_1.default.percentageBtn} style={currentChoice == 100
            ? { border: "0.5px solid white", left: "166px" }
            : { left: "166px" }} key={100} onClick={() => setCurrentChoice(100)} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}>
          100%
        </framer_motion_1.motion.button>
        <framer_motion_1.motion.input type="number" className={editDistribution_module_css_1.default.customInput} placeholder="e.g 12" value={customPercentage} key={110} onChange={(e) => handleCustomPercentage(parseInt(e.target.value))} onClick={() => setCurrentChoice(110)} style={currentChoice == 110 ? { border: "0.5px solid white" } : {}} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}/>
        <div className={editDistribution_module_css_1.default.percentageSymbol}>%</div>
        <framer_motion_1.motion.button className={editDistribution_module_css_1.default.chooseBtn} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }} onClick={() => handlePercentageChoice(currentChoice !== 110 ? currentChoice : customPercentage)}>
          Choose
        </framer_motion_1.motion.button>
      </div>
    </div>);
};
exports.EditDistributionModal = EditDistributionModal;
//# sourceMappingURL=EditDistributionModal.js.map