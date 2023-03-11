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
exports.TrendingVaultCard = exports.VerfiedVaultCard = void 0;
const vaultcards_module_css_1 = __importDefault(require("./css/vaultcards.module.css"));
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const utils_js_1 = require("./utils/utils.js");
const react_2 = require("react");
/* Card component for a verified vault card */
const VerfiedVaultCard = (props) => {
    /* Copies main protocol URL link to user's clipboard */
    const handleCopy = () => {
        navigator.clipboard.writeText(" app.uniswap.org");
        alert("Copied");
    };
    const [vaultModal, toggleVaultModal] = (0, react_1.useState)(false);
    const [detailsLoading, setDetailsLoading] = (0, react_1.useState)(true);
    // Vault Variable Deails //
    const { style } = props;
    const vaultDetails = props.vaultDetails;
    const { name, strategy_identifier, address, apy, tvl, main_protocol_identifier, creator_user_identifier, main_token_identifier, final_token_identifier, is_verified, is_trending, execution_interval, chain_id, steps, } = vaultDetails;
    const [main_token_details, setMainTokenDetials] = (0, react_1.useState)(undefined);
    const [final_token_details, setFinalTokenDetials] = (0, react_1.useState)(undefined);
    const [network_details, setNetworkDetials] = (0, react_1.useState)(undefined);
    const [protocol, setProtocol] = (0, react_1.useState)(undefined);
    const initializeData = async (vaultDetails) => {
        try {
            let mainTokenDetails;
            let finalTokenDetails;
            let networkDetails;
            let protocolDetails;
            mainTokenDetails = await (0, utils_js_1.getTokenDetails)(vaultDetails.main_token_identifier);
            finalTokenDetails = await (0, utils_js_1.getTokenDetails)(vaultDetails.final_token_identifier);
            networkDetails = await (0, utils_js_1.getNetworkDetails)(vaultDetails.chain_id);
            protocolDetails = await (0, utils_js_1.getProtocolDetails)(vaultDetails.main_protocol_identifier);
            setMainTokenDetials(mainTokenDetails);
            setFinalTokenDetials(finalTokenDetails);
            setNetworkDetials(networkDetails);
            setProtocol(protocolDetails);
        }
        catch (error) {
            // handle any errors that occurred while fetching the data
        }
    };
    (0, react_2.useEffect)(() => {
        // check if the vaultDetails prop is defined
        if (!vaultDetails) {
            return;
        }
        // initialize the main_token_details, final_token_details, network_details, and
        // protocol variables
        initializeData(vaultDetails);
        setDetailsLoading(false);
    }, [vaultDetails]); // pass the vaultDetails prop as the second argument to the useEffect hook
    const toggleModal = () => {
        toggleVaultModal(!vaultModal);
    };
    if (!detailsLoading) {
        if (name !== undefined &&
            strategy_identifier !== undefined &&
            address !== undefined &&
            apy !== undefined &&
            tvl !== undefined &&
            main_protocol_identifier !== undefined &&
            creator_user_identifier !== undefined &&
            main_token_identifier !== undefined &&
            final_token_identifier !== undefined &&
            is_verified !== undefined &&
            is_trending !== undefined &&
            execution_interval !== undefined &&
            chain_id !== undefined &&
            main_token_details !== undefined &&
            final_token_details !== undefined &&
            network_details !== undefined &&
            protocol !== undefined) {
            return (<div style={style}>
          <framer_motion_1.motion.div className={vaultcards_module_css_1.default.vaultCard}>
            {/* <div>{vaultModal && <VaultModal vaultDetails={props} />}</div> */}

            <div className={vaultcards_module_css_1.default.apyvalues}>
              <div className={vaultcards_module_css_1.default.apyvalue}>APY: {apy}%</div>
              <div className={vaultcards_module_css_1.default.apyvalueUnd}>APR: {10}%</div>
              <div>
                <img src="verifiedtag.svg" alt=""/>
              </div>
            </div>

            <div className={vaultcards_module_css_1.default.cardContent}>
              <div className={vaultcards_module_css_1.default.pairname}>
                {main_token_details["symbol"]}
              </div>
              <div className={vaultcards_module_css_1.default.network}>{network_details["name"]}</div>

              <div className={vaultcards_module_css_1.default.imgBorder}>
                <img src={main_token_details["logo"]} className={vaultcards_module_css_1.default.img}/>
                <img src={network_details["logo"]} className={vaultcards_module_css_1.default.img2}/>
              </div>

              <ul className={vaultcards_module_css_1.default.cardlists}>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Total Value Locked</span>
                  <span className={vaultcards_module_css_1.default.value}>${tvl}</span>
                </li>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Reward Token</span>
                  <span className={vaultcards_module_css_1.default.value}>
                    {final_token_details["symbol"]}
                    <img src={final_token_details["logo"]} className={vaultcards_module_css_1.default.rewardimg}/>
                  </span>
                </li>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Strategy</span>
                  <span className={vaultcards_module_css_1.default.value}>{name}</span>
                </li>
              </ul>
              <button className={vaultcards_module_css_1.default.cardBtn} onClick={() => props.modalHandler(props.vaultDetails)}>
                Enter Vault
              </button>
            </div>
          </framer_motion_1.motion.div>
        </div>);
        }
        else {
            return <h1>Loading...</h1>;
        }
    }
    else {
        return <h1>Loading...</h1>;
    }
};
exports.VerfiedVaultCard = VerfiedVaultCard;
const TrendingVaultCard = (props) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(props.vaultDetails.mainprotocolWebsite);
        alert("Copied");
    };
    const [vaultModal, toggleVaultModal] = (0, react_1.useState)(false);
    const [detailsLoading, setDetailsLoading] = (0, react_1.useState)(true);
    // Vault Variable Deails //
    const vaultDetails = props.vaultDetails;
    const { name, strategy_identifier, address, apy, tvl, main_protocol_identifier, creator_user_identifier, main_token_identifier, final_token_identifier, is_verified, is_trending, execution_interval, chain_id, } = vaultDetails;
    const [main_token_details, setMainTokenDetials] = (0, react_1.useState)(undefined);
    const [final_token_details, setFinalTokenDetials] = (0, react_1.useState)(undefined);
    const [network_details, setNetworkDetials] = (0, react_1.useState)(undefined);
    const [protocol, setProtocol] = (0, react_1.useState)(undefined);
    const initializeData = async (vaultDetails) => {
        try {
            let mainTokenDetails;
            let finalTokenDetails;
            let networkDetails;
            let protocolDetails;
            mainTokenDetails = await (0, utils_js_1.getTokenDetails)(vaultDetails.main_token_identifier);
            finalTokenDetails = await (0, utils_js_1.getTokenDetails)(vaultDetails.final_token_identifier);
            networkDetails = await (0, utils_js_1.getNetworkDetails)(vaultDetails.chain_id);
            protocolDetails = await (0, utils_js_1.getProtocolDetails)(vaultDetails.main_protocol_identifier);
            setMainTokenDetials(mainTokenDetails);
            setFinalTokenDetials(finalTokenDetails);
            setNetworkDetials(networkDetails);
            setProtocol(protocolDetails);
        }
        catch (error) {
            // handle any errors that occurred while fetching the data
        }
    };
    (0, react_2.useEffect)(() => {
        // check if the vaultDetails prop is defined
        if (!vaultDetails) {
            return;
        }
        // initialize the main_token_details, final_token_details, network_details, and
        // protocol variables
        initializeData(vaultDetails);
        setDetailsLoading(false);
    }, [vaultDetails]); // pass the vaultDetails prop as the second argument to the useEffect hook
    const toggleModal = () => {
        toggleVaultModal(!vaultModal);
    };
    if (!detailsLoading) {
        if (name !== undefined &&
            strategy_identifier !== undefined &&
            address !== undefined &&
            apy !== undefined &&
            tvl !== undefined &&
            main_protocol_identifier !== undefined &&
            creator_user_identifier !== undefined &&
            main_token_identifier !== undefined &&
            final_token_identifier !== undefined &&
            is_verified !== undefined &&
            is_trending !== undefined &&
            execution_interval !== undefined &&
            chain_id !== undefined &&
            main_token_details !== undefined &&
            final_token_details !== undefined &&
            network_details !== undefined &&
            protocol !== undefined) {
            return (<div className={vaultcards_module_css_1.default.trendingvault}>
          <div className={vaultcards_module_css_1.default.trendingvaultapys}>
            <div className={vaultcards_module_css_1.default.trendingvaultapy1}>APY: {apy}%</div>
            <div className={vaultcards_module_css_1.default.trendingvaultapy2}>APR: {10}%</div>
            <div className={vaultcards_module_css_1.default.trendingVerifiedTag}>
              <img src={props.vaultDetails.isVerified == 1 ? "verifiedtag.svg" : ""} alt=""/>
            </div>
          </div>

          <div className={vaultcards_module_css_1.default.trendingVaultCard}>
            <div className={vaultcards_module_css_1.default.imgs}>
              <div className={vaultcards_module_css_1.default.imgBorder}>
                <img src={main_token_details.logo} className={vaultcards_module_css_1.default.img}/>
                <img />
                <img src={network_details.logo} className={vaultcards_module_css_1.default.trendingNetworkImg}/>
              </div>
            </div>
            <div className={vaultcards_module_css_1.default.trendingCardContent}>
              <div className={vaultcards_module_css_1.default.trendingPairname}>
                {/* {getTokenDetails(props.vaultDetails.main_token_identifier).address} */}
              </div>
              <div className={vaultcards_module_css_1.default.trendingNetwork}>
                {network_details.name}
              </div>
              <ul className={vaultcards_module_css_1.default.cardlists}>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Total Value Locked</span>
                  <span className={vaultcards_module_css_1.default.value}>{tvl}</span>
                </li>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Reward Token</span>
                  <span className={vaultcards_module_css_1.default.value}>
                    {final_token_details.symbol}
                    <img src={final_token_details.logo} className={vaultcards_module_css_1.default.rewardimg}/>
                  </span>
                </li>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Website</span>
                  <span className={vaultcards_module_css_1.default.value} onClick={handleCopy}>
                    {protocol.website}{" "}
                    <img src="copy.png" className={vaultcards_module_css_1.default.copyImg}/>
                  </span>
                </li>
                <li className={vaultcards_module_css_1.default.cardlist}>
                  <span className={vaultcards_module_css_1.default.key}>Strategy</span>
                  <span className={vaultcards_module_css_1.default.value}>{name}</span>
                </li>
              </ul>
              <button className={vaultcards_module_css_1.default.cardBtn}>Enter Vault</button>
            </div>
          </div>
        </div>);
        }
        else {
            return <h1>Loading...</h1>;
        }
    }
    else {
        return <h1>Loading...</h1>;
    }
};
exports.TrendingVaultCard = TrendingVaultCard;
//# sourceMappingURL=vaultcards.js.map