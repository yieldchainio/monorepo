import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react";
import { useAsync } from "react-async";
import styles from "./css/chooseToken.module.css";
import { motion } from "framer-motion";
import { NetworksSection } from "./networksSection";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { isAbsolute } from "path";

export const ChooseTokenModal = (props: any) => {
  /***************************************************************************
   * @Strategy - Current Session's Strategy Context
   **************************************************************************/

  /**************************************************************************
   * @Database - Database Context
   *************************************************************************/
  const {
    fullProtocolsList,
    fullAddressesList,
    fullTokensList,
    fullNetworksList,
    fullStrategiesList,
    fullProtocolsNetworksList,
    protocolsAddressesList,
    accountAddress,
    setAccountAddress,
    baseStrategyABI,
    erc20ABI,
    provider,
    signer,
  } = useContext(DatabaseContext);

  /**
   * Keeps Track Of The Input Value
   */
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * Chooses The Selected Token
   */

  const handleTokenChoice = async (tokenObj: any) => {
    props.modalHandler();
    props.setToken(tokenObj);
  };

  useEffect(() => {}, [inputValue]);

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        className={styles.blurbackground}
        style={{ overflow: "hidden" }}
        onClick={() => props.modalHandler()}
      >
        <div
          className={styles.modalBackground}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.titleText}>{props.titleText}</div>
          <motion.img
            src="/closeBtn.svg"
            alt=""
            className={styles.closeBtn}
            onClick={() => props.modalHandler()}
            whileHover={{ scale: 0.9, opacity: 0.8 }}
          />
          <input
            type="text"
            className={styles.inputTokenContainer}
            placeholder="Enter Token Name, Symbol OR Contract Address"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className={styles.tokensList}>
            {!fullTokensList
              ? "Loading Tokens..."
              : fullTokensList
                  .filter(
                    (token: any, index: number) =>
                      fullTokensList.findIndex(
                        (tokenObj: any) =>
                          tokenObj.address == token.address &&
                          tokenObj.chain_id == token.chain_id
                      ) == index
                  )
                  .filter(
                    (token: any) =>
                      token.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      token.symbol
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      token.address
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                  )
                  .map((token: any, index: any) => (
                    <motion.div
                      className={styles.tokenItemContainer}
                      key={index}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.24)" }}
                      onClick={() => handleTokenChoice(token)}
                    >
                      <img
                        src={token.logo ? token.logo : "/tokenplaceholder.svg"}
                        alt=""
                        className={styles.tokenImg}
                        onClick={() => handleTokenChoice(token)}
                      />
                      <img
                        src="/tokenflatline.svg"
                        alt=""
                        className={styles.flatLine}
                      />
                      <div
                        className={styles.tokenSymbol}
                        onClick={() => handleTokenChoice(token)}
                      >
                        {token.symbol}
                      </div>
                      <div
                        className={styles.tokenName}
                        onClick={() => handleTokenChoice(token)}
                      >
                        {token.name}
                      </div>
                    </motion.div>
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
};
