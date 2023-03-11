import React, { FunctionComponent } from "react";
import styles from "./css/TextArea.module.css";

type TextAreaType = {
  textArea?: string;
};

export const TextArea: FunctionComponent<TextAreaType> = ({
  textArea = "Search for a vault ID, token or protocol",
}) => {
  return <div className={styles.textAreaDiv}>{textArea}</div>;
};
