import styles from "./css/vaultcards.module.css";
import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { VaultModal } from "./vaultModal";
import { motion } from "framer-motion";
import {
  getTokenDetails,
  getFunctionDetails,
  getAddressDetails,
  getNetworkDetails,
  getProtocolDetails,
} from "./utils/utils.js";
import { useEffect } from "react";

/* Card component for a verified vault card */
export const VerfiedVaultCard = (props: any) => {
  /* Copies main protocol URL link to user's clipboard */
  const handleCopy = () => {
    navigator.clipboard.writeText(" app.uniswap.org");
    alert("Copied");
  };

  const [vaultModal, toggleVaultModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(true);

  // Vault Variable Deails //
  const { style } = props;

  const vaultDetails = props.vaultDetails;
  const {
    name,
    strategy_identifier,
    address,
    apy,
    tvl,
    main_protocol_identifier,
    creator_user_identifier,
    main_token_identifier,
    final_token_identifier,
    is_verified,
    is_trending,
    execution_interval,
    chain_id,
    steps,
  }: any = vaultDetails;

  const [main_token_details, setMainTokenDetials] = useState<any>(undefined);
  const [final_token_details, setFinalTokenDetials] = useState<any>(undefined);
  const [network_details, setNetworkDetials] = useState<any>(undefined);
  const [protocol, setProtocol] = useState<any>(undefined);

  const initializeData = async (vaultDetails: any) => {
    try {
      let mainTokenDetails;
      let finalTokenDetails;
      let networkDetails;
      let protocolDetails;

      mainTokenDetails = await getTokenDetails(
        vaultDetails.main_token_identifier
      );
      finalTokenDetails = await getTokenDetails(
        vaultDetails.final_token_identifier
      );
      networkDetails = await getNetworkDetails(vaultDetails.chain_id);
      protocolDetails = await getProtocolDetails(
        vaultDetails.main_protocol_identifier
      );

      setMainTokenDetials(mainTokenDetails);
      setFinalTokenDetials(finalTokenDetails);
      setNetworkDetials(networkDetails);
      setProtocol(protocolDetails);
    } catch (error) {
      // handle any errors that occurred while fetching the data
    }
  };

  useEffect(() => {
    // check if the vaultDetails prop is defined
    if (!vaultDetails) {
      return;
    }

    // initialize the main_token_details, final_token_details, network_details, and
    // protocol variables
    initializeData(vaultDetails);

    setDetailsLoading(false);
  }, [vaultDetails]); // pass the vaultDetails prop as the second argument to the useEffect hook

  const toggleModal = () => {
    toggleVaultModal(!vaultModal);
  };
  if (!detailsLoading) {
    if (
      name !== undefined &&
      strategy_identifier !== undefined &&
      address !== undefined &&
      apy !== undefined &&
      tvl !== undefined &&
      main_protocol_identifier !== undefined &&
      creator_user_identifier !== undefined &&
      main_token_identifier !== undefined &&
      final_token_identifier !== undefined &&
      is_verified !== undefined &&
      is_trending !== undefined &&
      execution_interval !== undefined &&
      chain_id !== undefined &&
      main_token_details !== undefined &&
      final_token_details !== undefined &&
      network_details !== undefined &&
      protocol !== undefined
    ) {
      return (
        <div style={style}>
          <motion.div className={styles.vaultCard}>
            {/* <div>{vaultModal && <VaultModal vaultDetails={props} />}</div> */}

            <div className={styles.apyvalues}>
              <div className={styles.apyvalue}>APY: {apy}%</div>
              <div className={styles.apyvalueUnd}>APR: {10}%</div>
              <div>
                <img src="verifiedtag.svg" alt="" />
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.pairname}>
                {main_token_details["symbol"]}
              </div>
              <div className={styles.network}>{network_details["name"]}</div>

              <div className={styles.imgBorder}>
                <img src={main_token_details["logo"]} className={styles.img} />
                <img src={network_details["logo"]} className={styles.img2} />
              </div>

              <ul className={styles.cardlists}>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Total Value Locked</span>
                  <span className={styles.value}>${tvl}</span>
                </li>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Reward Token</span>
                  <span className={styles.value}>
                    {final_token_details["symbol"]}
                    <img
                      src={final_token_details["logo"]}
                      className={styles.rewardimg}
                    />
                  </span>
                </li>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Strategy</span>
                  <span className={styles.value}>{name}</span>
                </li>
              </ul>
              <button
                className={styles.cardBtn}
                onClick={() => props.modalHandler(props.vaultDetails)}
              >
                Enter Vault
              </button>
            </div>
          </motion.div>
        </div>
      );
    } else {
      return <h1>Loading...</h1>;
    }
  } else {
    return <h1>Loading...</h1>;
  }
};

