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
exports.Protocols = void 0;
const react_1 = __importStar(require("react"));
const protocolpools_module_css_1 = __importDefault(require("./css/protocolpools.module.css"));
const framer_motion_1 = require("framer-motion");
const networksSection_1 = require("./networksSection");
const poolsTable_1 = require("./poolsTable");
const react_router_dom_1 = require("react-router-dom");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const ComingSoon_1 = __importDefault(require("ComingSoon"));
const Protocols = (props) => {
    const { fullProtocolsList, fullAddressesList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { baseSteps, setBaseSteps, showPercentageBox, setShowPercentageBox, isModalOpen, strategyProcessLocation, setStrategyProcessLocation, StrategyProcessSteps, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    let navigate = (0, react_router_dom_1.useNavigate)();
    let { protocolIdentifier } = (0, react_router_dom_1.useParams)();
    const [protocolDetails, setProtocolDetails] = (0, react_1.useState)(undefined);
    const [protocolsList, setProtocolsList] = (0, react_1.useState)(undefined);
    const [protocolNetworksState, setProtocolNetworksState] = (0, react_1.useState)(undefined);
    const [protocolAddresses, setProtocolAddresses] = (0, react_1.useState)([]);
    const [{ name, website, logo, twitter, discord, aggregated_tvl, is_verified, is_trending, }, setProtocolDetailsState,] = (0, react_1.useState)({
        name: undefined,
        website: undefined,
        logo: undefined,
        twitter: undefined,
        discord: undefined,
        aggregated_tvl: undefined,
        is_verified: undefined,
        is_trending: undefined,
    });
    const initData = async () => {
        try {
            // Sets The Details Of The Current Protocol
            if (fullProtocolsList !== undefined) {
                let currentProtocolDetails = fullProtocolsList[fullProtocolsList.findIndex((item) => item.protocol_identifier == protocolIdentifier)];
                setProtocolDetails(currentProtocolDetails);
                // Sets The List Of Networks Available On The Current Protocol
                let currentChainIds = fullProtocolsNetworksList.filter((item) => item.protocol_identifier == protocolIdentifier ||
                    item.chain_id == -500);
                setProtocolNetworksState(currentChainIds);
                let { name, website, logo, twitter, discord, aggregated_tvl, is_verified, is_trending, } = currentProtocolDetails;
                setProtocolDetailsState({
                    name,
                    website,
                    logo,
                    twitter,
                    discord,
                    aggregated_tvl,
                    is_verified,
                    is_trending,
                });
            }
            let Addresses = protocolsAddressesList.filter((item) => item.protocol_identifier == protocolIdentifier);
            setProtocolAddresses(Addresses);
            setStrategyProcessLocation(StrategyProcessSteps.BASE_STRATEGY);
        }
        catch (e) {
            if (strategyProcessLocation === StrategyProcessSteps.NOT_ENTERED) {
                navigate("/");
            }
        }
    };
    let AddressTableProp = {
        parentAddressesList: protocolAddresses,
    };
    (0, react_1.useEffect)(() => {
        if (fullProtocolsList &&
            fullNetworksList &&
            fullProtocolsNetworksList &&
            protocolsAddressesList) {
            initData();
        }
    }, [
        fullProtocolsList,
        fullNetworksList,
        fullProtocolsNetworksList,
        protocolsAddressesList,
    ]);
    const isHoveringAddProtocolBtn = (0, react_1.useRef)(false);
    const setIsHoveringAddProtocolBtn = (value) => {
        isHoveringAddProtocolBtn.current = value;
    };
    if (protocolDetails &&
        protocolNetworksState &&
        protocolAddresses &&
        name &&
        logo &&
        protocolIdentifier) {
        return (<div className={protocolpools_module_css_1.default.pageDiv} 
        // onClick={() => setShowPercentageBox(false)}
        style={isModalOpen ? { overflow: "hidden" } : {}}>
        <div className={protocolpools_module_css_1.default.protocolRouteContainer}>
          <framer_motion_1.motion.div onClick={() => navigate("/protocols")} className={protocolpools_module_css_1.default.protocolsRouteOffText} whileHover={{ color: "white", fontWeight: "bold" }}>
            Protocols
          </framer_motion_1.motion.div>
          <img src="/routeleftarrow.svg" alt="" className={protocolpools_module_css_1.default.routeLeftArrow}/>
          <div className={protocolpools_module_css_1.default.protocolRouteOnText}>{name}</div>
        </div>
        <framer_motion_1.motion.div className={protocolpools_module_css_1.default.addProtocolGradientContainer} whileHover={{ scale: 1.025 }}>
          <div className={protocolpools_module_css_1.default.circleAddProtocol}>
            <img src="/shouticon.svg" alt="" className={protocolpools_module_css_1.default.addNewProtocolIcon}/>
          </div>
          <div className={protocolpools_module_css_1.default.addNewProtocolTitle}>
            Add A New Action in ~2 Minutes
          </div>
          <div className={protocolpools_module_css_1.default.addNewProtocolSubText}>
            Can't find the action you're looking for? Click here to add it - It
            won't take any longer than 2 Minutes.
          </div>
          <framer_motion_1.motion.button className={protocolpools_module_css_1.default.addNewProtocolBtn} onClick={(e) => setShowPercentageBox(e.screenY)} whileHover={() => setIsHoveringAddProtocolBtn(true)}>
            {" "}
            + Add New Action
          </framer_motion_1.motion.button>
          <ComingSoon_1.default />
        </framer_motion_1.motion.div>
        <div className={protocolpools_module_css_1.default.protocolHeaderContainer}>
          <img src={logo} alt="" className={protocolpools_module_css_1.default.protocolHeaderLogo}/>
          <div className={protocolpools_module_css_1.default.protocolHeaderTitle}>{name}</div>
          <img src="/protocolWebsiteIcon.svg" alt="" className={protocolpools_module_css_1.default.protocolWebsiteIcon}/>
          <div className={protocolpools_module_css_1.default.protocolWebsiteText}>{website}</div>
          <div className={protocolpools_module_css_1.default.mediaButtonsContainer}>
            <div className={protocolpools_module_css_1.default.mediaButtonCircleOverlay}>
              <img src="/websiteicon.svg" alt="" className={protocolpools_module_css_1.default.mediaButtonImg} onClick={() => window.open(website, "_blank", "noopener,noreferrer")}/>
            </div>
            <framer_motion_1.motion.div className={protocolpools_module_css_1.default.mediaButtonCircleOverlay} style={{ left: "56px" }} whileHover={{
                scale: 1.05,
                backgroundColor: "white",
                borderColor: "black",
            }}>
              <framer_motion_1.motion.img src="/twittericon.svg" alt="" className={protocolpools_module_css_1.default.mediaButtonImg} whileHover={{
                scale: 1.05,
                color: "blue",
            }}/>
            </framer_motion_1.motion.div>
            <div className={protocolpools_module_css_1.default.mediaButtonCircleOverlay} style={{ left: "112px" }}>
              <img src="/shareiconprotocol.svg" alt="" className={protocolpools_module_css_1.default.mediaButtonImg}/>
            </div>
          </div>
          <img src="/searchicon.svg" alt="" className={protocolpools_module_css_1.default.searchIcon}/>
          <input type="text" className={protocolpools_module_css_1.default.searchBarBox} placeholder="Search for a Address"/>
        </div>
        <networksSection_1.NetworksSection correctNetworksList={protocolNetworksState}/>
        <poolsTable_1.PoolsTable protocol_identifier={protocolIdentifier} protocolDetails={{
                name,
                logo,
                website,
                twitter,
                discord,
                aggregated_tvl,
                is_verified,
                is_trending,
            }} showPercentageBox={showPercentageBox} setShowPercentageBox={setShowPercentageBox}/>
      </div>);
    }
    else {
        return null;
    }
};
exports.Protocols = Protocols;
//# sourceMappingURL=Protocols.js.map