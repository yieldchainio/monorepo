import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import styles from "./css/ProtocolList.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ProtocolCard } from "./ProtocolCard";
import axios from "axios";
import { DatabaseContext } from "./Contexts/DatabaseContext";
import ComingSoon from "ComingSoon";

export const ProtocolList: FunctionComponent = () => {
  /**
   * Context for all needed data
   */
  const {
    fullProtocolsList,
    fullPoolsList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
  } = useContext(DatabaseContext);

  const [protocolsList, setProtocolsList] = useState<any>(undefined);
  const [isHovering, setIsHovering] = useState<any>(false);
  const [isHoveringPopUp, setIsHoveringPopUp] = useState<any>(false);
  const [isHoveringAddProtocolBtn, setIsHoveringAddProtocolBtn] =
    useState(false);

  useEffect(() => {
    if (fullProtocolsList !== undefined) {
      setProtocolsList(fullProtocolsList);
    }
  }, [fullProtocolsList]);

  const navigate = useNavigate();
  const [currentSort, setCurrentSort] = useState("TVL");
  const [isSortExpanded, setIsSortExpanded] = useState(false);
  const [isHoveringSort, setIsHoveringSort] = useState<any>(false);

  const onButtonClick = useCallback(() => {
    navigate("/inputAddress");
  }, [navigate]);
  return (
    <div className={styles.dashboardDiv}>
      {isHovering !== false ? (
        <div
          className={styles.hoverPopUp}
          style={{
            top:
              isHovering[0 as unknown as keyof typeof isHovering].clientY + 80,
            left:
              isHovering[0 as unknown as keyof typeof isHovering].clientX - 50,
          }}
          onMouseOver={(e) =>
            setIsHovering([
              { clientX: e.clientX, clientY: e.clientY },
              isHovering[1],
            ])
          }
        >
          {" "}
        </div>
      ) : null}
      <motion.div
        className={styles.addProtocolGradientContainer}
        whileHover={{ scale: 1.025 }}
      >
        <ComingSoon />
        <div className={styles.circleAddProtocol}>
          <img
            src="shouticon.svg"
            alt=""
            className={styles.addNewProtocolIcon}
          />
        </div>
        <div className={styles.addNewProtocolTitle}>
          Add A New Protocol in ~2 Minutes
        </div>
        <div className={styles.addNewProtocolSubText}>
          Can't find the protocol you're looking for? Click here to add it - It
          won't take any longer than 2 Minutes.
        </div>
        <motion.button
          className={styles.addNewProtocolBtn}
          whileHover={() => setIsHoveringAddProtocolBtn(true)}
        >
          {" "}
          + Add New Protocol
        </motion.button>
      </motion.div>
      <div className={styles.titleContainer}>
        <div className={styles.protocolsHeadTitle}>Protocols</div>
        <motion.button
          className={styles.sortingBox}
          whileHover={{ scale: 1.1, color: "white" }}
        >
          <div className={styles.sortingBoxText}>Sort By: {currentSort}</div>
          <motion.img
            whileHover={{
              fill: "white",
              transition: { duration: 1 },
              borderColor: "white",
            }}
            src="sortingdownarrow.svg"
            alt=""
            className={styles.sortingDownArrow}
          />
        </motion.button>
        <input
          type="text"
          className={styles.searchBarBox}
          placeholder={"Search For A Protocol's Name"}
        />
        <img src="searchicon.svg" alt="" className={styles.searchIcon} />
      </div>
      <div className={styles.protocolsCardsContainer}>
        {protocolsList == undefined
          ? "Loading Protocols"
          : protocolsList
              .sort((a: any, b: any) => a.aggregated_tvl > b.aggregated_tvl)
              .filter((protocolObj: any) => protocolObj.hidden === false)
              .map((protocolObj: any, index: number) => (
                <ProtocolCard
                  protocolDetails={protocolObj}
                  hoverHandler={setIsHovering}
                  isHovering={isHovering}
                  key={index}
                />
              ))}
      </div>
    </div>
  );
};
