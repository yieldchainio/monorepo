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
exports.VaultSection = void 0;
const vaultsection_module_css_1 = __importDefault(require("./css/vaultsection.module.css"));
const vaultcards_1 = require("./vaultcards");
const react_1 = __importStar(require("react"));
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const VaultSection = (props) => {
    const { fullProtocolsList, fullAddressesList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const [vaultsList, setVaultslist] = (0, react_1.useState)([]);
    const [verifiedVaultsBackable, setVerifiedVaultsBackable] = (0, react_1.useState)(false);
    const [numOfVerifiedScrolls, setNumOfVerifiedScrolls] = (0, react_1.useState)(0);
    const [isScrolling, setIsScrolling] = (0, react_1.useState)(false);
    const [isScrollingTrending, setIsScrollingTrending] = (0, react_1.useState)(false);
    const [trendingVaultsBackable, setTrendingVaultsBackable] = (0, react_1.useState)(false);
    const [numOfTrendingScrolls, setNumOfTrendingScrolls] = (0, react_1.useState)(0);
    const [verifiedReachedEnd, setVerifiedReachedEnd] = (0, react_1.useState)(false);
    const [trendingReachedEnd, setTrendingReachedEnd] = (0, react_1.useState)(false);
    let somerandomvar = false;
    (0, react_1.useEffect)(() => {
        if (fullStrategiesList) {
            setVaultslist(fullStrategiesList);
        }
    }, [fullStrategiesList]);
    // useEffect(() => {
    //   (async () => {
    //     const vaults = await axios.get("http://localhost:1337/strategies");
    //     setVaultslist(vaults.data.strategies);
    //   })();
    //   return () => {
    //     // this now gets called when the component unmounts
    //   };
    // }, []);
    (0, react_1.useEffect)(() => {
        if (isScrolling) {
            setTimeout(() => {
                setIsScrolling(false);
            }, 700);
        }
    }, [isScrolling]);
    (0, react_1.useEffect)(() => {
        if (isScrollingTrending) {
            setTimeout(() => {
                setIsScrollingTrending(false);
            }, 700);
        }
    }, [isScrollingTrending]);
    const handleRightScroll = () => {
        let right = document.querySelector("#vaultsSection");
        setIsScrolling(true);
        right.scrollBy(350, 0);
        setNumOfVerifiedScrolls(numOfVerifiedScrolls + 1);
    };
    const handleRightScrollTrending = () => {
        let right = document.querySelector("#trendingVaultsSection");
        setIsScrollingTrending(true);
        right.scrollBy(250, 0);
        setNumOfTrendingScrolls(numOfTrendingScrolls + 1);
    };
    const handleBackScroll = () => {
        let back = document.querySelector("#vaultsSection");
        back.scrollBy(-100, 0);
        if (numOfVerifiedScrolls > 0) {
            setNumOfVerifiedScrolls(numOfVerifiedScrolls - 1);
        }
        setIsScrolling(false);
    };
    const handleTrendingBackScroll = () => {
        let back = document.querySelector("#trendingVaultsSection");
        back.scrollBy(-100, 0);
        if (numOfTrendingScrolls > 0) {
            setNumOfTrendingScrolls(numOfTrendingScrolls - 1);
        }
        setIsScrollingTrending(false);
    };
    const handleScroll = (e) => { };
    return (<div className={vaultsection_module_css_1.default.vaultsection}>
      <div className={vaultsection_module_css_1.default.statsDiv}>
        <div className={vaultsection_module_css_1.default.flexDiv2}>
          <div>
            <div className={vaultsection_module_css_1.default.statTitle}>My Total Deposits</div>
            <div className={vaultsection_module_css_1.default.statValue}>$ 50,000</div>
          </div>
          <div>
            <div className={vaultsection_module_css_1.default.statTitle}>Claimable Rewards</div>
            <div className={vaultsection_module_css_1.default.statValue}>$ 50,000</div>
          </div>
          <div>
            <div className={vaultsection_module_css_1.default.statTitle}>
              Staked YC <a>Stake for 300% APR</a>
            </div>
            <div className={vaultsection_module_css_1.default.statValue}>50,000,000</div>
          </div>
        </div>
        <div className={vaultsection_module_css_1.default.flexDiv3}>
          <div>
            <div className={vaultsection_module_css_1.default.statTitle}>Total Vaults</div>
            <div className={vaultsection_module_css_1.default.statValue}>234</div>
          </div>
          <div>
            <div className={vaultsection_module_css_1.default.statTitle}>My Vaults</div>
            <div className={vaultsection_module_css_1.default.statValue}>14</div>
          </div>
          <button className={vaultsection_module_css_1.default.createBtn}>
            <img src="Vector (10).png"/> Create Vault
          </button>
        </div>
      </div>
      <div className={vaultsection_module_css_1.default.flexDiv} id="verifiedVaultsGrid">
        <div className={vaultsection_module_css_1.default.title}>Verified Vaults</div>
        <div className={vaultsection_module_css_1.default.arrows}>
          <button className={numOfVerifiedScrolls <= 0 ? vaultsection_module_css_1.default.arrowOff : vaultsection_module_css_1.default.backArrowOn} onClick={handleBackScroll} onScroll={handleScroll}>
            <img className={vaultsection_module_css_1.default.arrowImg} alt="" src="Vector (13).png"/>
          </button>
          <button className={!verifiedReachedEnd
            ? isScrolling
                ? vaultsection_module_css_1.default.arrowOff
                : vaultsection_module_css_1.default.arrowOn
            : vaultsection_module_css_1.default.arrowOff} onClick={handleRightScroll}>
            <img className={vaultsection_module_css_1.default.arrowImg} alt="" src="Vector (12).png"/>
          </button>
        </div>
      </div>
      <div className={vaultsection_module_css_1.default.cards} id="vaultsSection">
        {/* {<VerfiedVaultCard vaultDetails={vaultsList[0]} />} */}
        {vaultsList.length == 0 ? (<h1> Loading... </h1>) : (vaultsList
            .filter((strategyObj) => strategyObj.is_verified == 1)
            .map((strategyObj, index) => (<vaultcards_1.VerfiedVaultCard key={index} vaultDetails={strategyObj} modalHandler={props.modalHandler}/>)))}
      </div>

      <div className={vaultsection_module_css_1.default.trendingVault}>
        <div className={vaultsection_module_css_1.default.flexDiv}>
          <div className={vaultsection_module_css_1.default.title}>Trending Vaults</div>
          <div className={vaultsection_module_css_1.default.arrows}>
            <button className={numOfVerifiedScrolls <= 0 ? vaultsection_module_css_1.default.arrowOff : vaultsection_module_css_1.default.backArrowOn} onClick={handleTrendingBackScroll} onScroll={handleScroll}>
              <img className={vaultsection_module_css_1.default.arrowImg} alt="" src="Vector (13).png"/>
            </button>
            <button className={!trendingReachedEnd
            ? isScrollingTrending
                ? vaultsection_module_css_1.default.arrowOff
                : vaultsection_module_css_1.default.arrowOn
            : vaultsection_module_css_1.default.arrowOff} onClick={handleRightScrollTrending}>
              <img className={vaultsection_module_css_1.default.arrowImg} alt="" src="Vector (12).png"/>
            </button>
          </div>
        </div>
        <div className={vaultsection_module_css_1.default.cards} id="trendingVaultsSection">
          {vaultsList.length == 0
            ? "Loading!!!"
            : vaultsList
                .filter((strategyObj) => strategyObj.is_trending == true)
                .map((strategyObj, index) => (<vaultcards_1.TrendingVaultCard key={strategyObj.strategy_identifier} vaultDetails={strategyObj} modalHandler={props.modalHandler}/>))}
        </div>
      </div>
      <span></span>
    </div>);
};
exports.VaultSection = VaultSection;
exports.default = exports.VaultSection;
//# sourceMappingURL=vaultSection.js.map