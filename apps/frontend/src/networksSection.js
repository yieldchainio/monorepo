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
exports.NetworksSection = void 0;
const react_1 = __importStar(require("react"));
const protocolpools_module_css_1 = __importDefault(require("./css/protocolpools.module.css"));
const networkchip_1 = require("./networkchip");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const NetworksSection = (props) => {
    const { fullProtocolsList, fullPoolsList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const [clickedMapping, setClickedMapping] = (0, react_1.useState)(new Map());
    const [networksList, setNetworksList] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (fullNetworksList) {
            if (props.correctNetworksList) {
                let correctNetworksList = fullNetworksList.filter((item) => props.correctNetworksList.findIndex((fullItem) => fullItem.chain_id == item.chain_id || item.chain_id == -500) != -1);
                setNetworksList(correctNetworksList);
            }
            else {
                setNetworksList(fullNetworksList);
            }
        }
    }, [fullNetworksList, props.correctNetworksList]);
    return (<div className={protocolpools_module_css_1.default.networkChipsContainer}>
      {networksList !== undefined
            ? networksList
                .sort((a, b) => {
                return a - b;
            })
                .map((networkObj) => (<networkchip_1.NetworkChip networkDetails={networkObj} clickHandler={clickedMapping} key={networkObj.chain_id}/>))
            : null}
    </div>);
};
exports.NetworksSection = NetworksSection;
//# sourceMappingURL=networksSection.js.map