"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainDashboard = void 0;
const react_1 = __importDefault(require("react"));
const SearchBoxComponent_1 = require("./SearchBoxComponent");
const MainDashboard_module_css_1 = __importDefault(require("./css/MainDashboard.module.css"));
const react_router_dom_1 = require("react-router-dom");
const MainDashboard = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (<div className={MainDashboard_module_css_1.default.mainDashboardDiv}>
      <form className={MainDashboard_module_css_1.default.frameForm} action="https://yieldchain.io/" method="post" autoComplete="on">
        <img className={MainDashboard_module_css_1.default.ellipseIcon1} alt="" src="ellipse-15.svg"/>
        <img className={MainDashboard_module_css_1.default.icon24cursor} alt="" src="icon24cursor3.svg"/>
        <div className={MainDashboard_module_css_1.default.groupDiv2}>
          <div className={MainDashboard_module_css_1.default.groupDiv3}>
            <div className={MainDashboard_module_css_1.default.strategyVaultsDiv}>Strategy Vaults</div>
            <div className={MainDashboard_module_css_1.default.searchForAVaultIDTokenO}>
              Search for a Vault ID, token or protocol, invest in the vault and
              receive massive APY’s with the click of a button
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.groupDiv4}>
            <div className={MainDashboard_module_css_1.default.groupDiv5}>
              <SearchBoxComponent_1.SearchBoxComponent />
              <div className={MainDashboard_module_css_1.default.iconSearch}>
                <img className={MainDashboard_module_css_1.default.icon1} alt="" src="icon1.svg"/>
              </div>
            </div>
          </div>
        </div>
        {/* <img className={styles.ellipseIcon2} alt="" /> */}
        <div className={MainDashboard_module_css_1.default.frameDiv2}>
          <div className={MainDashboard_module_css_1.default.frameDiv3}>
            <div className={MainDashboard_module_css_1.default.groupIcon}>
              <img className={MainDashboard_module_css_1.default.ellipseIcon3} alt="" src="ellipse-27.svg"/>
              <img className={MainDashboard_module_css_1.default.yieldchainLogo11} alt="" src="yieldchain-logo-13@2x.png"/>
            </div>
            <b className={MainDashboard_module_css_1.default.allNetworksB}>All Networks</b>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv3}>
            <img className={MainDashboard_module_css_1.default.groupIcon} alt="" src="group-Binance.svg"/>
            <div className={MainDashboard_module_css_1.default.binanceSCDiv}>Binance SC</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv3}>
            <img className={MainDashboard_module_css_1.default.groupIcon} alt="" src="group-Avalanche.svg"/>
            <div className={MainDashboard_module_css_1.default.binanceSCDiv}>Avalanche</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv3}>
            <img className={MainDashboard_module_css_1.default.groupIcon} alt="" src="group-Ethereum.svg"/>
            <div className={MainDashboard_module_css_1.default.binanceSCDiv}>Ethereum</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv3}>
            <img className={MainDashboard_module_css_1.default.groupIcon} alt="" src="group-Polygon.svg"/>
            <div className={MainDashboard_module_css_1.default.binanceSCDiv}>Polygon</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv8}>
            <div className={MainDashboard_module_css_1.default.binanceSCDiv}>More</div>
            <img className={MainDashboard_module_css_1.default.plusIcon} alt="" src="chevrondown.svg"/>
          </div>
        </div>
        <div className={MainDashboard_module_css_1.default.groupDiv8}>
          <div className={MainDashboard_module_css_1.default.frameDiv9}>
            <div className={MainDashboard_module_css_1.default.frameDiv10}>
              <div className={MainDashboard_module_css_1.default.filterDiv}>Filter</div>
            </div>
            <div className={MainDashboard_module_css_1.default.switchAOnaEnabled}>
              <img className={MainDashboard_module_css_1.default.ellipseIcon4} alt="" src="ellipse-13.svg"/>
              <b className={MainDashboard_module_css_1.default.b}>2</b>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv12}>
            <b className={MainDashboard_module_css_1.default.dashboard}>My Vaults only</b>
            <div className={MainDashboard_module_css_1.default.switchAOnaEnabled}>
              <div className={MainDashboard_module_css_1.default.colorLTrack}/>
              <img className={MainDashboard_module_css_1.default.colorLThumb} alt="" src="-color-l-thumb.svg"/>
            </div>
          </div>
        </div>
      </form>

      <div className={MainDashboard_module_css_1.default.frameDiv15}>
        <div className={MainDashboard_module_css_1.default.rectangleDiv}/>
        <div className={MainDashboard_module_css_1.default.frameDiv16}>
          <div className={MainDashboard_module_css_1.default.frameDiv1}>
            <img className={MainDashboard_module_css_1.default.plusIcon} alt="" src="plus.svg"/>
            <div className={MainDashboard_module_css_1.default.createVaultDiv}>Create Vault</div>
          </div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv18}>
          <div className={MainDashboard_module_css_1.default.totalVaultsDiv}>Total Vaults</div>
          <div className={MainDashboard_module_css_1.default.div}>234</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv19}>
          <div className={MainDashboard_module_css_1.default.totalVaultsDiv}>My Vaults</div>
          <div className={MainDashboard_module_css_1.default.div}>14</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv20}>
          <div className={MainDashboard_module_css_1.default.frameDiv21}>
            <div className={MainDashboard_module_css_1.default.totalVaultsDiv}>Stacked YC</div>
            <div className={MainDashboard_module_css_1.default.stakeFor300APR}>Stake for 300% APR</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv22}>
            <div className={MainDashboard_module_css_1.default.div2}>50,000,000</div>
          </div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv23}>
          <div className={MainDashboard_module_css_1.default.totalVaultsDiv}>My Total Deposits</div>
          <div className={MainDashboard_module_css_1.default.div}>$ 50,000</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv24}>
          <div className={MainDashboard_module_css_1.default.totalVaultsDiv}>Claimable Rewards</div>
          <div className={MainDashboard_module_css_1.default.div}>$ 50,000</div>
        </div>
      </div>
      <div className={MainDashboard_module_css_1.default.verifiedVaultsDiv}>Verified Vaults</div>
      <div className={MainDashboard_module_css_1.default.trendingVaultsDiv}>Trending Vaults</div>
      <img className={MainDashboard_module_css_1.default.groupIcon4} alt="" src="group-43927.svg"/>
      <img className={MainDashboard_module_css_1.default.groupIcon5} alt="" src="group-1000002028.svg"/>
      <form className={MainDashboard_module_css_1.default.frameForm1}>
        <div className={MainDashboard_module_css_1.default.rectangleDiv1}/>
        <div className={MainDashboard_module_css_1.default.frameDiv25}>
          <div className={MainDashboard_module_css_1.default.totalValueLocked}>Total Value Locked</div>
          <div className={MainDashboard_module_css_1.default.mDiv}>$100M</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv26}>
          <div className={MainDashboard_module_css_1.default.totalValueLocked}>Reward Token</div>
          <div className={MainDashboard_module_css_1.default.cakeDiv}>Cake</div>
          <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon} alt="" src="frame-1000002068.svg"/>
        <div className={MainDashboard_module_css_1.default.buttonDiv}>
          <div className={MainDashboard_module_css_1.default.groupDiv9}>
            <div className={MainDashboard_module_css_1.default.enterVaultDiv}>Enter Vault</div>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.rectangleIcon} alt="" src="rectangle-15088.svg"/>
        <div className={MainDashboard_module_css_1.default.frameDiv27}>
          <div className={MainDashboard_module_css_1.default.aPY234Div}>APY: 234% </div>
          <div className={MainDashboard_module_css_1.default.aPR45}>APR : 45%</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv28}>
          <div className={MainDashboard_module_css_1.default.verifiedDiv}>Verified</div>
          <img className={MainDashboard_module_css_1.default.checkDecagramIcon} alt="" src="checkdecagram.svg"/>
        </div>
        <div className={MainDashboard_module_css_1.default.uSDTBTCDiv}>
          <span className={MainDashboard_module_css_1.default.uSDTBTCSpan}>USDT/BTC</span>
          <b className={MainDashboard_module_css_1.default.b1}> </b>
        </div>
        <div className={MainDashboard_module_css_1.default.solanaNetworkDiv}>Solana Network</div>
        <div className={MainDashboard_module_css_1.default.frameDiv29}>
          <div className={MainDashboard_module_css_1.default.totalValueLocked}>Website</div>
          <div className={MainDashboard_module_css_1.default.appuniswaporgDiv}>app.uniswap.org</div>
          <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy.svg"/>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv30}>
          <div className={MainDashboard_module_css_1.default.totalValueLocked}>Strategy</div>
          <div className={MainDashboard_module_css_1.default.autoCompoundingDiv}>Auto-Compounding</div>
        </div>
      </form>
      <div className={MainDashboard_module_css_1.default.groupDiv10}>
        <div className={MainDashboard_module_css_1.default.frameDiv31}>
          <div className={MainDashboard_module_css_1.default.rectangleDiv2}/>
          <div className={MainDashboard_module_css_1.default.frameDiv32}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
            <div className={MainDashboard_module_css_1.default.autoCompoundingDiv1}>Auto-Compounding</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv33}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
            <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv34}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
            <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
            <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv35}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
            <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
            <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy.svg"/>
          </div>
          <div className={MainDashboard_module_css_1.default.buttonDiv1}>
            <div className={MainDashboard_module_css_1.default.groupDiv9}>
              <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.groupDiv12}>
            <div className={MainDashboard_module_css_1.default.frameDiv36}>
              <div className={MainDashboard_module_css_1.default.verifiedDiv1}>Verified</div>
              <img className={MainDashboard_module_css_1.default.checkDecagramIcon} alt="" src="checkdecagram.svg"/>
            </div>
            <div className={MainDashboard_module_css_1.default.groupDiv13}>
              <div className={MainDashboard_module_css_1.default.groupDiv14}>
                <div className={MainDashboard_module_css_1.default.uNIDiv}>UNI</div>
                <div className={MainDashboard_module_css_1.default.ethereumNetworkDiv}>
                  Ethereum Network
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon1} alt="" src="frame-10000020681.svg"/>
        <div className={MainDashboard_module_css_1.default.aPY234Div1}>APY: 234% </div>
        <div className={MainDashboard_module_css_1.default.aPR234Div}>APR: 234% </div>
      </div>
      <div className={MainDashboard_module_css_1.default.groupDiv15}>
        <div className={MainDashboard_module_css_1.default.frameDiv31}>
          <div className={MainDashboard_module_css_1.default.rectangleDiv2}/>
          <div className={MainDashboard_module_css_1.default.frameDiv32}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
            <div className={MainDashboard_module_css_1.default.autoCompoundingDiv1}>Auto-Compounding</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv33}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
            <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv34}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
            <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
            <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
          </div>
          <div className={MainDashboard_module_css_1.default.buttonDiv1}>
            <div className={MainDashboard_module_css_1.default.groupDiv9}>
              <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.groupDiv17}>
            <div className={MainDashboard_module_css_1.default.groupDiv18}>
              <div className={MainDashboard_module_css_1.default.groupDiv18}>
                <div className={MainDashboard_module_css_1.default.bTCDiv}>
                  <span className={MainDashboard_module_css_1.default.bTCSpan}>BTC</span>
                  <b> </b>
                </div>
                <div className={MainDashboard_module_css_1.default.ethereumNetworkDiv}>Solana Network</div>
              </div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv35}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
            <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
            <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy.svg"/>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon1} alt="" src="frame-10000020682.svg"/>
        <div className={MainDashboard_module_css_1.default.aPY234Div1}>APY: 234% </div>
        <div className={MainDashboard_module_css_1.default.aPR234Div}>APR: 234% </div>
      </div>
      <div className={MainDashboard_module_css_1.default.groupDiv20}>
        <div className={MainDashboard_module_css_1.default.frameDiv31}>
          <div className={MainDashboard_module_css_1.default.rectangleDiv2}/>
          <div className={MainDashboard_module_css_1.default.frameDiv32}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
            <div className={MainDashboard_module_css_1.default.autoCompoundingDiv1}>Auto-Compounding</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv33}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
            <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv34}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
            <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
            <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
          </div>
          <div className={MainDashboard_module_css_1.default.buttonDiv1}>
            <div className={MainDashboard_module_css_1.default.groupDiv9}>
              <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.groupDiv17}>
            <div className={MainDashboard_module_css_1.default.groupDiv18}>
              <div className={MainDashboard_module_css_1.default.groupDiv18}>
                <div className={MainDashboard_module_css_1.default.uNIDiv}>ADA</div>
                <div className={MainDashboard_module_css_1.default.ethereumNetworkDiv}>Solana Network</div>
              </div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv35}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
            <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
            <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy3.svg"/>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon1} alt="" src="frame-10000020683.svg"/>
        <div className={MainDashboard_module_css_1.default.aPY234Div1}>APY: 234% </div>
        <div className={MainDashboard_module_css_1.default.aPR234Div}>APR: 234% </div>
      </div>
      <div className={MainDashboard_module_css_1.default.groupDiv25}>
        <div className={MainDashboard_module_css_1.default.frameDiv31}>
          <div className={MainDashboard_module_css_1.default.rectangleDiv2}/>
          <div className={MainDashboard_module_css_1.default.frameDiv32}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
            <div className={MainDashboard_module_css_1.default.customDiv}>Custom</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv33}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
            <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv34}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
            <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
            <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
          </div>
          <div className={MainDashboard_module_css_1.default.buttonDiv1}>
            <div className={MainDashboard_module_css_1.default.groupDiv9}>
              <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.groupDiv12}>
            <div className={MainDashboard_module_css_1.default.frameDiv36}>
              <div className={MainDashboard_module_css_1.default.verifiedDiv1}>Verified</div>
              <img className={MainDashboard_module_css_1.default.checkDecagramIcon} alt="" src="checkdecagram2.svg"/>
            </div>
            <div className={MainDashboard_module_css_1.default.groupDiv13}>
              <div className={MainDashboard_module_css_1.default.groupDiv14}>
                <div className={MainDashboard_module_css_1.default.uNIDiv}>ETH</div>
                <div className={MainDashboard_module_css_1.default.ethereumNetworkDiv}>
                  Ethereum Network
                </div>
              </div>
            </div>
          </div>
          <div className={MainDashboard_module_css_1.default.frameDiv35}>
            <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
            <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
            <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy3.svg"/>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon1} alt="" src="frame-10000020684.svg"/>
        <div className={MainDashboard_module_css_1.default.aPY234Div1}>APY: 234% </div>
        <div className={MainDashboard_module_css_1.default.aPR234Div}>APR: 234% </div>
      </div>
      <div className={MainDashboard_module_css_1.default.frameDiv53}>
        <div className={MainDashboard_module_css_1.default.rectangleDiv1}/>
        <div className={MainDashboard_module_css_1.default.frameDiv30}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
          <div className={MainDashboard_module_css_1.default.autoCompoundingDiv1}>Auto-Compounding</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv25}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
          <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv26}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
          <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
          <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon} alt="" src="frame-10000020685.svg"/>
        <div className={MainDashboard_module_css_1.default.buttonDiv5}>
          <div className={MainDashboard_module_css_1.default.groupDiv9}>
            <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.rectangleIcon} alt="" src="rectangle-150881.svg"/>
        <div className={MainDashboard_module_css_1.default.frameDiv57}>
          <div className={MainDashboard_module_css_1.default.div2}>APY: 234% </div>
          <div className={MainDashboard_module_css_1.default.aPR451}>APR : 45%</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv58}>
          <div className={MainDashboard_module_css_1.default.verifiedDiv1}>Verified</div>
          <img className={MainDashboard_module_css_1.default.checkDecagramIcon} alt="" src="checkdecagram.svg"/>
        </div>
        <div className={MainDashboard_module_css_1.default.dOTDiv}>
          <span className={MainDashboard_module_css_1.default.bTCSpan}>DOT</span>
          <b> </b>
        </div>
        <div className={MainDashboard_module_css_1.default.binanceSmartChain}>Binance Smart Chain</div>
        <div className={MainDashboard_module_css_1.default.frameDiv29}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
          <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
          <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy.svg"/>
        </div>
      </div>
      <div className={MainDashboard_module_css_1.default.frameDiv60}>
        <div className={MainDashboard_module_css_1.default.rectangleDiv1}/>
        <div className={MainDashboard_module_css_1.default.frameDiv30}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
          <div className={MainDashboard_module_css_1.default.customDiv}>Custom</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv25}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
          <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv26}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
          <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
          <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon} alt="" src="frame-10000020686.svg"/>
        <div className={MainDashboard_module_css_1.default.buttonDiv5}>
          <div className={MainDashboard_module_css_1.default.groupDiv9}>
            <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.rectangleIcon} alt="" src="rectangle-150882.svg"/>
        <div className={MainDashboard_module_css_1.default.frameDiv57}>
          <div className={MainDashboard_module_css_1.default.div2}>APY: 234% </div>
          <div className={MainDashboard_module_css_1.default.aPR451}>APR : 45%</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv58}>
          <div className={MainDashboard_module_css_1.default.verifiedDiv1}>Verified</div>
          <img className={MainDashboard_module_css_1.default.checkDecagramIcon} alt="" src="checkdecagram2.svg"/>
        </div>
        <div className={MainDashboard_module_css_1.default.sHIBADiv}>
          <span className={MainDashboard_module_css_1.default.bTCSpan}>SHIBA</span>
          <b> </b>
        </div>
        <div className={MainDashboard_module_css_1.default.ethereumNetworkDiv2}>Ethereum Network</div>
        <div className={MainDashboard_module_css_1.default.frameDiv29}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
          <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
          <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy3.svg"/>
        </div>
      </div>
      <div className={MainDashboard_module_css_1.default.frameDiv67}>
        <div className={MainDashboard_module_css_1.default.rectangleDiv1}/>
        <div className={MainDashboard_module_css_1.default.frameDiv30}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Strategy</div>
          <div className={MainDashboard_module_css_1.default.autoCompoundingDiv1}>Auto-Compounding</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv25}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Total Value Locked</div>
          <div className={MainDashboard_module_css_1.default.mDiv1}>$100M</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv26}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Reward Token</div>
          <div className={MainDashboard_module_css_1.default.cakeDiv1}>Cake</div>
          <img className={MainDashboard_module_css_1.default.ellipseIcon5} alt="" src="ellipse-8@2x.png"/>
        </div>
        <img className={MainDashboard_module_css_1.default.frameIcon} alt="" src="frame-10000020687.svg"/>
        <div className={MainDashboard_module_css_1.default.buttonDiv5}>
          <div className={MainDashboard_module_css_1.default.groupDiv9}>
            <div className={MainDashboard_module_css_1.default.enterDiv}>Enter Vault</div>
          </div>
        </div>
        <img className={MainDashboard_module_css_1.default.rectangleIcon} alt="" src="rectangle-150883.svg"/>
        <div className={MainDashboard_module_css_1.default.frameDiv57}>
          <div className={MainDashboard_module_css_1.default.div2}>APY: 234% </div>
          <div className={MainDashboard_module_css_1.default.aPR451}>APR : 45%</div>
        </div>
        <div className={MainDashboard_module_css_1.default.frameDiv58}>
          <div className={MainDashboard_module_css_1.default.verifiedDiv1}>Verified</div>
          <img className={MainDashboard_module_css_1.default.checkDecagramIcon} alt="" src="checkdecagram2.svg"/>
        </div>
        <div className={MainDashboard_module_css_1.default.uSDTDiv}>USDT</div>
        <div className={MainDashboard_module_css_1.default.solanaNetworkDiv3}>Solana Network</div>
        <div className={MainDashboard_module_css_1.default.frameDiv29}>
          <div className={MainDashboard_module_css_1.default.metamaskDiv}>Website</div>
          <div className={MainDashboard_module_css_1.default.appuniswaporgDiv1}>app.uniswap.org</div>
          <img className={MainDashboard_module_css_1.default.contentCopyIcon} alt="" src="contentcopy3.svg"/>
        </div>
      </div>

      <h1 className={MainDashboard_module_css_1.default.tableTopHeading}>All Valuts</h1>
    </div>);
};
exports.MainDashboard = MainDashboard;
//# sourceMappingURL=MainDashboard.js.map