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
exports.SignUpModal = void 0;
const react_1 = __importStar(require("react"));
const landingPage_module_css_1 = __importDefault(require("./css/landingPage.module.css"));
const utils_1 = require("utils/utils");
const framer_motion_1 = require("framer-motion");
const axios_1 = __importDefault(require("axios"));
const wagmi_1 = require("wagmi");
const HoverDetails_1 = require("HoverDetails");
const SignUpModal = (props) => {
    const { handler } = props;
    const [emailInput, setEmailInput] = (0, react_1.useState)("");
    const { address } = (0, wagmi_1.useAccount)();
    const handleComplete = async () => {
        if ((0, utils_1.checkEmail)(emailInput)) {
            console.log("email valid");
            if (await (0, utils_1.isSignedUp)(emailInput, address)) {
                setHoveringDone("You've already signed up!");
                setTimeout(() => {
                    setHoveringDone(false);
                }, 2000);
                return;
            }
            await axios_1.default.post("https://api.yieldchain.io/signup", {
                email: emailInput,
                address: `${address}`,
            });
            setHoveringDone("Signed Up Successfully!");
            setTimeout(() => {
                setHoveringDone(false);
            }, 2000);
            handler(false);
        }
        else {
            setHoveringDone("Email Is Invalid, Try Again");
            setTimeout(() => {
                setHoveringDone(false);
            }, 2000);
        }
    };
    const buttonRef = (0, react_1.useRef)();
    const [hoveringDone, setHoveringDone] = (0, react_1.useState)(false);
    const { theme } = props;
    return (<div className={landingPage_module_css_1.default.signUpBlurWrapper} onClick={() => handler(false)}>
      {hoveringDone && (<HoverDetails_1.HoverDetails top={buttonRef.current.getBoundingClientRect().top - 5} left={buttonRef.current.getBoundingClientRect().left - 20} text={hoveringDone}/>)}
      <div className={landingPage_module_css_1.default.signUpModalBody} onClick={(e) => e.stopPropagation()} style={{
            backgroundImage: theme === "dark"
                ? "linear-gradient(95.87deg, rgba(53, 53, 53, 1) 100%, rgb(53, 53, 53, 1) 100%)"
                : "linear-gradient(95.87deg, rgba(219, 219, 219, 1) 100%, rgba(205, 205, 205, 1) 100%)",
        }}>
        <div className={landingPage_module_css_1.default.signUpModalTextFlex}>
          <div className={landingPage_module_css_1.default.signUpModalTitleText} style={{
            color: theme === "dark" ? "white" : "black",
        }}>
            Give Us A Way To Contact You
          </div>
          <div className={landingPage_module_css_1.default.signUpModalDescriptionText} style={{
            color: theme === "dark" ? "#676671" : "#202023",
        }}>
            We're gonna have to reach out one way or another, anon
          </div>
        </div>
        <div className={landingPage_module_css_1.default.signUpModalBottomFlex}>
          <div className={landingPage_module_css_1.default.signUpModalEmailFlex}>
            <div className={landingPage_module_css_1.default.signUpModalEmailTitleText} style={{
            color: theme === "dark" ? "#676671" : "#202023",
        }}>
              Email:
            </div>
            <input className={landingPage_module_css_1.default.signUpModalEmailInputContainer} placeholder="e.g: SBFxxxCaroline@ftx.com" onChange={(e) => setEmailInput(e.target.value)} style={{
            background: theme === "dark" ? "#111111" : "white",
            borderColor: theme === "dark" ? "#363636" : "#DCDCDC",
        }}/>
          </div>
          <framer_motion_1.motion.div className={landingPage_module_css_1.default.signUpModalButton} whileHover={{ scale: 1.05 }} onClick={() => handleComplete()} ref={buttonRef}>
            Done
          </framer_motion_1.motion.div>
        </div>
      </div>
    </div>);
};
exports.SignUpModal = SignUpModal;
//# sourceMappingURL=SignupModal.js.map