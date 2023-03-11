import { useState } from "react";
import styles from "./css/herosection.module.css";

const HeroSection = () => {
  const [showNetworks, setShowNetworks] = useState(false);
  const [toggle, setToggle] = useState(false);

  const openNetworks = () => {
    setShowNetworks(!showNetworks);
  };

  const switchToggle = () => {
    setToggle(!toggle);
  };
  return (
    <div className={styles.herosection}>
      <div className={styles.title}>Strategy Vaults</div>
      <div className={styles.subtitle}>
        Search for a Vault ID, token or protocol, invest in the vault and
        receive massive
        <br />
        APY’s with the click of a button
      </div>
      <div className={styles.searchFieldWrapper}>
        <img src="Vector (9).png" className={styles.searchIcon} />
        <input
          placeholder="Search for a vault ID, token or protocol"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.flexDiv1}>
        <div className={styles.clips}>
          <button className={styles.clip} id="AllNetworks">
            <img src="Group 4912.png" className={styles.clipImg} />
            <div className={styles.clipname}>All Networks</div>
          </button>
          <button className={styles.clip} id="BNBChain">
            <img src="Ellipse 27.png" className={styles.clipImg} />
            <div className={styles.clipname}>Binance SC</div>
          </button>
          <button className={styles.clip} id="Avalanche">
            <img src="Ellipse 28.png" className={styles.clipImg} />
            <div className={styles.clipname}>Avalanche</div>
          </button>
          <button className={styles.clip}>
            <img src="Ellipse 33.png" className={styles.clipImg} />
            <div className={styles.clipname}>Ethereum</div>
          </button>
          <button className={styles.clip}>
            <img src="Ellipse 33 (4).png" className={styles.clipImg} />
            <div className={styles.clipname}>Polygon</div>
          </button>
          <div className={styles.moreDiv}>
            <button className={styles.clip} onClick={openNetworks}>
              <div className={styles.moretitle}>More</div>
              <img src="Vector (8).png" className={styles.moreclips} />
            </button>
            {showNetworks && (
              <div className={styles.moreNetworks}>
                <div>Network 1</div>
                <div>Network 2</div>
                <div>Network 3</div>
                <div>Network 4</div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.flexDiv2}>
          <div className={styles.flexDiv3}>
            <div className={styles.vaultDiv}>My Vaults only</div>
            <div className={styles.toggle}>
              <div className={styles.floor}></div>
              <div
                className={` ${toggle ? styles.slidethumb : styles.thumb} `}
                onClick={switchToggle}
              ></div>
            </div>
          </div>
          <div className={styles.filterBox}>
            Filter <div>2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