export const TrendingVaultCard = (props: any) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(props.vaultDetails.mainprotocolWebsite);
    alert("Copied");
  };
  const [vaultModal, toggleVaultModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(true);

  // Vault Variable Deails //

  const vaultDetails = props.vaultDetails;
  const {
    name,
    strategy_identifier,
    address,
    apy,
    tvl,
    main_protocol_identifier,
    creator_user_identifier,
    main_token_identifier,
    final_token_identifier,
    is_verified,
    is_trending,
    execution_interval,
    chain_id,
  }: any = vaultDetails;

  const [main_token_details, setMainTokenDetials] = useState<any>(undefined);
  const [final_token_details, setFinalTokenDetials] = useState<any>(undefined);
  const [network_details, setNetworkDetials] = useState<any>(undefined);
  const [protocol, setProtocol] = useState<any>(undefined);

  const initializeData = async (vaultDetails: any) => {
    try {
      let mainTokenDetails;
      let finalTokenDetails;
      let networkDetails;
      let protocolDetails;

      mainTokenDetails = await getTokenDetails(
        vaultDetails.main_token_identifier
      );
      finalTokenDetails = await getTokenDetails(
        vaultDetails.final_token_identifier
      );
      networkDetails = await getNetworkDetails(vaultDetails.chain_id);
      protocolDetails = await getProtocolDetails(
        vaultDetails.main_protocol_identifier
      );

      setMainTokenDetials(mainTokenDetails);
      setFinalTokenDetials(finalTokenDetails);
      setNetworkDetials(networkDetails);
      setProtocol(protocolDetails);
    } catch (error) {
      // handle any errors that occurred while fetching the data
    }
  };

  useEffect(() => {
    // check if the vaultDetails prop is defined
    if (!vaultDetails) {
      return;
    }

    // initialize the main_token_details, final_token_details, network_details, and
    // protocol variables
    initializeData(vaultDetails);

    setDetailsLoading(false);
  }, [vaultDetails]); // pass the vaultDetails prop as the second argument to the useEffect hook

  const toggleModal = () => {
    toggleVaultModal(!vaultModal);
  };
  if (!detailsLoading) {
    if (
      name !== undefined &&
      strategy_identifier !== undefined &&
      address !== undefined &&
      apy !== undefined &&
      tvl !== undefined &&
      main_protocol_identifier !== undefined &&
      creator_user_identifier !== undefined &&
      main_token_identifier !== undefined &&
      final_token_identifier !== undefined &&
      is_verified !== undefined &&
      is_trending !== undefined &&
      execution_interval !== undefined &&
      chain_id !== undefined &&
      main_token_details !== undefined &&
      final_token_details !== undefined &&
      network_details !== undefined &&
      protocol !== undefined
    ) {
      return (
        <div className={styles.trendingvault}>
          <div className={styles.trendingvaultapys}>
            <div className={styles.trendingvaultapy1}>APY: {apy}%</div>
            <div className={styles.trendingvaultapy2}>APR: {10}%</div>
            <div className={styles.trendingVerifiedTag}>
              <img
                src={
                  props.vaultDetails.isVerified == 1 ? "verifiedtag.svg" : ""
                }
                alt=""
              />
            </div>
          </div>

          <div className={styles.trendingVaultCard}>
            <div className={styles.imgs}>
              <div className={styles.imgBorder}>
                <img src={main_token_details.logo} className={styles.img} />
                <img />
                <img
                  src={network_details.logo}
                  className={styles.trendingNetworkImg}
                />
              </div>
            </div>
            <div className={styles.trendingCardContent}>
              <div className={styles.trendingPairname}>
                {/* {getTokenDetails(props.vaultDetails.main_token_identifier).address} */}
              </div>
              <div className={styles.trendingNetwork}>
                {network_details.name}
              </div>
              <ul className={styles.cardlists}>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Total Value Locked</span>
                  <span className={styles.value}>{tvl}</span>
                </li>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Reward Token</span>
                  <span className={styles.value}>
                    {final_token_details.symbol}
                    <img
                      src={final_token_details.logo}
                      className={styles.rewardimg}
                    />
                  </span>
                </li>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Website</span>
                  <span className={styles.value} onClick={handleCopy}>
                    {protocol.website}{" "}
                    <img src="copy.png" className={styles.copyImg} />
                  </span>
                </li>
                <li className={styles.cardlist}>
                  <span className={styles.key}>Strategy</span>
                  <span className={styles.value}>{name}</span>
                </li>
              </ul>
              <button className={styles.cardBtn}>Enter Vault</button>
            </div>
          </div>
        </div>
      );
    } else {
      return <h1>Loading...</h1>;
    }
  } else {
    return <h1>Loading...</h1>;
  }
};
