import styles from "./css/maincss.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
export const Button = (props: any) => {
  const [args, setArgs] = useState<any>([]);

  useEffect(() => {
    if (props.onClickArgs !== undefined) setArgs(props.onClickArgs);
    else setArgs([]);
  }, [JSON.stringify(props.onClickArgs)]);

  return (
    <motion.div
      className={styles.button}
      onClick={() => props.onClick(...args)}
      whileHover={{
        backgroundColor: "rgb(222, 222, 222)",
        scale: 1.02,
      }}
      style={props.style}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        duration: 0.1,
      }}
    >
      {props.text}
    </motion.div>
  );
};
