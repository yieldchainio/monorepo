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
exports.ProtocolList = void 0;
const react_1 = __importStar(require("react"));
const ProtocolList_module_css_1 = __importDefault(require("./css/ProtocolList.module.css"));
const react_router_dom_1 = require("react-router-dom");
const framer_motion_1 = require("framer-motion");
const ProtocolCard_1 = require("./ProtocolCard");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const ComingSoon_1 = __importDefault(require("ComingSoon"));
const ProtocolList = () => {
    /**
     * Context for all needed data
     */
    const { fullProtocolsList, fullPoolsList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const [protocolsList, setProtocolsList] = (0, react_1.useState)(undefined);
    const [isHovering, setIsHovering] = (0, react_1.useState)(false);
    const [isHoveringPopUp, setIsHoveringPopUp] = (0, react_1.useState)(false);
    const [isHoveringAddProtocolBtn, setIsHoveringAddProtocolBtn] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (fullProtocolsList !== undefined) {
            setProtocolsList(fullProtocolsList);
        }
    }, [fullProtocolsList]);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [currentSort, setCurrentSort] = (0, react_1.useState)("TVL");
    const [isSortExpanded, setIsSortExpanded] = (0, react_1.useState)(false);
    const [isHoveringSort, setIsHoveringSort] = (0, react_1.useState)(false);
    const onButtonClick = (0, react_1.useCallback)(() => {
        navigate("/inputAddress");
    }, [navigate]);
    return (<div className={ProtocolList_module_css_1.default.dashboardDiv}>
      {isHovering !== false ? (<div className={ProtocolList_module_css_1.default.hoverPopUp} style={{
                top: isHovering[0].clientY + 80,
                left: isHovering[0].clientX - 50,
            }} onMouseOver={(e) => setIsHovering([
                { clientX: e.clientX, clientY: e.clientY },
                isHovering[1],
            ])}>
          {" "}
        </div>) : null}
      <framer_motion_1.motion.div className={ProtocolList_module_css_1.default.addProtocolGradientContainer} whileHover={{ scale: 1.025 }}>
        <ComingSoon_1.default />
        <div className={ProtocolList_module_css_1.default.circleAddProtocol}>
          <img src="shouticon.svg" alt="" className={ProtocolList_module_css_1.default.addNewProtocolIcon}/>
        </div>
        <div className={ProtocolList_module_css_1.default.addNewProtocolTitle}>
          Add A New Protocol in ~2 Minutes
        </div>
        <div className={ProtocolList_module_css_1.default.addNewProtocolSubText}>
          Can't find the protocol you're looking for? Click here to add it - It
          won't take any longer than 2 Minutes.
        </div>
        <framer_motion_1.motion.button className={ProtocolList_module_css_1.default.addNewProtocolBtn} whileHover={() => setIsHoveringAddProtocolBtn(true)}>
          {" "}
          + Add New Protocol
        </framer_motion_1.motion.button>
      </framer_motion_1.motion.div>
      <div className={ProtocolList_module_css_1.default.titleContainer}>
        <div className={ProtocolList_module_css_1.default.protocolsHeadTitle}>Protocols</div>
        <framer_motion_1.motion.button className={ProtocolList_module_css_1.default.sortingBox} whileHover={{ scale: 1.1, color: "white" }}>
          <div className={ProtocolList_module_css_1.default.sortingBoxText}>Sort By: {currentSort}</div>
          <framer_motion_1.motion.img whileHover={{
            fill: "white",
            transition: { duration: 1 },
            borderColor: "white",
        }} src="sortingdownarrow.svg" alt="" className={ProtocolList_module_css_1.default.sortingDownArrow}/>
        </framer_motion_1.motion.button>
        <input type="text" className={ProtocolList_module_css_1.default.searchBarBox} placeholder={"Search For A Protocol's Name"}/>
        <img src="searchicon.svg" alt="" className={ProtocolList_module_css_1.default.searchIcon}/>
      </div>
      <div className={ProtocolList_module_css_1.default.protocolsCardsContainer}>
        {protocolsList == undefined
            ? "Loading Protocols"
            : protocolsList
                .sort((a, b) => a.aggregated_tvl > b.aggregated_tvl)
                .filter((protocolObj) => protocolObj.hidden === false)
                .map((protocolObj, index) => (<ProtocolCard_1.ProtocolCard protocolDetails={protocolObj} hoverHandler={setIsHovering} isHovering={isHovering} key={index}/>))}
      </div>
    </div>);
};
exports.ProtocolList = ProtocolList;
//# sourceMappingURL=protocolList.js.map