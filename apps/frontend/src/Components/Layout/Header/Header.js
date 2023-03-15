"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MainDashboard_module_css_1 = __importDefault(require("../../../css/MainDashboard.module.css"));
const ProtocolList_module_css_1 = __importDefault(require("../../../css/ProtocolList.module.css"));
const react_router_dom_1 = require("react-router-dom");
const NetworkDropdown_1 = __importDefault(require("./NetworkDropdown"));
const AccountDropdown_1 = __importDefault(require("./AccountDropdown"));
const framer_motion_1 = require("framer-motion");
const react_router_dom_2 = require("react-router-dom");
const Header = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [network, setNetwork] = (0, react_1.useState)("Ethereum");
    function onCreateVaultSelect() {
        navigate("/protocolList");
    }
    const location = (0, react_router_dom_2.useLocation)();
    if (location.pathname === ("/landing" || "/whitelist")) {
        return <div>{null}</div>;
    }
    else {
        return (<div style={{
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 1)",
                overflow: "hidden !important",
                overflowX: "hidden",
            }}>
        <div>
          <button className={MainDashboard_module_css_1.default.yieldchainLogo1} onClick={() => navigate("/")} style={{ zIndex: "20" }}/>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv128}>
          <div className={MainDashboard_module_css_1.default.frameDiv129}>
            <react_router_dom_1.NavLink style={{ zIndex: "20" }} to="/">
              Vault
            </react_router_dom_1.NavLink>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv130} style={{ zIndex: "20" }}>
            <div className={MainDashboard_module_css_1.default.groupDiv69} style={{ zIndex: "20" }}>
              <react_router_dom_1.NavLink style={{ zIndex: "20" }} to="/protocolList" className={({ isActive }) => isActive ? MainDashboard_module_css_1.default.vaultB : MainDashboard_module_css_1.default.portfolioDiv}>
                Portfolio
              </react_router_dom_1.NavLink>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv130} style={{ zIndex: "20" }}>
            <react_router_dom_1.NavLink style={{ zIndex: "20" }} to="/CreateStrategy" className={({ isActive }) => isActive ? MainDashboard_module_css_1.default.vaultB : MainDashboard_module_css_1.default.etherumDiv}>
              My Vault
            </react_router_dom_1.NavLink>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv130} style={{ zIndex: 100 }}>
            <react_router_dom_1.NavLink style={{ zIndex: "20" }} to="/Protocols" className={({ isActive }) => isActive ? MainDashboard_module_css_1.default.vaultB : MainDashboard_module_css_1.default.etherumDiv}>
              Stake YC
            </react_router_dom_1.NavLink>
          </div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv} style={{ zIndex: "20" }}>
          <div className={MainDashboard_module_css_1.default.frameDiv1} style={{ zIndex: "20" }}>
            {/* <img
            className={styles.simpleIconslitecoin}
            alt=""
            src="simpleiconslitecoin@2x.png"
          /> */}

            {/* <select name="networks" id="networks" className={styles.dropdown}>
            <option value="Ethereum">Ethereum</option>
            <option value="Binance">Binance</option>
            <option value="Avalanche">Avalanche</option>
            <option value="Polygon">Polygon</option>
          </select> */}
            <NetworkDropdown_1.default />
          </div>
        </div>
        {/* <div className={styles.groupDiv}>
            <img className={styles.ellipseIcon} alt="" src="ellipse@2x.png" />
            <div className={styles.groupDiv1}>
              <div className={styles.metamaskDiv}>Metamask</div>
              <div className={styles.iD65FG646Div}>ID65.....FG646</div>
            </div>
            <img className={styles.chevronDownIcon} alt="" src="chevrondown4.svg" />
          </div> */}
        <AccountDropdown_1.default />
        <div className={ProtocolList_module_css_1.default.frameDiv52} style={{ zIndex: "20" }}>
          <div className={ProtocolList_module_css_1.default.frameDiv53} style={{ zIndex: "20" }}>
            <framer_motion_1.motion.div onClick={() => navigate("/initiate")} className={ProtocolList_module_css_1.default.headerCreateVault} style={{ zIndex: "20" }} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.025 }}>
              Create Vault
            </framer_motion_1.motion.div>
          </div>
        </div>
      </div>);
    }
};
exports.default = Header;
//# sourceMappingURL=Header.js.map