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
exports.EditPercentageModal = exports.EditDistributionModal = void 0;
const react_1 = __importStar(require("react"));
const editDistribution_module_css_1 = __importDefault(require("./css/editDistribution.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const CustomArgs_1 = require("./StrategyBuilder/Configs/CustomArgs");
const HoverDetails_1 = require("HoverDetails");
const EditDistributionModal = (props) => {
    const { setDivisor } = props;
    const { showPercentageBox, setShowPercentageBox, handleBaseStepAdd } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const [customPercentage, setCustomPercentage] = (0, react_1.useState)(0);
    const [currentChoice, setCurrentChoice] = (0, react_1.useState)(100);
    const [additionalArgsOpen, setAdditionalArgsOpen] = (0, react_1.useState)(false);
    const [additionalArgsAdded, setAdditionalArgsAdded] = (0, react_1.useState)(false);
    const [hoverDetailsOpen, setHoverDetailsOpen] = (0, react_1.useState)(false);
    // Refs
    const chooseBtnRef = (0, react_1.useRef)();
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
    const handleClick = (e) => {
        if (showPercentageBox.additional_args.length <= 0) {
            handleBaseStepAdd(showPercentageBox, currentChoice !== 110 ? currentChoice : customPercentage, null);
        }
        else {
            if (additionalArgsAdded) {
                handleBaseStepAdd(showPercentageBox, currentChoice !== 110 ? currentChoice : customPercentage, additionalArgsAdded);
            }
            else {
                setHoverDetailsOpen({
                    top: chooseBtnRef.current.getBoundingClientRect().top,
                    left: chooseBtnRef.current.getBoundingClientRect().left,
                    text: "Please add the required additional arguments",
                });
            }
        }
    };
    (0, react_1.useEffect)(() => {
        console.log("UseEffect Lalalala", showPercentageBox.additional_args, "Additioan largs");
        if (showPercentageBox.additional_args &&
            showPercentageBox.additional_args.length > 0) {
            setAdditionalArgsOpen(true);
        }
    }, [JSON.stringify(showPercentageBox)]);
    const ArgsModalHandler = (args) => {
        if (args.length == showPercentageBox.additional_args.length) {
            setAdditionalArgsOpen(false);
            setAdditionalArgsAdded(args);
        }
    };
    return (<div style={{ height: "0px", width: "0px" }}>
      {hoverDetailsOpen && (<HoverDetails_1.HoverDetails top={hoverDetailsOpen.top} left={hoverDetailsOpen.left} text={hoverDetailsOpen.text}/>)}
      {additionalArgsOpen && (<CustomArgs_1.CustomArgs handler={ArgsModalHandler} customArgs={showPercentageBox.additional_args} style={{
                top: `${showPercentageBox.mouse_location.height - 560}px`,
                left: `${showPercentageBox.mouse_location.width - 689}px`,
                position: "absolute",
                zIndex: 10000,
            }}/>)}
      {showPercentageBox && (<div className={editDistribution_module_css_1.default.modalBody} onClick={(e) => e.stopPropagation()} style={{
                top: `${showPercentageBox.mouse_location.height - 260}px`,
                left: `${showPercentageBox.mouse_location.width - 289}px`,
                zIndex: `100`,
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
          <framer_motion_1.motion.button className={editDistribution_module_css_1.default.chooseBtn} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }} onClick={(e) => handleClick(e)} ref={chooseBtnRef}>
            Choose
          </framer_motion_1.motion.button>
        </div>)}
    </div>);
};
exports.EditDistributionModal = EditDistributionModal;
const EditPercentageModal = (props) => {
    const { setPercentage, locationDetails } = props;
    const [customPercentage, setCustomPercentage] = (0, react_1.useState)(0);
    const [currentChoice, setCurrentChoice] = (0, react_1.useState)(100);
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
            top: `${locationDetails.mouse_location.height - 160}px`,
            left: `${locationDetails.mouse_location.width - 290}px`,
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
        <framer_motion_1.motion.button className={editDistribution_module_css_1.default.chooseBtn} whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }} onClick={() => setPercentage(currentChoice !== 110 ? currentChoice : customPercentage)}>
          Choose
        </framer_motion_1.motion.button>
      </div>
    </div>);
};
exports.EditPercentageModal = EditPercentageModal;
//# sourceMappingURL=editDistribution.js.map