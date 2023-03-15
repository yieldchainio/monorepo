import styles from "./css/globalStyles.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useLayoutEffect } from "react";

export const HoverDetails = (props: any) => {
  const variant = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  const currentRef = useRef<any>(null);
  let { text, top, left } = props;
  useLayoutEffect(() => {
    setCurrentWidth(currentRef.current.offsetWidth);
    return () => {
      setCurrentWidth(0);
    };
  }, []);
  return (
    <AnimatePresence>
      {text || isHovering ? (
        <motion.div
          className={styles.miniHoverDetailsContainer}
          ref={currentRef}
          style={{
            top: `${top - 35}px`,
            left: `${left}px`,
            zIndex: "99999999999999999999",
          }}
          variants={variant}
          key="container"
          initial="initial"
          animate="animate"
          exit="exit"
          onMouseEnter={() => setIsHovering(true)}
        >
          <motion.div
            className={styles.miniHoverDetailsText}
            variants={variant}
            key="containerText"
            initial="initial"
            animate="animate"
            exit="exit"
            onMouseEnter={(e: any) => e.stopPropagation()}
          >
            {text}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
