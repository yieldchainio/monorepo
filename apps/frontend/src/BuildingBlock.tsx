import React from "react";
import styles from "./css/buildingBlock.module.css";

interface BlockProps {
  src: string;
}

export const BuildingBlock: React.FC<BlockProps> = ({ src, children }) => {
  return (
    <div className={styles.blockDiv}>
      <img src={src} />
      <div className={styles.innerDiv}>{children}</div>
      <img src="Vector.png" />
    </div>
  );
};
