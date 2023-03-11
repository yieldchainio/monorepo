"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const herosection_module_css_1 = __importDefault(require("./css/herosection.module.css"));
const HeroSection = () => {
    const [showNetworks, setShowNetworks] = (0, react_1.useState)(false);
    const [toggle, setToggle] = (0, react_1.useState)(false);
    const openNetworks = () => {
        setShowNetworks(!showNetworks);
    };
    const switchToggle = () => {
        setToggle(!toggle);
    };
    return (<div className={herosection_module_css_1.default.herosection}>
      <div className={herosection_module_css_1.default.title}>Strategy Vaults</div>
      <div className={herosection_module_css_1.default.subtitle}>
        Search for a Vault ID, token or protocol, invest in the vault and
        receive massive
        <br />
        APY’s with the click of a button
      </div>
      <div className={herosection_module_css_1.default.searchFieldWrapper}>
        <img src="Vector (9).png" className={herosection_module_css_1.default.searchIcon}/>
        <input placeholder="Search for a vault ID, token or protocol" className={herosection_module_css_1.default.searchInput}/>
      </div>

      <div className={herosection_module_css_1.default.flexDiv1}>
        <div className={herosection_module_css_1.default.clips}>
          <button className={herosection_module_css_1.default.clip} id="AllNetworks">
            <img src="Group 4912.png" className={herosection_module_css_1.default.clipImg}/>
            <div className={herosection_module_css_1.default.clipname}>All Networks</div>
          </button>
          <button className={herosection_module_css_1.default.clip} id="BNBChain">
            <img src="Ellipse 27.png" className={herosection_module_css_1.default.clipImg}/>
            <div className={herosection_module_css_1.default.clipname}>Binance SC</div>
          </button>
          <button className={herosection_module_css_1.default.clip} id="Avalanche">
            <img src="Ellipse 28.png" className={herosection_module_css_1.default.clipImg}/>
            <div className={herosection_module_css_1.default.clipname}>Avalanche</div>
          </button>
          <button className={herosection_module_css_1.default.clip}>
            <img src="Ellipse 33.png" className={herosection_module_css_1.default.clipImg}/>
            <div className={herosection_module_css_1.default.clipname}>Ethereum</div>
          </button>
          <button className={herosection_module_css_1.default.clip}>
            <img src="Ellipse 33 (4).png" className={herosection_module_css_1.default.clipImg}/>
            <div className={herosection_module_css_1.default.clipname}>Polygon</div>
          </button>
          <div className={herosection_module_css_1.default.moreDiv}>
            <button className={herosection_module_css_1.default.clip} onClick={openNetworks}>
              <div className={herosection_module_css_1.default.moretitle}>More</div>
              <img src="Vector (8).png" className={herosection_module_css_1.default.moreclips}/>
            </button>
            {showNetworks && (<div className={herosection_module_css_1.default.moreNetworks}>
                <div>Network 1</div>
                <div>Network 2</div>
                <div>Network 3</div>
                <div>Network 4</div>
              </div>)}
          </div>
        </div>
        <div className={herosection_module_css_1.default.flexDiv2}>
          <div className={herosection_module_css_1.default.flexDiv3}>
            <div className={herosection_module_css_1.default.vaultDiv}>My Vaults only</div>
            <div className={herosection_module_css_1.default.toggle}>
              <div className={herosection_module_css_1.default.floor}></div>
              <div className={` ${toggle ? herosection_module_css_1.default.slidethumb : herosection_module_css_1.default.thumb} `} onClick={switchToggle}></div>
            </div>
          </div>
          <div className={herosection_module_css_1.default.filterBox}>
            Filter <div>2</div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = HeroSection;
//# sourceMappingURL=herosection.js.map