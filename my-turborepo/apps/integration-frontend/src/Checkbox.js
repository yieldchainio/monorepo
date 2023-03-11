"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = void 0;
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const react_1 = require("react");
const Checkbox = ({ choiceHandler, style, argsToInclude, checked, }) => {
    const [isChecked, setIsChecked] = (0, react_1.useState)(checked || false);
    const handleChoice = () => {
        let args = argsToInclude || [];
        choiceHandler(...args, !isChecked);
        setIsChecked(!isChecked);
    };
    return (<div className={maincss_module_css_1.default.checkBox} onClick={handleChoice} style={{
            ...style,
            backgroundImage: isChecked
                ? "linear-gradient(90deg, rgba(0, 178, 236) 0%,rgba(217, 202, 15) 100%)"
                : "none",
        }}>
      {isChecked && (<img src="/checkmark.svg" alt="" style={{ width: "40%", height: "40%" }}/>)}
    </div>);
};
exports.Checkbox = Checkbox;
//# sourceMappingURL=Checkbox.js.map