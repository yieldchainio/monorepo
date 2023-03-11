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
exports.CustomArgs = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const utils_js_1 = require("../../utils/utils.js");
const CustomArgInputField = (props) => {
    const { field, style, handler, handleOwnChoice, index } = props;
    const [solidityType, setSolidityType] = (0, react_1.useState)("");
    const [currentFieldType, setCurrentFieldType] = (0, react_1.useState)("text");
    const [currentFieldPlaceholder, setCurrentFieldPlaceholder] = (0, react_1.useState)("A Text field, e.g: 'Sam Bankman Fried'");
    const [currentFieldInput, setCurrentFieldInput] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setSolidityType(field.solidity_type);
    }, [field]);
    (0, react_1.useEffect)(() => {
        if (currentFieldInput !== null || undefined) {
            handleOwnChoice((prevState) => {
                let tArr = [...prevState];
                tArr = tArr.filter((item) => item !== undefined);
                tArr[index] = currentFieldInput;
                return tArr;
            });
        }
    }, [currentFieldInput]);
    (0, react_1.useEffect)(() => {
        if (solidityType) {
            if (solidityType.includes("string")) {
                setCurrentFieldType("text");
                setCurrentFieldPlaceholder("A Text field, e.g: 'Sam Bankman Fried'");
            }
            if (solidityType.includes("int")) {
                setCurrentFieldType("number");
                setCurrentFieldPlaceholder("A Number field, e.g: 100");
            }
            if (solidityType.includes("address")) {
                setCurrentFieldType("text");
                setCurrentFieldPlaceholder("An Address field, e.g: 0x1234567890");
            }
            if (solidityType.includes("bool")) {
                setCurrentFieldType("checkbox");
                setCurrentFieldPlaceholder("A Boolean field, e.g: true/false");
                setCurrentFieldInput(false);
            }
            if (solidityType.includes("bytes")) {
                setCurrentFieldType("text");
                setCurrentFieldPlaceholder("A Bytes field, e.g: 0x1234567890... (NOT AN ADDRESS)");
            }
        }
    }, [solidityType]);
    (0, react_1.useEffect)(() => {
        console.log(currentFieldInput);
    }, [currentFieldInput]);
    return (<div className={strategyBuilder_module_css_1.default.customArgsArgumentContainer} style={{ marginTop: field.index !== 0 ? "20px" : "-20px" }}>
      <div className={strategyBuilder_module_css_1.default.customArgsArgumentTitle}>
        {(0, utils_js_1.humanizeString)(field.name)}
      </div>
      {currentFieldType !== "checkbox" ? (<input className={strategyBuilder_module_css_1.default.customArgsArgumentInputContainer} type={currentFieldType} placeholder={currentFieldPlaceholder} onChange={(e) => setCurrentFieldInput(e.target.value)}/>) : (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.trueFalseSlider} onClick={() => setCurrentFieldInput(currentFieldInput ? false : true)} style={currentFieldInput
                ? {
                    background: "linear-gradient(90deg, #00B2EC 0%, #D9CA0F 100%)",
                }
                : {}} layout>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.trueFalseSliderCircleOff} style={currentFieldInput
                ? {
                    background: "linear-gradient(90deg, #68DAFF 0%, #FFF576 100%)",
                    border: "1px solid #000000",
                    marginLeft: "auto",
                }
                : {}} layout></framer_motion_1.motion.div>
        </framer_motion_1.motion.div>)}
    </div>);
};
const CustomArgs = (props) => {
    const { customArgs, handler } = props;
    const [customArgsState, setCustomArgsState] = (0, react_1.useState)([]);
    const handleComplete = () => {
        if (customArgsState.length == customArgs.length) {
            handler(customArgsState);
        }
        else {
            console.log("Not same length!!!", customArgs, "args", customArgsState, "state");
        }
    };
    return (<div className={strategyBuilder_module_css_1.default.customArgsContainer} style={props.style}>
      <div className={strategyBuilder_module_css_1.default.customArgsTitleContainer} style={{ marginBottom: "30px" }}>
        <div className={strategyBuilder_module_css_1.default.customArgsTitleTextOn}>Additional Inputs</div>
        <div className={strategyBuilder_module_css_1.default.customArgsTitleTextOff}>
          Your Choice Requires additional details, fill up the inputs below to
          continue
        </div>
      </div>
      {customArgs.map((arg, index) => {
            return (<CustomArgInputField field={arg} handleOwnChoice={setCustomArgsState} index={index}/>);
        })}
      <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.customArgsSetButton} whileHover={{
            scale: 1.1,
            filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.305))",
        }} onClick={() => handleComplete()}>
        Set
      </framer_motion_1.motion.div>
    </div>);
};
exports.CustomArgs = CustomArgs;
//# sourceMappingURL=CustomArgs.js.map