import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./css/maincss.module.css";

export const TextInput = (props: any) => {
  const [value, setValue] = useState(props.value || "");
  const { placeholder, type, inputChecker } = props;

  const handleChange = (e: any) => {
    setValue(e);
    let args = props.changeArgs ? props.changeArgs : [];
    props.onChange(e, ...args);
    console.log("Address Changed", e);
  };

  useEffect(() => {
    if (props.value !== undefined) {
      handleChange(props.value);
    }
  }, []);

  return (
    <div>
      <motion.input
        className={styles.textBoxInput}
        placeholder={props.placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        type={type}
        style={props.style}
      />
    </div>
  );
};
