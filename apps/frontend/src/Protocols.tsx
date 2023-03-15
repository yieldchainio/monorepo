import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import styles from "./css/protocolpools.module.css";
import { motion } from "framer-motion";
import { NetworksSection } from "./networksSection";
import { PoolsTable } from "./poolsTable";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { openInNewTab, getFunctionAddress } from "utils/utils";
import { EditDistributionModal } from "./editDistribution";
import { Hidden } from "@mui/material";
import ComingSoon from "ComingSoon";

export const Protocols: FunctionComponent = (props: any) => {
  const {
    fullProtocolsList,
    fullAddressesList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
    protocolsAddressesList,
  } = useContext(DatabaseContext);

  const {
    baseSteps,
    setBaseSteps,
    showPercentageBox,
    setShowPercentageBox,
    isModalOpen,
    strategyProcessLocation,
    setStrategyProcessLocation,
    StrategyProcessSteps,
  } = useContext(StrategyContext);

  let navigate = useNavigate();
  let { protocolIdentifier } = useParams();
  const [protocolDetails, setProtocolDetails] = useState<any>(undefined);
  const [protocolsList, setProtocolsList] = useState<any>(undefined);
  const [protocolNetworksState, setProtocolNetworksState] =
    useState<any>(undefined);
  const [protocolAddresses, setProtocolAddresses] = useState<any>([]);
  const [
    {
      name,
      website,
      logo,
      twitter,
      discord,
      aggregated_tvl,
      is_verified,
      is_trending,
    },
    setProtocolDetailsState,
  ] = useState<any>({
    name: undefined,
    website: undefined,
    logo: undefined,
    twitter: undefined,
    discord: undefined,
    aggregated_tvl: undefined,
    is_verified: undefined,
    is_trending: undefined,
  });

  const initData = async () => {
    try {
      // Sets The Details Of The Current Protocol
      if (fullProtocolsList !== undefined) {
        let currentProtocolDetails =
          fullProtocolsList[
            fullProtocolsList.findIndex(
              (item: any) => item.protocol_identifier == protocolIdentifier
            )
          ];
        setProtocolDetails(currentProtocolDetails);

        // Sets The List Of Networks Available On The Current Protocol
        let currentChainIds = fullProtocolsNetworksList.filter(
          (item: any) =>
            item.protocol_identifier == protocolIdentifier ||
            item.chain_id == -500
        );

        setProtocolNetworksState(currentChainIds);

        let {
          name,
          website,
          logo,
          twitter,
          discord,
          aggregated_tvl,
          is_verified,
          is_trending,
        } = currentProtocolDetails;
        setProtocolDetailsState({
          name,
          website,
          logo,
          twitter,
          discord,
          aggregated_tvl,
          is_verified,
          is_trending,
        });
      }

      let Addresses = protocolsAddressesList.filter(
        (item: any) => item.protocol_identifier == protocolIdentifier
      );

      setProtocolAddresses(Addresses);

      setStrategyProcessLocation(StrategyProcessSteps.BASE_STRATEGY);
    } catch (e) {
      if (strategyProcessLocation === StrategyProcessSteps.NOT_ENTERED) {
        navigate("/");
      }
    }
  };

  let AddressTableProp = {
    parentAddressesList: protocolAddresses,
  };

  useEffect(() => {
    if (
      fullProtocolsList &&
      fullNetworksList &&
      fullProtocolsNetworksList &&
      protocolsAddressesList
    ) {
      initData();
    }
  }, [
    fullProtocolsList,
    fullNetworksList,
    fullProtocolsNetworksList,
    protocolsAddressesList,
  ]);

  const isHoveringAddProtocolBtn = useRef<any>(false);
  const setIsHoveringAddProtocolBtn = (value: any) => {
    isHoveringAddProtocolBtn.current = value;
  };
  if (
    protocolDetails &&
    protocolNetworksState &&
    protocolAddresses &&
    name &&
    logo &&
    protocolIdentifier
  ) {
    return (
      <div
        className={styles.pageDiv}
        // onClick={() => setShowPercentageBox(false)}
        style={isModalOpen ? { overflow: "hidden" } : {}}
      >
        <div className={styles.protocolRouteContainer}>
          <motion.div
            onClick={() => navigate("/protocols")}
            className={styles.protocolsRouteOffText}
            whileHover={{ color: "white", fontWeight: "bold" }}
          >
            Protocols
          </motion.div>
          <img
            src="/routeleftarrow.svg"
            alt=""
            className={styles.routeLeftArrow}
          />
          <div className={styles.protocolRouteOnText}>{name}</div>
        </div>
        <motion.div
          className={styles.addProtocolGradientContainer}
          whileHover={{ scale: 1.025 }}
        >
          <div className={styles.circleAddProtocol}>
            <img
              src="/shouticon.svg"
              alt=""
              className={styles.addNewProtocolIcon}
            />
          </div>
          <div className={styles.addNewProtocolTitle}>
            Add A New Action in ~2 Minutes
          </div>
          <div className={styles.addNewProtocolSubText}>
            Can't find the action you're looking for? Click here to add it - It
            won't take any longer than 2 Minutes.
          </div>
          <motion.button
            className={styles.addNewProtocolBtn}
            onClick={(e: any) => setShowPercentageBox(e.screenY)}
            whileHover={() => setIsHoveringAddProtocolBtn(true)}
          >
            {" "}
            + Add New Action
          </motion.button>
          <ComingSoon />
        </motion.div>
        <div className={styles.protocolHeaderContainer}>
          <img src={logo} alt="" className={styles.protocolHeaderLogo} />
          <div className={styles.protocolHeaderTitle}>{name}</div>
          <img
            src="/protocolWebsiteIcon.svg"
            alt=""
            className={styles.protocolWebsiteIcon}
          />
          <div className={styles.protocolWebsiteText}>{website}</div>
          <div className={styles.mediaButtonsContainer}>
            <div className={styles.mediaButtonCircleOverlay}>
              <img
                src="/websiteicon.svg"
                alt=""
                className={styles.mediaButtonImg}
                onClick={() =>
                  window.open(website, "_blank", "noopener,noreferrer")
                }
              />
            </div>
            <motion.div
              className={styles.mediaButtonCircleOverlay}
              style={{ left: "56px" }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "white",
                borderColor: "black",
              }}
            >
              <motion.img
                src="/twittericon.svg"
                alt=""
                className={styles.mediaButtonImg}
                whileHover={{
                  scale: 1.05,
                  color: "blue",
                }}
              />
            </motion.div>
            <div
              className={styles.mediaButtonCircleOverlay}
              style={{ left: "112px" }}
            >
              <img
                src="/shareiconprotocol.svg"
                alt=""
                className={styles.mediaButtonImg}
              />
            </div>
          </div>
          <img src="/searchicon.svg" alt="" className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchBarBox}
            placeholder="Search for a Address"
          />
        </div>
        <NetworksSection correctNetworksList={protocolNetworksState} />
        <PoolsTable
          protocol_identifier={protocolIdentifier}
          protocolDetails={{
            name,
            logo,
            website,
            twitter,
            discord,
            aggregated_tvl,
            is_verified,
            is_trending,
          }}
          showPercentageBox={showPercentageBox}
          setShowPercentageBox={setShowPercentageBox}
        />
      </div>
    );
  } else {
    return null;
  }
};
