import styles from "./css/protocolscards.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Resizer from "react-image-file-resizer";
import { FastAverageColor } from "fast-average-color";
import { motion } from "framer-motion";
import { DatabaseContext } from "./Contexts/DatabaseContext";
import axios from "axios";

/* Card component for a verified vault card */
export const ProtocolCard = (props: any) => {
  const { fullNetworksList, fullProtocolsNetworksList } =
    useContext(DatabaseContext);

  useEffect(() => {
    console.log(
      "Ful lprotocols networks list inside protocl card,",
      fullProtocolsNetworksList
    );
  }, [fullProtocolsNetworksList]);
  let navigate = useNavigate();
  let { protocolName } = useParams();
  const handleCopy = async (_text: string) => {
    navigator.clipboard
      .writeText(`${_text}`)
      .then((res) => alert("Copied TO Clipboard"));
  };

  const [dominantColor, setDominantColor] = useState<any>(undefined);
  const [modifiedDomColor, setModifiedDomColor] = useState<any>(undefined);
  const [isDomColorDark, setIsDomColorDark] = useState<any>(undefined);
  const [networksList, setNetworksList] = useState<any>(undefined);
  const [poolsAmt, setPoolsAmt] = useState<any>(0);

  const fac = new FastAverageColor();

  useEffect(() => {
    if (fullProtocolsNetworksList !== undefined) {
      console.log("Protocols networks list is not undefined se");
      let currentProtocolNetworks = fullProtocolsNetworksList.filter(
        (item: any) =>
          item.protocol_identifier == props.protocolDetails.protocol_identifier
      );

      setNetworksList(currentProtocolNetworks);
    } else {
      console.log(
        "Protocols networks list is undefined se",
        fullProtocolsNetworksList
      );
    }
  }, [fullProtocolsNetworksList, props.protocolDetails]);

  const getColor = async () => {
    if (!props.protocolDetails.color) {
      let domColor = await fac
        .getColorAsync(props.protocolDetails.logo)
        .then(async (color: any) => {
          await axios.post(
            `https://api.yieldchain.io/protocolColor/${
              props.protocolDetails.protocol_identifier
            }/'${color.hex.toString().split("#")[1]}'`
          );
          if (dominantColor == undefined) {
            setDominantColor(color);
          } else {
            let someArr: any[] = await dominantColor.hex
              .split("")
              .filter((item: any, index: any) => index > 2);
            await someArr.unshift("#", "0", "0");
            await someArr.push("6", "0");
            let modDomColor = await someArr.join("");

            setModifiedDomColor(modDomColor);
            !dominantColor.isDark
              ? setIsDomColorDark(true)
              : setIsDomColorDark(false);
          }
        });

      return;
    } else {
      setDominantColor(props.protocolDetails.color);
      return;
    }
  };

  useEffect(() => {
    getColor().then(() => {
      return;
    });
  }, [props.protocolDetails]);
  return (
    <motion.div
      className={styles.vaultCard}
      whileHover={{ scale: 1.025 }}
      style={props.style ? props.style : {}}
    >
      {/* <div>{vaultModal && <VaultModal protocolDetails={props} />}</div> */}

      <div
        className={styles.apyvalues}
        style={
          dominantColor !== undefined
            ? {
                background: `linear-gradient(90deg, #${dominantColor}, #50af951a`,
              }
            : {}
        }
      >
        <div className={styles.apyvalue}>
          ~APY: {props.protocolDetails.avgapy}%
        </div>

        <div>
          {props.protocolDetails.is_verified == 1 ? (
            <img src="verifiedtag.svg" alt="" />
          ) : null}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.pairname}>{props.protocolDetails.name}</div>
        <div className={styles.network}>
          {networksList == undefined
            ? undefined
            : networksList.map(
                (networkObj: any, index: number, arr: any[]) =>
                  `${
                    fullNetworksList[
                      fullNetworksList.findIndex(
                        (item: any) => item.chainId == networkObj.chainId
                      )
                    ].network_name
                  }${index == arr.length - 1 ? "" : ", "}`
              )}
        </div>

        <div className={styles.imgBorder}>
          <div
            className={styles.imgBorderGradient}
            style={
              dominantColor !== undefined
                ? { background: `#${dominantColor}` }
                : {}
            }
          ></div>
          <img src={props.protocolDetails.logo} className={styles.img} />
          <img src={props.protocolDetails.logo} className={styles.img2} />
        </div>

        <motion.ul
          className={styles.cardlists}
          key={props.protocolDetails.website}

          //   onMouseOut={() =>
          //     !!props.isHovering
          //       ? props.hoverHandler(false)
          //       : props.hoverHandler(false)
          //   }
        >
          <li className={styles.cardlist}>
            <span className={styles.key}>Total Value Locked</span>
            <span className={styles.value}>
              ${props.protocolDetails.aggregated_tvl}
            </span>
          </li>
          <li className={styles.cardlist}>
            <span className={styles.key}>Website</span>
            <span
              className={styles.value}
              onClick={async () => handleCopy(props.protocolDetails.website)}
            >
              {props.protocolDetails.website}
              <img src="copy.png" className={styles.copyImg} />
            </span>
          </li>
          <li className={styles.cardlist}>
            <span className={styles.key}>Deployed Vaults</span>
            <span className={styles.value}>
              {props.protocolDetails.yc_vaults_num}
            </span>
          </li>
        </motion.ul>
        <button
          className={styles.cardBtn}
          onClick={() =>
            navigate(`/protocols/${props.protocolDetails.protocol_identifier}`)
          }
          //  Replace the line under me with a onhover to display details
          //   onClick={() => props.modalHandler(props.protocolDetails)}
        >
          Enter Protocol
        </button>
      </div>
    </motion.div>
  );
};
