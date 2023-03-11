import React, { FunctionComponent, useState } from "react";
import styles from "./css/SearchBoxComponent.module.css";

export const SearchBoxComponent: FunctionComponent = () => {
  const [searchVar, setSearchVar] = useState("");
  return (
    <input
      type="text"
      className={styles.rectangleDiv}
      placeholder="Search for vault ID, token or protocol"
      value={searchVar}
      onChange={(event) => {
        setSearchVar(event.target.value);
      }}
    />
  );
};
