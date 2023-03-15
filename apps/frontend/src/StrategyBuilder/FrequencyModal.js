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
exports.StaticFrequencyModal = exports.FrequencyModal = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("../Contexts/DatabaseContext");
const HoverDetails_1 = require("../HoverDetails");
const utils_1 = require("../utils/utils");
const FrequencyModal = (props) => {
    const { executionIntrval, setExecutionInterval } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { modalHandler } = props;
    // Refs
    let saveBtnRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    let inputRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    let dropdownRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    let cancelBtnRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    const [currentInput, setCurrentInput] = (0, react_1.useState)(executionIntrval ? (0, utils_1.rawCalcInterval)(executionIntrval).interval : null);
    const [currentTimestamp, setCurrentTimestamp] = (0, react_1.useState)(executionIntrval ? (0, utils_1.rawCalcInterval)(executionIntrval).unit : "days");
    const [dropdownOpen, setDropdownOpen] = (0, react_1.useState)(false);
    const [hoverDetailsOpen, setHoverDetailsOpen] = (0, react_1.useState)(false);
    const handleSave = () => {
        if (!currentInput) {
            setHoverDetailsOpen({
                top: saveBtnRef.current.offsetTop,
                left: saveBtnRef.current.offsetLeft - 50,
                text: "You have not defined a valid input",
            });
            setTimeout(() => {
                setHoverDetailsOpen(false);
            }, 2000);
            return;
        }
        const intervalInSeconds = (0, utils_1.calcIntervalToSeconds)(currentInput, currentTimestamp);
        setExecutionInterval(intervalInSeconds);
        modalHandler(false);
    };
    const handleIntervalChoice = (interval) => {
        setCurrentTimestamp(interval);
        setDropdownOpen(false);
    };
    return (<div className={strategyBuilder_module_css_1.default.frequencyModalBlurWrapper} onClick={() => modalHandler(false)}>
      <div className={strategyBuilder_module_css_1.default.frequencyModalBody} onClick={(e) => e.stopPropagation()}>
        {hoverDetailsOpen && (<HoverDetails_1.HoverDetails top={hoverDetailsOpen.top} left={hoverDetailsOpen.left} text={hoverDetailsOpen.text}/>)}
        {dropdownOpen && (<div className={strategyBuilder_module_css_1.default.frequencyModalDropdownContainer}>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("minutes")}>
              <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>
                Minutes
              </div>
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("hours")}>
              <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Hours</div>
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("days")}>
              <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Days</div>
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("weeks")}>
              <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Weeks</div>
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("months")}>
              {" "}
              <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Months</div>
            </framer_motion_1.motion.div>
          </div>)}
        <div className={strategyBuilder_module_css_1.default.frequencyModalRightContainer}>
          <div className={strategyBuilder_module_css_1.default.frequencyModalGrayCircle}>
            <img src="/checkimage.svg" alt="" className={strategyBuilder_module_css_1.default.frequencyModalCheckImage}/>
          </div>
        </div>
        <div className={strategyBuilder_module_css_1.default.frequencyModalLeftContainer}>
          <div className={strategyBuilder_module_css_1.default.frequencyModalTextContainer}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalTitleText}>
              {`Strategy Created 
              `}
              {`Successfully`}
            </div>
            <div className={strategyBuilder_module_css_1.default.frequencyModalDescriptionText}>{`Choose How frequently you'd like the strategy to run
                        
                        e.g, every 5 days, every 3.8 hours, etc.`}</div>
          </div>
          <div className={strategyBuilder_module_css_1.default.frequencyModalBottomContainer}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalInputFlex}>
              <div className={strategyBuilder_module_css_1.default.frequencyModalInputTitle}>Frequency</div>
              <div className={strategyBuilder_module_css_1.default.frequencyModalInputFlexRow}>
                <input className={strategyBuilder_module_css_1.default.frequencyModalInput} placeholder="Enter Number" type="number" onChange={(e) => setCurrentInput(e.target.value)}/>
                <div className={strategyBuilder_module_css_1.default.frequencyModalInputTimestampsContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className={strategyBuilder_module_css_1.default.frequencyModalInputTimestampsText}>
                    {currentTimestamp.split("")[0].toUpperCase() +
            currentTimestamp.slice(1)}
                  </div>
                  <img src="/arrowdownfrequency.svg" alt="" className={strategyBuilder_module_css_1.default.frequencyModalInputTImestampsArrowDown}/>
                </div>
              </div>
            </div>
            <div className={strategyBuilder_module_css_1.default.frequencyModalButtonsFlexRow}>
              <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalCancelButton} whileHover={{ scale: 1.05 }}>
                Cancel
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalSaveButton} whileHover={{ scale: 1.05 }} onClick={() => handleSave()} ref={saveBtnRef}>
                Save
              </framer_motion_1.motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.FrequencyModal = FrequencyModal;
