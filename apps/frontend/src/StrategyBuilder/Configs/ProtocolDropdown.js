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
exports.ProtocolDropDown = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../../css/strategyBuilder.module.css"));
const framer_motion_1 = require("framer-motion");
const ProtocolRow = (props) => {
    const { choiceHandler, protocolDetails } = props;
    return (<framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.mediumConfigProtocolRow} whileHover={{
            backgroundColor: "rgba(15, 16, 17, 1)",
            transition: { duration: 0.1 },
        }} onClick={() => choiceHandler(protocolDetails)}>
      {" "}
      <img alt="" src={protocolDetails.logo} className={strategyBuilder_module_css_1.default.mediumConfigProtocolRowIcon}/>
      <div className={strategyBuilder_module_css_1.default.mediumConfigProtocolRowText}>
        {protocolDetails.name}
      </div>
    </framer_motion_1.motion.div>);
};
const ProtocolDropDown = (props) => {
    const { top, left, choiceHandler, protocolsList } = props;
    const [listOfProtocols, setListOfProtocols] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (protocolsList) {
            setListOfProtocols(protocolsList);
        }
    }, [protocolsList]);
    return (<div className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenu} style={{
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
        }}>
      <input type="text" className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenuSearchBar} placeholder="Search Protocol"/>
      <img src="/dropdownsearchicon.svg" alt="" className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenuSearchBarIcon}/>

      <div className={strategyBuilder_module_css_1.default.mediumConfigProtocolMenuRowsGrid}>
        {!listOfProtocols
            ? "Loading Protocols..."
            : listOfProtocols
                // .filter((protocol: any, index: number) =>
                //   listOfProtocols.findIndex(
                //     (protocolObj: any, objIndex: number) => objIndex == index
                //   )
                // )
                .map((protocol, index) => (<ProtocolRow choiceHandler={choiceHandler} protocolDetails={protocol} key={index}/>))}
      </div>
    </div>);
};
exports.ProtocolDropDown = ProtocolDropDown;
//# sourceMappingURL=ProtocolDropdown.js.map