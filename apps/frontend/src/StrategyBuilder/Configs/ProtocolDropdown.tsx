import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "../../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import {
  DatabaseContext,
  StrategyContext,
} from "../../Contexts/DatabaseContext";

const ProtocolRow = (props: any) => {
  const { choiceHandler, protocolDetails } = props;

  return (
    <motion.div
      className={styles.mediumConfigProtocolRow}
      whileHover={{
        backgroundColor: "rgba(15, 16, 17, 1)",
        transition: { duration: 0.1 },
      }}
      onClick={() => choiceHandler(protocolDetails)}
    >
      {" "}
      <img
        alt=""
        src={protocolDetails.logo}
        className={styles.mediumConfigProtocolRowIcon}
      />
      <div className={styles.mediumConfigProtocolRowText}>
        {protocolDetails.name}
      </div>
    </motion.div>
  );
};

export const ProtocolDropDown = (props: any) => {
  const { top, left, choiceHandler, protocolsList } = props;

  const [listOfProtocols, setListOfProtocols] = useState<any>(null);

  useEffect(() => {
    if (protocolsList) {
      setListOfProtocols(protocolsList);
    }
  }, [protocolsList]);

  return (
    <div
      className={styles.mediumConfigProtocolMenu}
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <input
        type="text"
        className={styles.mediumConfigProtocolMenuSearchBar}
        placeholder="Search Protocol"
      />
      <img
        src="/dropdownsearchicon.svg"
        alt=""
        className={styles.mediumConfigProtocolMenuSearchBarIcon}
      />

      <div className={styles.mediumConfigProtocolMenuRowsGrid}>
        {!listOfProtocols
          ? "Loading Protocols..."
          : listOfProtocols
              // .filter((protocol: any, index: number) =>
              //   listOfProtocols.findIndex(
              //     (protocolObj: any, objIndex: number) => objIndex == index
              //   )
              // )
              .map((protocol: any, index: any) => (
                <ProtocolRow
                  choiceHandler={choiceHandler}
                  protocolDetails={protocol}
                  key={index}
                />
              ))}
      </div>
    </div>
  );
};
