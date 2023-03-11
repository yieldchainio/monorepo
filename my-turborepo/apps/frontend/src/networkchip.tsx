import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "./css/protocolpools.module.css";
import { motion } from "framer-motion";
import { FastAverageColor } from "fast-average-color";

export const NetworkChip = (props: any) => {
  const [dominantColor, setDominantColor] = useState<any>(undefined);
  const fac = new FastAverageColor();

  const getColor = async () => {
    let domColor = await fac
      .getColorAsync(props.networkDetails.logo)
      .then((color: any) => {
        if (dominantColor == undefined) {
          setDominantColor(color);
        } else {
          let someArr: any[] = dominantColor.hex
            .split("")
            .filter((item: any, index: any) => index > 2);
          someArr.unshift("#", "0", "0");
          someArr.push("6", "0");
          let modDomColor = someArr.join("");
        }
      });
  };

  getColor();

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    getStyle();
  }, [props.clickHandler]);

  const getStyle = () => {
    let i: boolean[] = [];
    props.clickHandler.forEach((v: any, k: any) => i.push(v));
    if (isClicked == true) {
      if (
        dominantColor !== undefined &&
        props.networkDetails.chain_id !== -500
      ) {
        return {
          borderWidth: "1px",
          borderStyle: "solid",
          color: "white",
          borderColor:
            dominantColor !== undefined ? dominantColor.hex : "transparent",
        };
      } else if (props.networkDetails.chain_id == -500) {
        if (i.includes(true) == false) {
          return {
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "transparent",
            background:
              "linear-gradient(black, black) padding-box, linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
            color: "white",
          };
        } else {
          return { border: "0px solid transparent" };
        }
      }
    } else if (props.networkDetails.chain_id == -500) {
      if (i.includes(true) == false) {
        return {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "transparent",
          background:
            "linear-gradient(black, black) padding-box, linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
          color: "white",
        };
      } else {
        return { border: "0px solid transparent" };
      }
    }
  };

  const onClickHandler = () => {
    isClicked == false ? setIsClicked(true) : setIsClicked(false);
    isClicked == false
      ? props.clickHandler.set(props.networkDetails.chain_id, false)
      : props.clickHandler.set(props.networkDetails.chain_id, true);

    getStyle();
  };

  return (
    <motion.div
      className={styles.networkChip}
      onClick={() => {
        onClickHandler();
      }}
      whileTap={{ scale: 0.975 }}
      style={getStyle()}
    >
      <img
        src={props.networkDetails.logo}
        alt=""
        className={styles.networkChipImg}
      />
      <div className={styles.networkChipText}>{props.networkDetails.name}</div>
    </motion.div>
  );
};
