import React, { useState, useEffect } from "react";
import styles from "../../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { humanizeString } from "../../utils/utils.js";
import _ from "lodash";

const CustomArgInputField = (props: any) => {
  const { field, style, handler, handleOwnChoice, index } = props;

  const [solidityType, setSolidityType] = useState<string>("");

  const [currentFieldType, setCurrentFieldType] = useState<string>("text");
  const [currentFieldPlaceholder, setCurrentFieldPlaceholder] =
    useState<string>("A Text field, e.g: 'Sam Bankman Fried'");

  const [currentFieldInput, setCurrentFieldInput] = useState<any>(null);

  useEffect(() => {
    setSolidityType(field.solidity_type);
  }, [field]);

  useEffect(() => {
    if (currentFieldInput !== null || undefined) {
      handleOwnChoice((prevState: any) => {
        let tArr = [...prevState];
        tArr = tArr.filter((item: any) => item !== undefined);
        tArr[index] = currentFieldInput;
        return tArr;
      });
    }
  }, [currentFieldInput]);

  useEffect(() => {
    if (solidityType) {
      if (solidityType.includes("string")) {
        setCurrentFieldType("text");
        setCurrentFieldPlaceholder("A Text field, e.g: 'Sam Bankman Fried'");
      }
      if (solidityType.includes("int")) {
        setCurrentFieldType("number");
        setCurrentFieldPlaceholder("A Number field, e.g: 100");
      }
      if (solidityType.includes("address")) {
        setCurrentFieldType("text");
        setCurrentFieldPlaceholder("An Address field, e.g: 0x1234567890");
      }
      if (solidityType.includes("bool")) {
        setCurrentFieldType("checkbox");
        setCurrentFieldPlaceholder("A Boolean field, e.g: true/false");
        setCurrentFieldInput(false);
      }
      if (solidityType.includes("bytes")) {
        setCurrentFieldType("text");
        setCurrentFieldPlaceholder(
          "A Bytes field, e.g: 0x1234567890... (NOT AN ADDRESS)"
        );
      }
    }
  }, [solidityType]);

  useEffect(() => {
    console.log(currentFieldInput);
  }, [currentFieldInput]);

  return (
    <div
      className={styles.customArgsArgumentContainer}
      style={{ marginTop: field.index !== 0 ? "20px" : "-20px" }}
    >
      <div className={styles.customArgsArgumentTitle}>
        {humanizeString(field.name)}
      </div>
      {currentFieldType !== "checkbox" ? (
        <input
          className={styles.customArgsArgumentInputContainer}
          type={currentFieldType}
          placeholder={currentFieldPlaceholder}
          onChange={(e) => setCurrentFieldInput(e.target.value)}
        />
      ) : (
        <motion.div
          className={styles.trueFalseSlider}
          onClick={() => setCurrentFieldInput(currentFieldInput ? false : true)}
          style={
            currentFieldInput
              ? {
                  background:
                    "linear-gradient(90deg, #00B2EC 0%, #D9CA0F 100%)",
                }
              : {}
          }
          layout
        >
          <motion.div
            className={styles.trueFalseSliderCircleOff}
            style={
              currentFieldInput
                ? {
                    background:
                      "linear-gradient(90deg, #68DAFF 0%, #FFF576 100%)",
                    border: "1px solid #000000",

                    marginLeft: "auto",
                  }
                : {}
            }
            layout
          ></motion.div>
        </motion.div>
      )}
    </div>
  );
};

export const CustomArgs = (props: any) => {
  const { customArgs, handler } = props;
  const [customArgsState, setCustomArgsState] = useState<any>([]);

  const handleComplete = () => {
    if (customArgsState.length == customArgs.length) {
      handler(customArgsState);
    } else {
      console.log(
        "Not same length!!!",
        customArgs,
        "args",
        customArgsState,
        "state"
      );
    }
  };

  return (
    <div className={styles.customArgsContainer} style={props.style}>
      <div
        className={styles.customArgsTitleContainer}
        style={{ marginBottom: "30px" }}
      >
        <div className={styles.customArgsTitleTextOn}>Additional Inputs</div>
        <div className={styles.customArgsTitleTextOff}>
          Your Choice Requires additional details, fill up the inputs below to
          continue
        </div>
      </div>
      {customArgs.map((arg: any, index: number) => {
        return (
          <CustomArgInputField
            field={arg}
            handleOwnChoice={setCustomArgsState}
            index={index}
          />
        );
      })}
      <motion.div
        className={styles.customArgsSetButton}
        whileHover={{
          scale: 1.1,
          filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.305))",
        }}
        onClick={() => handleComplete()}
      >
        Set
      </motion.div>
    </div>
  );
};
