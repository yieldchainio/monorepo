"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const Button = (props) => {
    const [args, setArgs] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (props.onClickArgs !== undefined)
            setArgs(props.onClickArgs);
        else
            setArgs([]);
    }, [JSON.stringify(props.onClickArgs)]);
    return (<framer_motion_1.motion.div className={maincss_module_css_1.default.button} onClick={() => props.onClick(...args)} whileHover={{
            backgroundColor: "rgb(222, 222, 222)",
            scale: 1.02,
        }} style={props.style} whileTap={{
            scale: 0.95,
        }} transition={{
            duration: 0.1,
        }}>
      {props.text}
    </framer_motion_1.motion.div>);
};
exports.Button = Button;
//# sourceMappingURL=Button.js.map