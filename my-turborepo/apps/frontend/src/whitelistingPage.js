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
exports.WhitelistingPage = void 0;
const landingPage_module_css_1 = __importDefault(require("./css/landingPage.module.css"));
const react_1 = __importStar(require("react"));
const utils_1 = require("utils/utils");
const framer_motion_1 = require("framer-motion");
const wagmi_1 = require("wagmi");
const LandingPage_1 = require("./LandingPage");
const SignupModal_1 = require("./SignupModal");
const LandingPage_2 = require("./LandingPage");
const WhitelistingPage = (props) => {
    let SignupStateEnum;
    (function (SignupStateEnum) {
        SignupStateEnum[SignupStateEnum["NOT_SIGNED_UP"] = 0] = "NOT_SIGNED_UP";
        SignupStateEnum[SignupStateEnum["NOT_CONNECTED"] = 1] = "NOT_CONNECTED";
        SignupStateEnum[SignupStateEnum["SIGNED_UP"] = 2] = "SIGNED_UP";
    })(SignupStateEnum || (SignupStateEnum = {}));
    let ColorState;
    (function (ColorState) {
        ColorState["NOT_SIGNED_UP"] = "linear-gradient(90deg, rgb(153, 88, 34) 0%,rgba(153, 88, 34) 100%)";
        ColorState["NOT_CONNECTED"] = "linear-gradient(90deg, rgb(0, 178, 236) 0%, rgb(217, 202, 15) 100%)";
        ColorState["SIGNED_UP"] = "linear-gradient(90deg, rgb(102, 159, 42) 0%, rgb(102, 159, 42) 100%)";
    })(ColorState || (ColorState = {}));
    let TitleStates;
    (function (TitleStates) {
        TitleStates["NOT_SIGNED_UP"] = "Nope! :(";
        TitleStates["NOT_CONNECTED"] = "Connect Your Wallet To See If You Are Whitelisted \uD83D\uDC40";
        TitleStates["SIGNED_UP"] = "Signed Up! \u2705";
    })(TitleStates || (TitleStates = {}));
    let subTitleStates;
    (function (subTitleStates) {
        subTitleStates["NOT_SIGNED_UP"] = "Sign Up To Get In ASAP, We\u2019re Waiting For You <3";
        subTitleStates["NOT_CONNECTED"] = "we are currently running on a private testing phase, so you've got to whitelist (sorry!)";
        subTitleStates["SIGNED_UP"] = "You're all set!";
    })(subTitleStates || (subTitleStates = {}));
    const { address, isConnected, isDisconnected } = (0, wagmi_1.useAccount)();
    const [signupState, setSignupState] = (0, react_1.useState)(SignupStateEnum.NOT_CONNECTED);
    const [colorState, setColorState] = (0, react_1.useState)(ColorState.NOT_CONNECTED);
    const [subTitleState, setSubtitleState] = (0, react_1.useState)(subTitleStates.NOT_CONNECTED);
    const [titleState, setTitleState] = (0, react_1.useState)(TitleStates.NOT_CONNECTED);
    const handleUserUpdate = async () => {
        if (!isConnected) {
            setSignupState(SignupStateEnum.NOT_CONNECTED);
        }
        else {
            if (await (0, utils_1.isSignedUp)("shitemail", address)) {
                setSignupState(SignupStateEnum.SIGNED_UP);
            }
            else {
                setSignupState(SignupStateEnum.NOT_SIGNED_UP);
            }
        }
    };
    (0, react_1.useEffect)(() => {
        handleUserUpdate();
    }, [address, isConnected, isDisconnected]);
    (0, react_1.useEffect)(() => {
        switch (signupState) {
            case SignupStateEnum.NOT_SIGNED_UP:
                setColorState(ColorState.NOT_SIGNED_UP);
                setTitleState(TitleStates.NOT_SIGNED_UP);
                setSubtitleState(subTitleStates.NOT_SIGNED_UP);
                break;
            case SignupStateEnum.NOT_CONNECTED:
                setColorState(ColorState.NOT_CONNECTED);
                setTitleState(TitleStates.NOT_CONNECTED);
                setSubtitleState(subTitleStates.NOT_CONNECTED);
                break;
            case SignupStateEnum.SIGNED_UP:
                setColorState(ColorState.SIGNED_UP);
                setTitleState(TitleStates.SIGNED_UP);
                setSubtitleState(subTitleStates.SIGNED_UP);
                break;
        }
    }, [signupState]);
    const [modalOpen, setModalOpen] = (0, react_1.useState)(false);
    const [windowSize, setWindowSize] = (0, react_1.useState)({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const changeDimensions = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    (0, react_1.useEffect)(() => {
        window.addEventListener("resize", changeDimensions);
        return () => {
            window.removeEventListener("resize", changeDimensions);
        };
    }, [windowSize]);
    return (<div>
      <LandingPage_2.LandingHeader width={windowSize.width}/>

      {modalOpen && <SignupModal_1.SignUpModal handler={setModalOpen} theme={"light"}/>}
      <div className={landingPage_module_css_1.default.whitelistingPage}>
        <div className={landingPage_module_css_1.default.whitelistingPageTextContainer}>
          <div className={landingPage_module_css_1.default.whitelistingPageTitleText}>{titleState} </div>
          <div className={landingPage_module_css_1.default.whitelistingPageSubtitleText}>
            {subTitleState}
          </div>
          {signupState === SignupStateEnum.SIGNED_UP && (<div className={landingPage_module_css_1.default.whitelistingPageDescriptionText}>
              Feel free to add additional contact info & share this page with
              others to bump your spot up the list
            </div>)}
        </div>
        <div className={landingPage_module_css_1.default.whitelistingPageBottomContainer}>
          <div style={{
            zIndex: 2,
        }}>
            <LandingPage_1.ConnectWalletButtonCustom showNetwork={false} whenConnected="signup" theme={"light"} modalHandler={setModalOpen} modalStatus={modalOpen}/>
          </div>
        </div>
        <framer_motion_1.motion.div className={landingPage_module_css_1.default.whitelistingPageBottomBlur} layout animate={{
            backgroundImage: colorState,
        }} transition={{
            duration: 3,
        }}></framer_motion_1.motion.div>
      </div>
    </div>);
};
exports.WhitelistingPage = WhitelistingPage;
//# sourceMappingURL=whitelistingPage.js.map