exports.StaticFrequencyModal = react_1.default.forwardRef((props, ref) => {
    const { executionIntrval, setExecutionInterval } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { modalHandler } = props;
    // Refs
    let saveBtnRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    let inputRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    let dropdownRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    let cancelBtnRef = (0, react_1.useRef)({ offsetTop: 0, offsetLeft: 0 });
    const [currentInput, setCurrentInput] = (0, react_1.useState)(executionIntrval ? (0, utils_1.rawCalcInterval)(executionIntrval).interval : null);
    const [currentTimestamp, setCurrentTimestamp] = (0, react_1.useState)(executionIntrval ? (0, utils_1.rawCalcInterval)(executionIntrval).unit : "days");
    const [dropdownOpen, setDropdownOpen] = (0, react_1.useState)(false);
    const [hoverDetailsOpen, setHoverDetailsOpen] = (0, react_1.useState)(false);
    const handleSave = () => {
        if (!currentInput) {
            setHoverDetailsOpen({
                top: saveBtnRef.current.offsetTop,
                left: saveBtnRef.current.offsetLeft - 50,
                text: "You have not defined a valid input",
            });
            setTimeout(() => {
                setHoverDetailsOpen(false);
            }, 2000);
            return;
        }
        const intervalInSeconds = (0, utils_1.calcIntervalToSeconds)(currentInput, currentTimestamp);
        setExecutionInterval(intervalInSeconds);
        modalHandler(false);
    };
    const handleIntervalChoice = (interval) => {
        setCurrentTimestamp(interval);
        setDropdownOpen(false);
    };
    return (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalBody} onClick={(e) => e.stopPropagation()} style={props.style} variants={props.variants} animate={props.animationConiditon} transition={{
            duration: 1,
        }} ref={ref}>
      {hoverDetailsOpen && (<HoverDetails_1.HoverDetails top={hoverDetailsOpen.top} left={hoverDetailsOpen.left} text={hoverDetailsOpen.text}/>)}
      {dropdownOpen && (<div className={strategyBuilder_module_css_1.default.frequencyModalDropdownContainer}>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("minutes")}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Minutes</div>
          </framer_motion_1.motion.div>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("hours")}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Hours</div>
          </framer_motion_1.motion.div>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("days")}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Days</div>
          </framer_motion_1.motion.div>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("weeks")}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Weeks</div>
          </framer_motion_1.motion.div>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRow} whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
            }} onClick={(e) => handleIntervalChoice("months")}>
            {" "}
            <div className={strategyBuilder_module_css_1.default.frequencyModalDropdownRowText}>Months</div>
          </framer_motion_1.motion.div>
        </div>)}
      <div className={strategyBuilder_module_css_1.default.frequencyModalRightContainer}>
        <div className={strategyBuilder_module_css_1.default.frequencyModalGrayCircle} style={{ left: "150%", top: "80%" }}>
          <img src="/checkimage.svg" alt="" className={strategyBuilder_module_css_1.default.frequencyModalCheckImage}/>
        </div>
      </div>
      <div className={strategyBuilder_module_css_1.default.frequencyModalLeftContainer}>
        <div className={strategyBuilder_module_css_1.default.frequencyModalTextContainer}>
          <div className={strategyBuilder_module_css_1.default.frequencyModalTitleText}>
            {`Strategy Created 
              `}
            {`Successfully`}
          </div>
          <div className={strategyBuilder_module_css_1.default.frequencyModalDescriptionText}>{`Choose How frequently you'd like the strategy to run
                        
                        e.g, every 5 days, every 3.8 hours, etc.`}</div>
        </div>
        <div className={strategyBuilder_module_css_1.default.frequencyModalBottomContainer} style={{ marginTop: "-90px" }}>
          <div className={strategyBuilder_module_css_1.default.frequencyModalInputFlex}>
            <div className={strategyBuilder_module_css_1.default.frequencyModalInputTitle}>Frequency</div>
            <div className={strategyBuilder_module_css_1.default.frequencyModalInputFlexRow}>
              <input className={strategyBuilder_module_css_1.default.frequencyModalInput} placeholder="Enter Number" type="number" onChange={(e) => setCurrentInput(e.target.value)}/>
              <div className={strategyBuilder_module_css_1.default.frequencyModalInputTimestampsContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className={strategyBuilder_module_css_1.default.frequencyModalInputTimestampsText}>
                  {currentTimestamp.split("")[0].toUpperCase() +
            currentTimestamp.slice(1)}
                </div>
                <img src="/arrowdownfrequency.svg" alt="" className={strategyBuilder_module_css_1.default.frequencyModalInputTImestampsArrowDown}/>
              </div>
            </div>
          </div>
          <div className={strategyBuilder_module_css_1.default.frequencyModalButtonsFlexRow}>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalCancelButton} whileHover={{ scale: 1.05 }}>
              Cancel
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.frequencyModalSaveButton} whileHover={{ scale: 1.05 }} onClick={() => handleSave()} ref={saveBtnRef}>
              Save
            </framer_motion_1.motion.div>
          </div>
        </div>
      </div>
    </framer_motion_1.motion.div>);
});
//# sourceMappingURL=FrequencyModal.js.map