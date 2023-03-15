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
exports.ChooseTokenModal = void 0;
const react_1 = __importStar(require("react"));
const chooseToken_module_css_1 = __importDefault(require("./css/chooseToken.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const ChooseTokenModal = (props) => {
    /***************************************************************************
     * @Strategy - Current Session's Strategy Context
     **************************************************************************/
    /**************************************************************************
     * @Database - Database Context
     *************************************************************************/
    const { fullProtocolsList, fullAddressesList, fullTokensList, fullNetworksList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, accountAddress, setAccountAddress, baseStrategyABI, erc20ABI, provider, signer, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    /**
     * Keeps Track Of The Input Value
     */
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    /**
     * Chooses The Selected Token
     */
    const handleTokenChoice = async (tokenObj) => {
        props.modalHandler();
        props.setToken(tokenObj);
    };
    (0, react_1.useEffect)(() => { }, [inputValue]);
    return (<div style={{ overflow: "hidden" }}>
      <div className={chooseToken_module_css_1.default.blurbackground} style={{ overflow: "hidden" }} onClick={() => props.modalHandler()}>
        <div className={chooseToken_module_css_1.default.modalBackground} onClick={(e) => e.stopPropagation()}>
          <div className={chooseToken_module_css_1.default.titleText}>{props.titleText}</div>
          <framer_motion_1.motion.img src="/closeBtn.svg" alt="" className={chooseToken_module_css_1.default.closeBtn} onClick={() => props.modalHandler()} whileHover={{ scale: 0.9, opacity: 0.8 }}/>
          <input type="text" className={chooseToken_module_css_1.default.inputTokenContainer} placeholder="Enter Token Name, Symbol OR Contract Address" onChange={(e) => setInputValue(e.target.value)}/>
          <div className={chooseToken_module_css_1.default.tokensList}>
            {!fullTokensList
            ? "Loading Tokens..."
            : fullTokensList
                .filter((token, index) => fullTokensList.findIndex((tokenObj) => tokenObj.address == token.address &&
                tokenObj.chain_id == token.chain_id) == index)
                .filter((token) => token.name
                .toLowerCase()
                .includes(inputValue.toLowerCase()) ||
                token.symbol
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) ||
                token.address
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()))
                .map((token, index) => (<framer_motion_1.motion.div className={chooseToken_module_css_1.default.tokenItemContainer} key={index} whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.24)" }} onClick={() => handleTokenChoice(token)}>
                      <img src={token.logo ? token.logo : "/tokenplaceholder.svg"} alt="" className={chooseToken_module_css_1.default.tokenImg} onClick={() => handleTokenChoice(token)}/>
                      <img src="/tokenflatline.svg" alt="" className={chooseToken_module_css_1.default.flatLine}/>
                      <div className={chooseToken_module_css_1.default.tokenSymbol} onClick={() => handleTokenChoice(token)}>
                        {token.symbol}
                      </div>
                      <div className={chooseToken_module_css_1.default.tokenName} onClick={() => handleTokenChoice(token)}>
                        {token.name}
                      </div>
                    </framer_motion_1.motion.div>))}
          </div>
        </div>
      </div>
    </div>);
};
exports.ChooseTokenModal = ChooseTokenModal;
//# sourceMappingURL=ChooseToken.js.map