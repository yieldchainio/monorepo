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
exports.NetworkChip = void 0;
const react_1 = __importStar(require("react"));
const protocolpools_module_css_1 = __importDefault(require("./css/protocolpools.module.css"));
const framer_motion_1 = require("framer-motion");
const fast_average_color_1 = require("fast-average-color");
const NetworkChip = (props) => {
    const [dominantColor, setDominantColor] = (0, react_1.useState)(undefined);
    const fac = new fast_average_color_1.FastAverageColor();
    const getColor = async () => {
        let domColor = await fac
            .getColorAsync(props.networkDetails.logo)
            .then((color) => {
            if (dominantColor == undefined) {
                setDominantColor(color);
            }
            else {
                let someArr = dominantColor.hex
                    .split("")
                    .filter((item, index) => index > 2);
                someArr.unshift("#", "0", "0");
                someArr.push("6", "0");
                let modDomColor = someArr.join("");
            }
        });
    };
    getColor();
    const [isClicked, setIsClicked] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        getStyle();
    }, [props.clickHandler]);
    const getStyle = () => {
        let i = [];
        props.clickHandler.forEach((v, k) => i.push(v));
        if (isClicked == true) {
            if (dominantColor !== undefined &&
                props.networkDetails.chain_id !== -500) {
                return {
                    borderWidth: "1px",
                    borderStyle: "solid",
                    color: "white",
                    borderColor: dominantColor !== undefined ? dominantColor.hex : "transparent",
                };
            }
            else if (props.networkDetails.chain_id == -500) {
                if (i.includes(true) == false) {
                    return {
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "transparent",
                        background: "linear-gradient(black, black) padding-box, linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
                        color: "white",
                    };
                }
                else {
                    return { border: "0px solid transparent" };
                }
            }
        }
        else if (props.networkDetails.chain_id == -500) {
            if (i.includes(true) == false) {
                return {
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "transparent",
                    background: "linear-gradient(black, black) padding-box, linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
                    color: "white",
                };
            }
            else {
                return { border: "0px solid transparent" };
            }
        }
    };
    const onClickHandler = () => {
        isClicked == false ? setIsClicked(true) : setIsClicked(false);
        isClicked == false
            ? props.clickHandler.set(props.networkDetails.chain_id, false)
            : props.clickHandler.set(props.networkDetails.chain_id, true);
        getStyle();
    };
    return (<framer_motion_1.motion.div className={protocolpools_module_css_1.default.networkChip} onClick={() => {
            onClickHandler();
        }} whileTap={{ scale: 0.975 }} style={getStyle()}>
      <img src={props.networkDetails.logo} alt="" className={protocolpools_module_css_1.default.networkChipImg}/>
      <div className={protocolpools_module_css_1.default.networkChipText}>{props.networkDetails.name}</div>
    </framer_motion_1.motion.div>);
};
exports.NetworkChip = NetworkChip;
//# sourceMappingURL=networkchip.js.map