import styles from "./css/maincss.module.css";
import { useState } from "react";
export const Checkbox = ({
  choiceHandler,
  style,
  argsToInclude,
  checked,
}: {
  choiceHandler: Function;
  style?: any;
  argsToInclude?: any[];
  checked?: boolean;
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked || false);
  const handleChoice = () => {
    let args = argsToInclude || [];
    choiceHandler(...args, !isChecked);
    setIsChecked(!isChecked);
  };
  return (
    <div
      className={styles.checkBox}
      onClick={handleChoice}
      style={{
        ...style,
        backgroundImage: isChecked
          ? "linear-gradient(90deg, rgba(0, 178, 236) 0%,rgba(217, 202, 15) 100%)"
          : "none",
      }}
    >
      {isChecked && (
        <img
          src="/checkmark.svg"
          alt=""
          style={{ width: "40%", height: "40%" }}
        />
      )}
    </div>
  );
};
