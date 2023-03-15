import { FunctionComponent } from "react";
import styles from "./css/ConfirmStrategy.module.css";
import { BuildingBlock } from "./BuildingBlock";

export const ConfirmStrategy: FunctionComponent = () => {
  return (
    <div className={styles.modalDiv}>
      <div className={styles.groupDiv1}>
        <div className={styles.titleDiv}>Confirm Strategy</div>
        <div className={styles.contentDiv}>
          <div className={styles.subtitleDiv}>
            Stake Cake on Pancakeswap, Harvest Cake, Stake 50% Cake on
            Pancakeswap, Swap 50% to MATIC on polygon network.{" "}
            <span className={styles.linkText}>Read more</span>
          </div>
          <div className={styles.inputGrp}>
            <div className={styles.inputGrpTitle}>APY / APR</div>
            <div className={styles.inputSection}>
              <div className={styles.topInputSection}>
                <input placeholder="New APY" className={styles.inputField} />
                <div className={styles.value}>220%</div>
              </div>
              <div className={styles.bottomInputSection}>
                <input placeholder="Old APY" className={styles.inputField} />
                <div>120%</div>
              </div>
            </div>
          </div>
          <div className={styles.inputGrp}>
            <div className={styles.inputGrpTitle}>Token Details</div>
            <div className={styles.inputSection}>
              <div className={styles.topInputSection}>
                <input
                  placeholder="Initial Staked Token"
                  className={styles.inputField}
                />
                <div className={styles.valueGrp}>
                  <div>BNB</div>
                  <img src="bnb.svg" />
                </div>
              </div>
              <div className={styles.bottomInputSection}>
                <input
                  placeholder="Reward Token"
                  className={styles.inputField}
                />
                <div className={styles.valueGrp}>
                  <div>Cake</div>
                  <img src="cake.svg" />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.inputGrp}>
            <div className={styles.inputGrpTitle}>Performance Fees</div>
            <div className={styles.inputSection}>
              <div className={styles.bottomInputSection}>
                <input
                  placeholder="Vault Gas Fees"
                  className={styles.inputField}
                />
                <div className={styles.valueGrp}>
                  <div>120.78%</div>
                  <img src="Vector.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btns}>
          <button className={styles.cancelBtn}>Cancel</button>
          <button className={styles.saveBtn}>Save Duration</button>
        </div>
      </div>
      <div className={styles.groupDiv2}>
        <div className={styles.titleDiv}>Building Blocks</div>
        <div className={styles.blocks}>
          <div className={styles.block}>
            <BuildingBlock src="cake.svg">
              <div className={styles.innerText}>Stake: </div>
              <img src="Ellipse 9.svg" />
              <img src="arrow.svg" />
              <img src="Ellipse 9.svg" />
            </BuildingBlock>
            <div className={styles.connector}></div>
            <div className={styles.curvedConnector}></div>
          </div>
          <div className={styles.flexBlocks}>
            <div className={styles.block}>
              <BuildingBlock src="cake.svg">
                <div className={styles.innerText}>Stake: </div>
                <img src="Ellipse 9.svg" />
                <img src="arrow.svg" />
                <img src="Ellipse 9.svg" />
              </BuildingBlock>
              <div className={styles.connector}></div>
            </div>
            <BuildingBlock src="cake.svg">
              <div className={styles.innerText}>Stake: </div>
              <img src="Ellipse 9.svg" />
              <img src="arrow.svg" />
              <img src="Ellipse 9.svg" />
            </BuildingBlock>
          </div>
          <div className={styles.block}>
            <BuildingBlock src="cake.svg">
              <div className={styles.innerText}>Stake: </div>
              <img src="Ellipse 9.svg" />
              <img src="arrow.svg" />
              <img src="Ellipse 9.svg" />
            </BuildingBlock>
            <div className={styles.connector}></div>
          </div>
          <div className={styles.block}>
            <BuildingBlock src="cake.svg">
              <div className={styles.innerText}>Stake: </div>
              <img src="Ellipse 9.svg" />
              <img src="arrow.svg" />
              <img src="Ellipse 9.svg" />
            </BuildingBlock>
            <div className={styles.connector}></div>
            <div className={styles.curvedConnector}></div>
          </div>
          <div className={styles.flexBlocks}>
            <div className={styles.block}>
              <BuildingBlock src="cake.svg">
                <div className={styles.innerText}>Stake: </div>
                <img src="Ellipse 9.svg" />
                <img src="arrow.svg" />
                <img src="Ellipse 9.svg" />
              </BuildingBlock>
              <div className={styles.connector}></div>
            </div>
            <div className={styles.block}>
              <BuildingBlock src="cake.svg">
                <div className={styles.innerText}>Stake: </div>
                <img src="Ellipse 9.svg" />
                <img src="arrow.svg" />
                <img src="Ellipse 9.svg" />
              </BuildingBlock>
              <div className={styles.connector}></div>
            </div>
          </div>

          <div className={styles.flexBlocks}>
            <BuildingBlock src="cake.svg">
              <div className={styles.innerText}>Stake: </div>
              <img src="Ellipse 9.svg" />
              <img src="arrow.svg" />
              <img src="Ellipse 9.svg" />
            </BuildingBlock>

            <BuildingBlock src="cake.svg">
              <div className={styles.innerText}>Stake: </div>
              <img src="Ellipse 9.svg" />
              <img src="arrow.svg" />
              <img src="Ellipse 9.svg" />
            </BuildingBlock>
          </div>
        </div>
      </div>
    </div>
  );
};
