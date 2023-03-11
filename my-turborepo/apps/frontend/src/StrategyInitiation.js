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
exports.StrategyInitiation = void 0;
const react_1 = __importStar(require("react"));
const strategyInitiation_module_css_1 = __importDefault(require("./css/strategyInitiation.module.css"));
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const TokenSwapModal_1 = require("TokenSwapModal");
const StrategyInitiation = (props) => {
    /***************************************************************************
     * Navigation Decleration
     **************************************************************************/
    const navigate = (0, react_router_dom_1.useNavigate)();
    /***************************************************************************
     * @Strategy - Current Session's Strategy Context
     **************************************************************************/
    const { strategyName, setStrategyName, depositToken, setDepositToken, setShowPercentageBox, showPercentageBox, strategyProcessLocation, setStrategyProcessLocation, StrategyProcessSteps, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    /**************************************************************************
     * @Database - Database Context
     *************************************************************************/
    const { fullProtocolsList, fullAddressesList, fullTokensList, fullNetworksList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, accountAddress, setAccountAddress, baseStrategyABI, erc20ABI, provider, signer, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    /**
     * @Styling States
     */
    const [isHoveringBack, setIsHoveringBack] = (0, react_1.useState)(false);
    const [dropdownStatus, setDropdownStatus] = (0, react_1.useState)(false);
    const [isHoveringDropdown, setIsHoveringDropdown] = (0, react_1.useState)(false);
    /**
     * @StrategyUtility States
     */
    const [name, setName] = (0, react_1.useState)(undefined);
    const [localDepositToken, setlocalDepositToken] = (0, react_1.useState)(undefined);
    /**
     * @Styling Functions
     */
    const handleTokenDropDown = () => {
        setDropdownStatus(!dropdownStatus);
    };
    const handleProceed = () => {
        setStrategyName(name);
        setDepositToken(localDepositToken);
        navigate("/protocols");
        setStrategyProcessLocation(StrategyProcessSteps.BASE_STRATEGY);
    };
    (0, react_1.useEffect)(() => {
        if (!strategyName) {
            setStrategyName("Do Kwon Ate My Homework");
            setStrategyProcessLocation(StrategyProcessSteps.INITIALLIZING);
        }
    }, [strategyName]);
    return (<div style={{ overflow: "hidden" }}>
      {!dropdownStatus ? null : (<TokenSwapModal_1.TokenSwapModal handleModal={setDropdownStatus} titleText={"Select Deposit Token"} choiceHandler={setlocalDepositToken} onClick={() => {
                setShowPercentageBox(true);
            }} isStrategy={false}/>)}
      <div className={strategyInitiation_module_css_1.default.background} style={{ overflow: "hidden" }}>
        <div className={strategyInitiation_module_css_1.default.topColorElipse} style={{ overflow: "hidden" }}></div>
        <div className={strategyInitiation_module_css_1.default.bottomColorElipse} style={{ overflow: "hidden" }}></div>
        <framer_motion_1.motion.div className={strategyInitiation_module_css_1.default.bacBtnContainer} style={{ overflow: "hidden" }} onClick={() => navigate("/")}>
          <framer_motion_1.motion.div className={strategyInitiation_module_css_1.default.backBtnText} layout style={isHoveringBack ? { scale: 1.05 } : { scale: 1 }} onMouseEnter={() => setIsHoveringBack(true)} onMouseLeave={() => setIsHoveringBack(false)}>
            Back
          </framer_motion_1.motion.div>
          <framer_motion_1.motion.img layout src="/leftarrowback.svg" alt="" className={strategyInitiation_module_css_1.default.backBtnArrow} style={isHoveringBack ? { scale: 1.05 } : { scale: 1 }} onMouseEnter={() => setIsHoveringBack(true)} onMouseLeave={() => setIsHoveringBack(false)}/>
        </framer_motion_1.motion.div>
        <img src="/ycsinglelogo.svg" alt="" className={strategyInitiation_module_css_1.default.ycLogo} style={{ overflow: "hidden" }}/>
        <div className={strategyInitiation_module_css_1.default.headText} style={{ overflow: "hidden" }}>
          Lets get started 👋🏽
        </div>
        <div className={strategyInitiation_module_css_1.default.descriptionText}>
          Lets begin building your vault - Enter The Details Requested Below!
        </div>
        <div>
          <div className={strategyInitiation_module_css_1.default.depositTokenTitle}>Deposit Token</div>
          <div className={strategyInitiation_module_css_1.default.depositTokenDescription}>
            This Is The Token You & Other Users Will Deposit Into Your Vault
          </div>
        </div>
        <framer_motion_1.motion.div className={strategyInitiation_module_css_1.default.chooseTokenContainer} onClick={() => handleTokenDropDown()} onMouseEnter={() => setIsHoveringDropdown(true)} onMouseLeave={() => setIsHoveringDropdown(false)} style={isHoveringDropdown ? { opacity: 0.8 } : {}}>
          {!localDepositToken ? (<framer_motion_1.motion.div className={strategyInitiation_module_css_1.default.chooseTokenPlaceHolderText} onClick={() => handleTokenDropDown()} style={isHoveringDropdown ? { opacity: 0.8 } : {}} onMouseEnter={() => setIsHoveringDropdown(true)} onMouseLeave={() => setIsHoveringDropdown(false)}>
              Choose Token
            </framer_motion_1.motion.div>) : (<div>
              <framer_motion_1.motion.img src={localDepositToken.logo} alt="" onClick={() => handleTokenDropDown()} style={isHoveringDropdown ? { opacity: 0.8 } : {}} onMouseEnter={() => setIsHoveringDropdown(true)} onMouseLeave={() => setIsHoveringDropdown(false)} className={strategyInitiation_module_css_1.default.chooseTokenImg}/>
              <framer_motion_1.motion.div className={strategyInitiation_module_css_1.default.chooseTokenPlaceHolderText} onClick={() => handleTokenDropDown()} style={isHoveringDropdown
                ? { opacity: 0.8, left: "25px" }
                : { left: "25px" }} onMouseEnter={() => setIsHoveringDropdown(true)} onMouseLeave={() => setIsHoveringDropdown(false)}>
                {localDepositToken.symbol}
              </framer_motion_1.motion.div>
            </div>)}

          <framer_motion_1.motion.img src="/arrowdowndropdown.svg" alt="" className={strategyInitiation_module_css_1.default.chooseTokenDropdownArrow} onClick={() => handleTokenDropDown()} onMouseEnter={() => setIsHoveringDropdown(true)} onMouseLeave={() => setIsHoveringDropdown(false)} style={isHoveringDropdown ? { opacity: 0.8 } : {}}/>
        </framer_motion_1.motion.div>
        <div className={strategyInitiation_module_css_1.default.strategyNameTitle}>Strategy Name</div>
        <div className={strategyInitiation_module_css_1.default.strategyNameDescription}>
          Give Your Strategy A Unique Name - One That Stands out! (Or Use The
          Default One Below)
        </div>
        <input type="text" className={strategyInitiation_module_css_1.default.strategyNameInputContainer} placeholder="Do Kwon Cum Farming" onChange={(event) => {
            setName(event.target.value);
        }}/>
      </div>
      <framer_motion_1.motion.button className={strategyInitiation_module_css_1.default.proceedBtn} style={localDepositToken
            ? {}
            : {
                background: "linear-gradient(90deg,  rgba(0, 178, 236, 0.3) 0%,  rgba(217, 202, 15, 0.3) 100%)",
                cursor: "default",
            }} onClick={() => handleProceed()} whileHover={localDepositToken
            ? {
                background: "linear-gradient(black, black) padding-box,linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
                border: "1px solid transparent",
                color: "white",
            }
            : {}} whileTap={localDepositToken ? { scale: 0.95 } : {}}>
        {localDepositToken ? "Continue" : "Choose Deposit Token"}
      </framer_motion_1.motion.button>
    </div>);
};
exports.StrategyInitiation = StrategyInitiation;
//# sourceMappingURL=StrategyInitiation.js.map