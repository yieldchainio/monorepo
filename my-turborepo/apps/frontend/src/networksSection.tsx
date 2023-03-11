import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react";
import styles from "./css/protocolpools.module.css";
import { motion } from "framer-motion";
import { FastAverageColor } from "fast-average-color";
import { NetworkChip } from "./networkchip";
import axios from "axios";
import { DatabaseContext } from "./Contexts/DatabaseContext";
import { networks } from "data/Networks";

export const NetworksSection = (props: any) => {
  const {
    fullProtocolsList,
    fullPoolsList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
  } = useContext(DatabaseContext);

  const [clickedMapping, setClickedMapping] = useState(new Map());
  const [networksList, setNetworksList] = useState<any>([]);

  useEffect(() => {
    if (fullNetworksList) {
      if (props.correctNetworksList) {
        let correctNetworksList = fullNetworksList.filter(
          (item: any) =>
            props.correctNetworksList.findIndex(
              (fullItem: any) =>
                fullItem.chain_id == item.chain_id || item.chain_id == -500
            ) != -1
        );
        setNetworksList(correctNetworksList);
      } else {
        setNetworksList(fullNetworksList);
      }
    }
  }, [fullNetworksList, props.correctNetworksList]);

  return (
    <div className={styles.networkChipsContainer}>
      {networksList !== undefined
        ? networksList
            .sort((a: any, b: any) => {
              return a - b;
            })
            .map((networkObj: any) => (
              <NetworkChip
                networkDetails={networkObj}
                clickHandler={clickedMapping}
                key={networkObj.chain_id}
              />
            ))
        : null}
    </div>
  );
};
