import styles from "./css/vaultsection.module.css";
import { TrendingVaultCard, VerfiedVaultCard } from "./vaultcards";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { VaultModal } from "./vaultModal";
import { DatabaseContext } from "./Contexts/DatabaseContext";

export const VaultSection = (props: any) => {
  const {
    fullProtocolsList,
    fullAddressesList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
  } = useContext(DatabaseContext);

  const [vaultsList, setVaultslist] = useState<any>([]);
  const [verifiedVaultsBackable, setVerifiedVaultsBackable] = useState(false);
  const [numOfVerifiedScrolls, setNumOfVerifiedScrolls] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollingTrending, setIsScrollingTrending] = useState(false);
  const [trendingVaultsBackable, setTrendingVaultsBackable] = useState(false);
  const [numOfTrendingScrolls, setNumOfTrendingScrolls] = useState(0);
  const [verifiedReachedEnd, setVerifiedReachedEnd] = useState(false);
  const [trendingReachedEnd, setTrendingReachedEnd] = useState(false);
  let somerandomvar = false;
  useEffect(() => {
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

  useEffect(() => {
    if (isScrolling) {
      setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    }
  }, [isScrolling]);

  useEffect(() => {
    if (isScrollingTrending) {
      setTimeout(() => {
        setIsScrollingTrending(false);
      }, 700);
    }
  }, [isScrollingTrending]);

  const handleRightScroll = () => {
    let right: any = document.querySelector("#vaultsSection");
    setIsScrolling(true);
    right!.scrollBy(350, 0);
    setNumOfVerifiedScrolls(numOfVerifiedScrolls + 1);
  };

  const handleRightScrollTrending = () => {
    let right: any = document.querySelector("#trendingVaultsSection");
    setIsScrollingTrending(true);
    right.scrollBy(250, 0);
    setNumOfTrendingScrolls(numOfTrendingScrolls + 1);
  };

  const handleBackScroll = () => {
    let back: any = document.querySelector("#vaultsSection");
    back.scrollBy(-100, 0);
    if (numOfVerifiedScrolls > 0) {
      setNumOfVerifiedScrolls(numOfVerifiedScrolls - 1);
    }

    setIsScrolling(false);
  };

  const handleTrendingBackScroll = () => {
    let back: any = document.querySelector("#trendingVaultsSection");
    back.scrollBy(-100, 0);

    if (numOfTrendingScrolls > 0) {
      setNumOfTrendingScrolls(numOfTrendingScrolls - 1);
    }

    setIsScrollingTrending(false);
  };

  const handleScroll = (e: any) => {};

  return (
    <div className={styles.vaultsection}>
      <div className={styles.statsDiv}>
        <div className={styles.flexDiv2}>
          <div>
            <div className={styles.statTitle}>My Total Deposits</div>
            <div className={styles.statValue}>$ 50,000</div>
          </div>
          <div>
            <div className={styles.statTitle}>Claimable Rewards</div>
            <div className={styles.statValue}>$ 50,000</div>
          </div>
          <div>
            <div className={styles.statTitle}>
              Staked YC <a>Stake for 300% APR</a>
            </div>
            <div className={styles.statValue}>50,000,000</div>
          </div>
        </div>
        <div className={styles.flexDiv3}>
          <div>
            <div className={styles.statTitle}>Total Vaults</div>
            <div className={styles.statValue}>234</div>
          </div>
          <div>
            <div className={styles.statTitle}>My Vaults</div>
            <div className={styles.statValue}>14</div>
          </div>
          <button className={styles.createBtn}>
            <img src="Vector (10).png" /> Create Vault
          </button>
        </div>
      </div>
      <div className={styles.flexDiv} id="verifiedVaultsGrid">
        <div className={styles.title}>Verified Vaults</div>
        <div className={styles.arrows}>
          <button
            className={
              numOfVerifiedScrolls <= 0 ? styles.arrowOff : styles.backArrowOn
            }
            onClick={handleBackScroll}
            onScroll={handleScroll}
          >
            <img className={styles.arrowImg} alt="" src="Vector (13).png" />
          </button>
          <button
            className={
              !verifiedReachedEnd
                ? isScrolling
                  ? styles.arrowOff
                  : styles.arrowOn
                : styles.arrowOff
            }
            onClick={handleRightScroll}
          >
            <img className={styles.arrowImg} alt="" src="Vector (12).png" />
          </button>
        </div>
      </div>
      <div className={styles.cards} id="vaultsSection">
        {/* {<VerfiedVaultCard vaultDetails={vaultsList[0]} />} */}
        {vaultsList.length == 0 ? (
          <h1> Loading... </h1>
        ) : (
          vaultsList
            .filter((strategyObj: any) => strategyObj.is_verified == 1)
            .map((strategyObj: any, index: number) => (
              <VerfiedVaultCard
                key={index}
                vaultDetails={strategyObj}
                modalHandler={props.modalHandler}
              />
            ))
        )}
      </div>

      <div className={styles.trendingVault}>
        <div className={styles.flexDiv}>
          <div className={styles.title}>Trending Vaults</div>
          <div className={styles.arrows}>
            <button
              className={
                numOfVerifiedScrolls <= 0 ? styles.arrowOff : styles.backArrowOn
              }
              onClick={handleTrendingBackScroll}
              onScroll={handleScroll}
            >
              <img className={styles.arrowImg} alt="" src="Vector (13).png" />
            </button>
            <button
              className={
                !trendingReachedEnd
                  ? isScrollingTrending
                    ? styles.arrowOff
                    : styles.arrowOn
                  : styles.arrowOff
              }
              onClick={handleRightScrollTrending}
            >
              <img className={styles.arrowImg} alt="" src="Vector (12).png" />
            </button>
          </div>
        </div>
        <div className={styles.cards} id="trendingVaultsSection">
          {vaultsList.length == 0
            ? "Loading!!!"
            : vaultsList
                .filter((strategyObj: any) => strategyObj.is_trending == true)
                .map((strategyObj: any, index: number) => (
                  <TrendingVaultCard
                    key={strategyObj.strategy_identifier}
                    vaultDetails={strategyObj}
                    modalHandler={props.modalHandler}
                  />
                ))}
        </div>
      </div>
      <span></span>
    </div>
  );
};

export default VaultSection;
