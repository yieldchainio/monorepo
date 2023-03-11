import styles from "./css/maincss.module.css";
import { useState, useEffect, useRef } from "react";
import { DropdownOptions } from "./types";
import { motion } from "framer-motion";
import { text } from "stream/consumers";

export default function DropdownInput({
  options,
  choiceHandler,
  style,
  textStyle,
  imgStyle,
  placeholder,
  itemStyle,
  dropdownStyle,
}: {
  options: DropdownOptions<any>[];
  choiceHandler: (choice: any) => any;
  style?: Record<any, any>;
  textStyle?: Record<any, any>;
  imgStyle?: Record<any, any>;
  placeholder?: DropdownOptions<any>;
  itemStyle?: Record<any, any>;
  dropdownStyle?: Record<any, any>;
}) {
  const [selected, setSelected] = useState<DropdownOptions<any>>(
    placeholder || options[0]
  );
  const [open, setOpen] = useState(false);

  const handleChoice = (choice: DropdownOptions<any>) => {
    setSelected(choice);
    choiceHandler(choice.data);
  };

  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <motion.div
        className={styles.dropdownBox}
        whileHover={{
          backgroundColor: "rgb(222, 222, 222)",
        }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpen(!open)}
        style={style ? style : {}}
        ref={boxRef}
      >
        {selected.image && (
          <img
            src={selected.image}
            alt=""
            className={styles.dropdownBoxImage}
          />
        )}
        <div
          className={styles.dropdownBoxTitle}
          style={textStyle ? textStyle : {}}
        >
          {selected.label}
        </div>
        <img src="/triangle.svg" alt="" className={styles.dropdownTriangle} />
      </motion.div>
      {open && (
        <div
          className={styles.dropdown}
          style={{ ...dropdownStyle, position: "absolute" }}
        >
          {options.map((option) => {
            return (
              <motion.div
                className={styles.dropdownItem}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                  handleChoice(option);
                }}
                whileHover={{
                  backgroundColor: "rgb(222, 222, 222)",
                }}
                style={{ ...itemStyle }}
              >
                {option.image && (
                  <img
                    src={option.image}
                    alt=""
                    className={styles.dropdownBoxImage}
                  />
                )}
                <div
                  className={styles.dropdownBoxTitle}
                  style={itemStyle ? itemStyle : {}}
                >
                  {option.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
