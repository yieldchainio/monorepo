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
const dashboardpage_module_css_1 = __importDefault(require("./css/dashboardpage.module.css"));
const herosection_1 = __importDefault(require("./herosection"));
const vaultSection_1 = __importDefault(require("./vaultSection"));
const vaultstable_1 = __importDefault(require("./vaultstable"));
const vaultModal_1 = require("./vaultModal");
const react_1 = __importStar(require("react"));
const usehooks_ts_1 = require("usehooks-ts");
const wagmi_1 = require("wagmi");
const utils_js_1 = require("./utils/utils.js");
const LoadingScreen_1 = require("LoadingScreen");
const DashBoardPage = () => {
    const { data: signer, isError, isLoading } = (0, wagmi_1.useSigner)();
    const [currentVaultModal, setCurrentVaultModal] = (0, react_1.useState)(undefined);
    const [locked, setLocked] = (0, usehooks_ts_1.useLockedBody)(false, "root");
    const [state, setState] = (0, react_1.useState)("loading");
    // const [mousePosition, setMousePosition] = useState("");
    const toggleLocked = () => {
        setLocked(!locked);
    };
    const [whitelisted, setWhitelisted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (signer) {
                console.log("Singer mofo", signer, "get address", signer.getAddress());
                const didUserGetWhitelisted = await (0, utils_js_1.isWhitelisted)(await signer.getAddress());
                console.log("Did user get whitlisted? ", didUserGetWhitelisted);
                setWhitelisted(didUserGetWhitelisted);
            }
        })();
        return () => {
            setWhitelisted(false);
        };
    }, [signer]);
    if (!whitelisted) {
        setTimeout(() => {
            if (!whitelisted) {
                setState("notWhitelisted");
            }
        }, 5000);
        if (state === "notWhitelisted") {
            return (<div style={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    color: "white",
                }}>
          <h1>Sorry, you're not currently whitelisted</h1>
        </div>);
        }
        return <LoadingScreen_1.LoadingScreen />;
    }
    return (<div className={dashboardpage_module_css_1.default.dashboardpage} style={!!currentVaultModal ? { overflow: "hidden" } : { overflow: "default" }}>
      {/* {currentVaultModal !== undefined ? toggleLocked : null} */}
      <herosection_1.default />
      <vaultSection_1.default modalHandler={setCurrentVaultModal}/>
      {currentVaultModal !== undefined ? (<vaultModal_1.VaultModal vaultDetails={currentVaultModal} modalHandler={setCurrentVaultModal}/>) : undefined}
      <vaultstable_1.default />
    </div>);
};
exports.default = DashBoardPage;
//# sourceMappingURL=dashboardpage.js.map