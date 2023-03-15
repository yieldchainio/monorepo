"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = void 0;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const TextInput = (props) => {
    const [value, setValue] = (0, react_1.useState)(props.value || "");
    const { placeholder, type, inputChecker } = props;
    const handleChange = (e) => {
        setValue(e);
        let args = props.changeArgs ? props.changeArgs : [];
        props.onChange(e, ...args);
        console.log("Address Changed", e);
    };
    (0, react_1.useEffect)(() => {
        if (props.value !== undefined) {
            handleChange(props.value);
        }
    }, []);
    return (<div>
      <framer_motion_1.motion.input className={maincss_module_css_1.default.textBoxInput} placeholder={props.placeholder} value={value} onChange={(e) => handleChange(e.target.value)} type={type} style={props.style}/>
    </div>);
};
exports.TextInput = TextInput;
//# sourceMappingURL=TextInput.js.map