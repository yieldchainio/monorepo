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
const react_1 = __importStar(require("react"));
const MainDashboard_module_css_1 = __importDefault(require("../../../css/MainDashboard.module.css"));
const Networks_js_1 = require("../../../data/Networks.js");
const ethereum = window.ethereum;
const NetworkDropdown = () => {
    const dropdownRef = (0, react_1.useRef)(null);
    const [isActive, setIsActive] = (0, react_1.useState)(false);
    const [network, setNetwork] = (0, react_1.useState)({
        name: "Ethereum",
        img: "group-Ethereum.svg",
    });
    const dropdownHandler = () => {
        setIsActive(!isActive);
    };
    const handleNetworkChange = async (e, networkObject) => {
        const networkDropDownHandler = (e) => {
            setNetwork({
                ...network,
                name: "" + e.target.textContent,
                img: "group-" + e.target.textContent + ".svg",
            });
            setIsActive(!isActive);
        };
        if (window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: networkObject.chainId }],
                });
                networkDropDownHandler(e);
            }
            catch (err) {
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainName: networkObject.chainName,
                                chainId: networkObject.chainId,
                                nativeCurrency: {
                                    name: networkObject.nativeCurrency.name,
                                    decimals: networkObject.nativeCurrency.decimals,
                                    symbol: networkObject.nativeCurrency.symbol,
                                },
                                rpcUrls: [networkObject.rpcUrls],
                            },
                        ],
                    });
                }
            }
        }
    };
    return (<div style={{ zIndex: "100" }}>
      <div className={MainDashboard_module_css_1.default.menuContainer}>
        <button className={MainDashboard_module_css_1.default.menuTrigger} onClick={dropdownHandler}>
          <img src={`/${network.img}`} className={MainDashboard_module_css_1.default.simpleIconslitecoin} alt="Network"/>
          <span style={{ paddingLeft: "5px" }}>{network.name}</span>
          <img style={{ marginLeft: "5px" }} alt="" src="chevrondown4.svg"/>
        </button>
        {isActive && (<>
            <nav ref={dropdownRef} className={`menu ${isActive ? "active" : "inactive"}`}>
              <ul className={MainDashboard_module_css_1.default.dropdown}>
                <li onClick={(e) => handleNetworkChange(e, Networks_js_1.networks[0].avalanche)} className={MainDashboard_module_css_1.default.dropdown}>
                  Avalanche
                </li>
                <li onClick={(e) => handleNetworkChange(e, Networks_js_1.networks[0].bsc)} className={MainDashboard_module_css_1.default.dropdown}>
                  Binance
                </li>
                <li onClick={(e) => handleNetworkChange(e, Networks_js_1.networks[0].ethereum)} className={MainDashboard_module_css_1.default.dropdown}>
                  Ethereum
                </li>
                <li onClick={(e) => handleNetworkChange(e, Networks_js_1.networks[0].polygon)} className={MainDashboard_module_css_1.default.dropdown}>
                  Polygon
                </li>
              </ul>
            </nav>
          </>)}
      </div>
    </div>);
};
exports.default = NetworkDropdown;
//# sourceMappingURL=NetworkDropdown.js.map