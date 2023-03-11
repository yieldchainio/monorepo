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
exports.TokenSwapModal = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("./css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const react_virtualized_1 = require("react-virtualized");
const NetworkChip = (props) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const { networkDetails, choiceHandler, isChosen } = props;
    const handleClick = () => {
        choiceHandler(networkDetails.chain_id);
    };
    return (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.tokenModalNetworkChipOff} whileTap={{ scale: 0.975 }} onClick={() => handleClick()} style={isChosen
            ? {
                background: "linear-gradient(#202023, #202023) padding-box,linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
                border: "1px solid transparent",
            }
            : {}}>
      <img src={networkDetails.logo} alt="" className={strategyBuilder_module_css_1.default.tokenModalNetworkChipIcon} style={{ cursor: "pointer" }}/>
      <div style={{ cursor: "pointer" }}>{networkDetails.name}</div>
    </framer_motion_1.motion.div>);
};
const TokenRow = (props) => {
    const { tokenDetails, style, target } = props;
    return (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.tokenModalTokenRowContainer} style={{ ...style, scrollbarWidth: "none" }} whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }} onClick={() => props.choiceHandler(tokenDetails, target)}>
      <div className={strategyBuilder_module_css_1.default.tokenModalTokenRowBorderFlex}>
        <img src={tokenDetails.logo} alt="" className={strategyBuilder_module_css_1.default.tokenModalTokenRowIcon}/>
        <div className={strategyBuilder_module_css_1.default.tokenModalTokenRowDetailsContainer}>
          <div className={strategyBuilder_module_css_1.default.tokenModalTokenRowSymbol}>
            {tokenDetails.symbol}
          </div>
          <div className={strategyBuilder_module_css_1.default.tokenModalTokenRowName}>
            {tokenDetails.name}
          </div>
        </div>
      </div>
    </framer_motion_1.motion.div>);
};
const TokenSwapModal = (props) => {
    const [currentChainChoice, setCurrentChainChoice] = (0, react_1.useState)("56");
    const [filteredTokens, setFilteredTokens] = (0, react_1.useState)(null);
    const [searchInput, setSearchInput] = (0, react_1.useState)("");
    const { fullNetworksList, fullTokensList } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { actionableTokens, setActionableTokens, strategyNetworks } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { choiceHandler, target, handleModal, tokensList, isStrategy } = props;
    const networkChoiceHandler = (chain) => {
        setCurrentChainChoice(chain);
    };
    const handleTokenChoice = (token, target) => {
        choiceHandler(token, target);
        handleModal(false);
    };
    (0, react_1.useEffect)(() => {
        if (fullTokensList) {
            const filteredTokens = fullTokensList.filter((token, index) => {
                let isOnChain = currentChainChoice == token.chain_id;
                let isDuplicate = fullTokensList.findIndex((token2) => token2.address == token.address &&
                    token.chain_id == token2.chain_id) != index;
                let includesFiltering = token.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    token.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
                    token.address.toLowerCase().includes(searchInput.toLowerCase());
                // TODO: Commented out part should be commented in. Commented out for testing
                // TODO: (this is to check if the token is in the actionable tokens list)
                let doesHaveAccess = target == "from"
                    ? actionableTokens.find((token2) => token2.address == token.address)
                    : true;
                let filterByNetwork = !isStrategy
                    ? true
                    : target !== "from"
                        ? true
                        : strategyNetworks.find((network) => network.chain_id == token.chain_id);
                return (isOnChain &&
                    !isDuplicate &&
                    includesFiltering &&
                    doesHaveAccess &&
                    filterByNetwork);
            });
            setFilteredTokens(filteredTokens);
        }
    }, [fullTokensList, searchInput, currentChainChoice]);
    return (<div className={strategyBuilder_module_css_1.default.tokenModalBlurWrapper} style={{ zIndex: "99999999999999999" }} onClick={() => handleModal(false)}>
      <div className={strategyBuilder_module_css_1.default.tokenModalContainer} style={{ zIndex: "999999999999999999" }} onClick={(e) => e.stopPropagation()}>
        <div className={strategyBuilder_module_css_1.default.tokenModalTitleContainer}>
          <div>Swap From</div>
          <framer_motion_1.motion.img src="/closeicon.svg" alt="" className="" whileHover={{ scale: 0.925 }} style={{ color: "white", cursor: "pointer", zIndex: "150" }} onClick={() => handleModal(false)}/>
        </div>
        <div className={strategyBuilder_module_css_1.default.tokenModaltokensFlex}>
          <div className={strategyBuilder_module_css_1.default.tokenModalSearchBarFlex}>
            <img src="/tokensearchicon.svg" alt="" className={strategyBuilder_module_css_1.default.searchIcon}/>
          </div>
          <input className={strategyBuilder_module_css_1.default.tokenModalSearchBarContainer} placeholder="Search For A Token" onChange={(e) => setSearchInput(e.target.value)}/>
          {!filteredTokens ? null : (<div style={{
                width: "100%",
                height: "100%",
                scrollbarWidth: "none",
                marginTop: "40px",
            }} className={strategyBuilder_module_css_1.default.listOfTokens}>
              <react_virtualized_1.AutoSizer>
                {({ width, height }) => (<react_virtualized_1.List height={height} width={width + width / 10} rowHeight={90} rowCount={filteredTokens.length} rowRenderer={({ key, index, style, parent }) => {
                    return (<TokenRow tokenDetails={filteredTokens[index]} style={style} choiceHandler={handleTokenChoice} target={target} key={key}/>);
                }}/>)}
              </react_virtualized_1.AutoSizer>
            </div>)}
        </div>
        <div className={strategyBuilder_module_css_1.default.tokenModalChainsFlex}>
          {fullNetworksList
            ? fullNetworksList
                .filter((network) => {
                let notAllNetworks = network.chain_id !== -500;
                let isFrom = target == "from";
                let isStrategyNetwork = !isStrategy
                    ? true
                    : strategyNetworks.find((network2) => network2.chain_id == network.chain_id);
                if (isStrategy) {
                    if (isFrom) {
                        return notAllNetworks && isStrategyNetwork;
                    }
                    else {
                        return notAllNetworks;
                    }
                }
                else {
                    return notAllNetworks;
                }
            })
                .map((network, i) => {
                return (<NetworkChip choiceHandler={networkChoiceHandler} networkDetails={network} isChosen={currentChainChoice == network.chain_id ? true : false} key={i}/>);
            })
            : null}
        </div>
      </div>
    </div>);
};
exports.TokenSwapModal = TokenSwapModal;
//# sourceMappingURL=TokenSwapModal.js.map