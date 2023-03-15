import React, { FunctionComponent, useCallback } from "react";
import { SearchBoxComponent } from "./SearchBoxComponent";
import { TextArea } from "./TextArea";
import styles from "./css/MainDashboard.module.css";
import { useNavigate } from "react-router-dom";

export const MainDashboard: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.mainDashboardDiv}>
      <form
        className={styles.frameForm}
        action="https://yieldchain.io/"
        method="post"
        autoComplete="on"
      >
        <img className={styles.ellipseIcon1} alt="" src="ellipse-15.svg" />
        <img className={styles.icon24cursor} alt="" src="icon24cursor3.svg" />
        <div className={styles.groupDiv2}>
          <div className={styles.groupDiv3}>
            <div className={styles.strategyVaultsDiv}>Strategy Vaults</div>
            <div className={styles.searchForAVaultIDTokenO}>
              Search for a Vault ID, token or protocol, invest in the vault and
              receive massive APY’s with the click of a button
            </div>
          </div>
          <div className={styles.groupDiv4}>
            <div className={styles.groupDiv5}>
              <SearchBoxComponent />
              <div className={styles.iconSearch}>
                <img className={styles.icon1} alt="" src="icon1.svg" />
              </div>
            </div>
          </div>
        </div>
        {/* <img className={styles.ellipseIcon2} alt="" /> */}
        <div className={styles.frameDiv2}>
          <div className={styles.frameDiv3}>
            <div className={styles.groupIcon}>
              <img
                className={styles.ellipseIcon3}
                alt=""
                src="ellipse-27.svg"
              />
              <img
                className={styles.yieldchainLogo11}
                alt=""
                src="yieldchain-logo-13@2x.png"
              />
            </div>
            <b className={styles.allNetworksB}>All Networks</b>
          </div>
          <div className={styles.frameDiv3}>
            <img className={styles.groupIcon} alt="" src="group-Binance.svg" />
            <div className={styles.binanceSCDiv}>Binance SC</div>
          </div>
          <div className={styles.frameDiv3}>
            <img
              className={styles.groupIcon}
              alt=""
              src="group-Avalanche.svg"
            />
            <div className={styles.binanceSCDiv}>Avalanche</div>
          </div>
          <div className={styles.frameDiv3}>
            <img className={styles.groupIcon} alt="" src="group-Ethereum.svg" />
            <div className={styles.binanceSCDiv}>Ethereum</div>
          </div>
          <div className={styles.frameDiv3}>
            <img className={styles.groupIcon} alt="" src="group-Polygon.svg" />
            <div className={styles.binanceSCDiv}>Polygon</div>
          </div>
          <div className={styles.frameDiv8}>
            <div className={styles.binanceSCDiv}>More</div>
            <img className={styles.plusIcon} alt="" src="chevrondown.svg" />
          </div>
        </div>
        <div className={styles.groupDiv8}>
          <div className={styles.frameDiv9}>
            <div className={styles.frameDiv10}>
              <div className={styles.filterDiv}>Filter</div>
            </div>
            <div className={styles.switchAOnaEnabled}>
              <img
                className={styles.ellipseIcon4}
                alt=""
                src="ellipse-13.svg"
              />
              <b className={styles.b}>2</b>
            </div>
          </div>
          <div className={styles.frameDiv12}>
            <b className={styles.dashboard}>My Vaults only</b>
            <div className={styles.switchAOnaEnabled}>
              <div className={styles.colorLTrack} />
              <img
                className={styles.colorLThumb}
                alt=""
                src="-color-l-thumb.svg"
              />
            </div>
          </div>
        </div>
      </form>

      <div className={styles.frameDiv15}>
        <div className={styles.rectangleDiv} />
        <div className={styles.frameDiv16}>
          <div className={styles.frameDiv1}>
            <img className={styles.plusIcon} alt="" src="plus.svg" />
            <div className={styles.createVaultDiv}>Create Vault</div>
          </div>
        </div>
        <div className={styles.frameDiv18}>
          <div className={styles.totalVaultsDiv}>Total Vaults</div>
          <div className={styles.div}>234</div>
        </div>
        <div className={styles.frameDiv19}>
          <div className={styles.totalVaultsDiv}>My Vaults</div>
          <div className={styles.div}>14</div>
        </div>
        <div className={styles.frameDiv20}>
          <div className={styles.frameDiv21}>
            <div className={styles.totalVaultsDiv}>Stacked YC</div>
            <div className={styles.stakeFor300APR}>Stake for 300% APR</div>
          </div>
          <div className={styles.frameDiv22}>
            <div className={styles.div2}>50,000,000</div>
          </div>
        </div>
        <div className={styles.frameDiv23}>
          <div className={styles.totalVaultsDiv}>My Total Deposits</div>
          <div className={styles.div}>$ 50,000</div>
        </div>
        <div className={styles.frameDiv24}>
          <div className={styles.totalVaultsDiv}>Claimable Rewards</div>
          <div className={styles.div}>$ 50,000</div>
        </div>
      </div>
      <div className={styles.verifiedVaultsDiv}>Verified Vaults</div>
      <div className={styles.trendingVaultsDiv}>Trending Vaults</div>
      <img className={styles.groupIcon4} alt="" src="group-43927.svg" />
      <img className={styles.groupIcon5} alt="" src="group-1000002028.svg" />
      <form className={styles.frameForm1}>
        <div className={styles.rectangleDiv1} />
        <div className={styles.frameDiv25}>
          <div className={styles.totalValueLocked}>Total Value Locked</div>
          <div className={styles.mDiv}>$100M</div>
        </div>
        <div className={styles.frameDiv26}>
          <div className={styles.totalValueLocked}>Reward Token</div>
          <div className={styles.cakeDiv}>Cake</div>
          <img className={styles.ellipseIcon5} alt="" src="ellipse-8@2x.png" />
        </div>
        <img className={styles.frameIcon} alt="" src="frame-1000002068.svg" />
        <div className={styles.buttonDiv}>
          <div className={styles.groupDiv9}>
            <div className={styles.enterVaultDiv}>Enter Vault</div>
          </div>
        </div>
        <img
          className={styles.rectangleIcon}
          alt=""
          src="rectangle-15088.svg"
        />
        <div className={styles.frameDiv27}>
          <div className={styles.aPY234Div}>APY: 234% </div>
          <div className={styles.aPR45}>APR : 45%</div>
        </div>
        <div className={styles.frameDiv28}>
          <div className={styles.verifiedDiv}>Verified</div>
          <img
            className={styles.checkDecagramIcon}
            alt=""
            src="checkdecagram.svg"
          />
        </div>
        <div className={styles.uSDTBTCDiv}>
          <span className={styles.uSDTBTCSpan}>USDT/BTC</span>
          <b className={styles.b1}> </b>
        </div>
        <div className={styles.solanaNetworkDiv}>Solana Network</div>
        <div className={styles.frameDiv29}>
          <div className={styles.totalValueLocked}>Website</div>
          <div className={styles.appuniswaporgDiv}>app.uniswap.org</div>
          <img
            className={styles.contentCopyIcon}
            alt=""
            src="contentcopy.svg"
          />
        </div>
        <div className={styles.frameDiv30}>
          <div className={styles.totalValueLocked}>Strategy</div>
          <div className={styles.autoCompoundingDiv}>Auto-Compounding</div>
        </div>
      </form>
      <div className={styles.groupDiv10}>
        <div className={styles.frameDiv31}>
          <div className={styles.rectangleDiv2} />
          <div className={styles.frameDiv32}>
            <div className={styles.metamaskDiv}>Strategy</div>
            <div className={styles.autoCompoundingDiv1}>Auto-Compounding</div>
          </div>
          <div className={styles.frameDiv33}>
            <div className={styles.metamaskDiv}>Total Value Locked</div>
            <div className={styles.mDiv1}>$100M</div>
          </div>
          <div className={styles.frameDiv34}>
            <div className={styles.metamaskDiv}>Reward Token</div>
            <div className={styles.cakeDiv1}>Cake</div>
            <img
              className={styles.ellipseIcon5}
              alt=""
              src="ellipse-8@2x.png"
            />
          </div>
          <div className={styles.frameDiv35}>
            <div className={styles.metamaskDiv}>Website</div>
            <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
            <img
              className={styles.contentCopyIcon}
              alt=""
              src="contentcopy.svg"
            />
          </div>
          <div className={styles.buttonDiv1}>
            <div className={styles.groupDiv9}>
              <div className={styles.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={styles.groupDiv12}>
            <div className={styles.frameDiv36}>
              <div className={styles.verifiedDiv1}>Verified</div>
              <img
                className={styles.checkDecagramIcon}
                alt=""
                src="checkdecagram.svg"
              />
            </div>
            <div className={styles.groupDiv13}>
              <div className={styles.groupDiv14}>
                <div className={styles.uNIDiv}>UNI</div>
                <div className={styles.ethereumNetworkDiv}>
                  Ethereum Network
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className={styles.frameIcon1} alt="" src="frame-10000020681.svg" />
        <div className={styles.aPY234Div1}>APY: 234% </div>
        <div className={styles.aPR234Div}>APR: 234% </div>
      </div>
      <div className={styles.groupDiv15}>
        <div className={styles.frameDiv31}>
          <div className={styles.rectangleDiv2} />
          <div className={styles.frameDiv32}>
            <div className={styles.metamaskDiv}>Strategy</div>
            <div className={styles.autoCompoundingDiv1}>Auto-Compounding</div>
          </div>
          <div className={styles.frameDiv33}>
            <div className={styles.metamaskDiv}>Total Value Locked</div>
            <div className={styles.mDiv1}>$100M</div>
          </div>
          <div className={styles.frameDiv34}>
            <div className={styles.metamaskDiv}>Reward Token</div>
            <div className={styles.cakeDiv1}>Cake</div>
            <img
              className={styles.ellipseIcon5}
              alt=""
              src="ellipse-8@2x.png"
            />
          </div>
          <div className={styles.buttonDiv1}>
            <div className={styles.groupDiv9}>
              <div className={styles.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={styles.groupDiv17}>
            <div className={styles.groupDiv18}>
              <div className={styles.groupDiv18}>
                <div className={styles.bTCDiv}>
                  <span className={styles.bTCSpan}>BTC</span>
                  <b> </b>
                </div>
                <div className={styles.ethereumNetworkDiv}>Solana Network</div>
              </div>
            </div>
          </div>
          <div className={styles.frameDiv35}>
            <div className={styles.metamaskDiv}>Website</div>
            <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
            <img
              className={styles.contentCopyIcon}
              alt=""
              src="contentcopy.svg"
            />
          </div>
        </div>
        <img className={styles.frameIcon1} alt="" src="frame-10000020682.svg" />
        <div className={styles.aPY234Div1}>APY: 234% </div>
        <div className={styles.aPR234Div}>APR: 234% </div>
      </div>
      <div className={styles.groupDiv20}>
        <div className={styles.frameDiv31}>
          <div className={styles.rectangleDiv2} />
          <div className={styles.frameDiv32}>
            <div className={styles.metamaskDiv}>Strategy</div>
            <div className={styles.autoCompoundingDiv1}>Auto-Compounding</div>
          </div>
          <div className={styles.frameDiv33}>
            <div className={styles.metamaskDiv}>Total Value Locked</div>
            <div className={styles.mDiv1}>$100M</div>
          </div>
          <div className={styles.frameDiv34}>
            <div className={styles.metamaskDiv}>Reward Token</div>
            <div className={styles.cakeDiv1}>Cake</div>
            <img
              className={styles.ellipseIcon5}
              alt=""
              src="ellipse-8@2x.png"
            />
          </div>
          <div className={styles.buttonDiv1}>
            <div className={styles.groupDiv9}>
              <div className={styles.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={styles.groupDiv17}>
            <div className={styles.groupDiv18}>
              <div className={styles.groupDiv18}>
                <div className={styles.uNIDiv}>ADA</div>
                <div className={styles.ethereumNetworkDiv}>Solana Network</div>
              </div>
            </div>
          </div>
          <div className={styles.frameDiv35}>
            <div className={styles.metamaskDiv}>Website</div>
            <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
            <img
              className={styles.contentCopyIcon}
              alt=""
              src="contentcopy3.svg"
            />
          </div>
        </div>
        <img className={styles.frameIcon1} alt="" src="frame-10000020683.svg" />
        <div className={styles.aPY234Div1}>APY: 234% </div>
        <div className={styles.aPR234Div}>APR: 234% </div>
      </div>
      <div className={styles.groupDiv25}>
        <div className={styles.frameDiv31}>
          <div className={styles.rectangleDiv2} />
          <div className={styles.frameDiv32}>
            <div className={styles.metamaskDiv}>Strategy</div>
            <div className={styles.customDiv}>Custom</div>
          </div>
          <div className={styles.frameDiv33}>
            <div className={styles.metamaskDiv}>Total Value Locked</div>
            <div className={styles.mDiv1}>$100M</div>
          </div>
          <div className={styles.frameDiv34}>
            <div className={styles.metamaskDiv}>Reward Token</div>
            <div className={styles.cakeDiv1}>Cake</div>
            <img
              className={styles.ellipseIcon5}
              alt=""
              src="ellipse-8@2x.png"
            />
          </div>
          <div className={styles.buttonDiv1}>
            <div className={styles.groupDiv9}>
              <div className={styles.enterDiv}>Enter Vault</div>
            </div>
          </div>
          <div className={styles.groupDiv12}>
            <div className={styles.frameDiv36}>
              <div className={styles.verifiedDiv1}>Verified</div>
              <img
                className={styles.checkDecagramIcon}
                alt=""
                src="checkdecagram2.svg"
              />
            </div>
            <div className={styles.groupDiv13}>
              <div className={styles.groupDiv14}>
                <div className={styles.uNIDiv}>ETH</div>
                <div className={styles.ethereumNetworkDiv}>
                  Ethereum Network
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frameDiv35}>
            <div className={styles.metamaskDiv}>Website</div>
            <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
            <img
              className={styles.contentCopyIcon}
              alt=""
              src="contentcopy3.svg"
            />
          </div>
        </div>
        <img className={styles.frameIcon1} alt="" src="frame-10000020684.svg" />
        <div className={styles.aPY234Div1}>APY: 234% </div>
        <div className={styles.aPR234Div}>APR: 234% </div>
      </div>
      <div className={styles.frameDiv53}>
        <div className={styles.rectangleDiv1} />
        <div className={styles.frameDiv30}>
          <div className={styles.metamaskDiv}>Strategy</div>
          <div className={styles.autoCompoundingDiv1}>Auto-Compounding</div>
        </div>
        <div className={styles.frameDiv25}>
          <div className={styles.metamaskDiv}>Total Value Locked</div>
          <div className={styles.mDiv1}>$100M</div>
        </div>
        <div className={styles.frameDiv26}>
          <div className={styles.metamaskDiv}>Reward Token</div>
          <div className={styles.cakeDiv1}>Cake</div>
          <img className={styles.ellipseIcon5} alt="" src="ellipse-8@2x.png" />
        </div>
        <img className={styles.frameIcon} alt="" src="frame-10000020685.svg" />
        <div className={styles.buttonDiv5}>
          <div className={styles.groupDiv9}>
            <div className={styles.enterDiv}>Enter Vault</div>
          </div>
        </div>
        <img
          className={styles.rectangleIcon}
          alt=""
          src="rectangle-150881.svg"
        />
        <div className={styles.frameDiv57}>
          <div className={styles.div2}>APY: 234% </div>
          <div className={styles.aPR451}>APR : 45%</div>
        </div>
        <div className={styles.frameDiv58}>
          <div className={styles.verifiedDiv1}>Verified</div>
          <img
            className={styles.checkDecagramIcon}
            alt=""
            src="checkdecagram.svg"
          />
        </div>
        <div className={styles.dOTDiv}>
          <span className={styles.bTCSpan}>DOT</span>
          <b> </b>
        </div>
        <div className={styles.binanceSmartChain}>Binance Smart Chain</div>
        <div className={styles.frameDiv29}>
          <div className={styles.metamaskDiv}>Website</div>
          <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
          <img
            className={styles.contentCopyIcon}
            alt=""
            src="contentcopy.svg"
          />
        </div>
      </div>
      <div className={styles.frameDiv60}>
        <div className={styles.rectangleDiv1} />
        <div className={styles.frameDiv30}>
          <div className={styles.metamaskDiv}>Strategy</div>
          <div className={styles.customDiv}>Custom</div>
        </div>
        <div className={styles.frameDiv25}>
          <div className={styles.metamaskDiv}>Total Value Locked</div>
          <div className={styles.mDiv1}>$100M</div>
        </div>
        <div className={styles.frameDiv26}>
          <div className={styles.metamaskDiv}>Reward Token</div>
          <div className={styles.cakeDiv1}>Cake</div>
          <img className={styles.ellipseIcon5} alt="" src="ellipse-8@2x.png" />
        </div>
        <img className={styles.frameIcon} alt="" src="frame-10000020686.svg" />
        <div className={styles.buttonDiv5}>
          <div className={styles.groupDiv9}>
            <div className={styles.enterDiv}>Enter Vault</div>
          </div>
        </div>
        <img
          className={styles.rectangleIcon}
          alt=""
          src="rectangle-150882.svg"
        />
        <div className={styles.frameDiv57}>
          <div className={styles.div2}>APY: 234% </div>
          <div className={styles.aPR451}>APR : 45%</div>
        </div>
        <div className={styles.frameDiv58}>
          <div className={styles.verifiedDiv1}>Verified</div>
          <img
            className={styles.checkDecagramIcon}
            alt=""
            src="checkdecagram2.svg"
          />
        </div>
        <div className={styles.sHIBADiv}>
          <span className={styles.bTCSpan}>SHIBA</span>
          <b> </b>
        </div>
        <div className={styles.ethereumNetworkDiv2}>Ethereum Network</div>
        <div className={styles.frameDiv29}>
          <div className={styles.metamaskDiv}>Website</div>
          <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
          <img
            className={styles.contentCopyIcon}
            alt=""
            src="contentcopy3.svg"
          />
        </div>
      </div>
      <div className={styles.frameDiv67}>
        <div className={styles.rectangleDiv1} />
        <div className={styles.frameDiv30}>
          <div className={styles.metamaskDiv}>Strategy</div>
          <div className={styles.autoCompoundingDiv1}>Auto-Compounding</div>
        </div>
        <div className={styles.frameDiv25}>
          <div className={styles.metamaskDiv}>Total Value Locked</div>
          <div className={styles.mDiv1}>$100M</div>
        </div>
        <div className={styles.frameDiv26}>
          <div className={styles.metamaskDiv}>Reward Token</div>
          <div className={styles.cakeDiv1}>Cake</div>
          <img className={styles.ellipseIcon5} alt="" src="ellipse-8@2x.png" />
        </div>
        <img className={styles.frameIcon} alt="" src="frame-10000020687.svg" />
        <div className={styles.buttonDiv5}>
          <div className={styles.groupDiv9}>
            <div className={styles.enterDiv}>Enter Vault</div>
          </div>
        </div>
        <img
          className={styles.rectangleIcon}
          alt=""
          src="rectangle-150883.svg"
        />
        <div className={styles.frameDiv57}>
          <div className={styles.div2}>APY: 234% </div>
          <div className={styles.aPR451}>APR : 45%</div>
        </div>
        <div className={styles.frameDiv58}>
          <div className={styles.verifiedDiv1}>Verified</div>
          <img
            className={styles.checkDecagramIcon}
            alt=""
            src="checkdecagram2.svg"
          />
        </div>
        <div className={styles.uSDTDiv}>USDT</div>
        <div className={styles.solanaNetworkDiv3}>Solana Network</div>
        <div className={styles.frameDiv29}>
          <div className={styles.metamaskDiv}>Website</div>
          <div className={styles.appuniswaporgDiv1}>app.uniswap.org</div>
          <img
            className={styles.contentCopyIcon}
            alt=""
            src="contentcopy3.svg"
          />
        </div>
      </div>

      <h1 className={styles.tableTopHeading}>All Valuts</h1>
    </div>
  );
};
