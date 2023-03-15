import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "../Contexts/DatabaseContext";
import { ButtonVariants } from "../MotionVariants";
import { HoverDetails } from "../HoverDetails";
import { SizingEnum } from "./Enums";
import { NodeStepEnum } from "./Enums";
import _ from "lodash";
import { calcIntervalToSeconds, rawCalcInterval } from "../utils/utils";

export const FrequencyModal = (props: any) => {
  const { executionIntrval, setExecutionInterval } =
    useContext(StrategyContext);

  const { modalHandler } = props;

  // Refs
  let saveBtnRef = useRef({ offsetTop: 0, offsetLeft: 0 });
  let inputRef = useRef({ offsetTop: 0, offsetLeft: 0 });
  let dropdownRef = useRef({ offsetTop: 0, offsetLeft: 0 });
  let cancelBtnRef = useRef({ offsetTop: 0, offsetLeft: 0 });

  const [currentInput, setCurrentInput] = useState(
    executionIntrval ? rawCalcInterval(executionIntrval).interval : null
  );
  const [currentTimestamp, setCurrentTimestamp] = useState(
    executionIntrval ? rawCalcInterval(executionIntrval).unit : "days"
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoverDetailsOpen, setHoverDetailsOpen] = useState<any>(false);

  const handleSave = () => {
    if (!currentInput) {
      setHoverDetailsOpen({
        top: saveBtnRef.current.offsetTop,
        left: saveBtnRef.current.offsetLeft - 50,
        text: "You have not defined a valid input",
      });
      setTimeout(() => {
        setHoverDetailsOpen(false);
      }, 2000);
      return;
    }
    const intervalInSeconds = calcIntervalToSeconds(
      currentInput,
      currentTimestamp
    );
    setExecutionInterval(intervalInSeconds);
    modalHandler(false);
  };

  const handleIntervalChoice = (interval: string) => {
    setCurrentTimestamp(interval);
    setDropdownOpen(false);
  };

  return (
    <div
      className={styles.frequencyModalBlurWrapper}
      onClick={() => modalHandler(false)}
    >
      <div
        className={styles.frequencyModalBody}
        onClick={(e: any) => e.stopPropagation()}
      >
        {hoverDetailsOpen && (
          <HoverDetails
            top={hoverDetailsOpen.top}
            left={hoverDetailsOpen.left}
            text={hoverDetailsOpen.text}
          />
        )}
        {dropdownOpen && (
          <div className={styles.frequencyModalDropdownContainer}>
            <motion.div
              className={styles.frequencyModalDropdownRow}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
              }}
              onClick={(e: any) => handleIntervalChoice("minutes")}
            >
              <div className={styles.frequencyModalDropdownRowText}>
                Minutes
              </div>
            </motion.div>
            <motion.div
              className={styles.frequencyModalDropdownRow}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
              }}
              onClick={(e: any) => handleIntervalChoice("hours")}
            >
              <div className={styles.frequencyModalDropdownRowText}>Hours</div>
            </motion.div>
            <motion.div
              className={styles.frequencyModalDropdownRow}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
              }}
              onClick={(e: any) => handleIntervalChoice("days")}
            >
              <div className={styles.frequencyModalDropdownRowText}>Days</div>
            </motion.div>
            <motion.div
              className={styles.frequencyModalDropdownRow}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
              }}
              onClick={(e: any) => handleIntervalChoice("weeks")}
            >
              <div className={styles.frequencyModalDropdownRowText}>Weeks</div>
            </motion.div>
            <motion.div
              className={styles.frequencyModalDropdownRow}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                scale: 1.01,
                transition: { duration: 0.1 },
              }}
              onClick={(e: any) => handleIntervalChoice("months")}
            >
              {" "}
              <div className={styles.frequencyModalDropdownRowText}>Months</div>
            </motion.div>
          </div>
        )}
        <div className={styles.frequencyModalRightContainer}>
          <div className={styles.frequencyModalGrayCircle}>
            <img
              src="/checkimage.svg"
              alt=""
              className={styles.frequencyModalCheckImage}
            />
          </div>
        </div>
        <div className={styles.frequencyModalLeftContainer}>
          <div className={styles.frequencyModalTextContainer}>
            <div className={styles.frequencyModalTitleText}>
              {`Strategy Created 
              `}
              {`Successfully`}
            </div>
            <div
              className={styles.frequencyModalDescriptionText}
            >{`Choose How frequently you'd like the strategy to run
                        
                        e.g, every 5 days, every 3.8 hours, etc.`}</div>
          </div>
          <div className={styles.frequencyModalBottomContainer}>
            <div className={styles.frequencyModalInputFlex}>
              <div className={styles.frequencyModalInputTitle}>Frequency</div>
              <div className={styles.frequencyModalInputFlexRow}>
                <input
                  className={styles.frequencyModalInput}
                  placeholder="Enter Number"
                  type="number"
                  onChange={(e: any) => setCurrentInput(e.target.value)}
                />
                <div
                  className={styles.frequencyModalInputTimestampsContainer}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className={styles.frequencyModalInputTimestampsText}>
                    {currentTimestamp.split("")[0].toUpperCase() +
                      currentTimestamp.slice(1)}
                  </div>
                  <img
                    src="/arrowdownfrequency.svg"
                    alt=""
                    className={styles.frequencyModalInputTImestampsArrowDown}
                  />
                </div>
              </div>
            </div>
            <div className={styles.frequencyModalButtonsFlexRow}>
              <motion.div
                className={styles.frequencyModalCancelButton}
                whileHover={{ scale: 1.05 }}
              >
                Cancel
              </motion.div>
              <motion.div
                className={styles.frequencyModalSaveButton}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSave()}
                ref={saveBtnRef}
              >
                Save
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const StaticFrequencyModal = React.forwardRef((props: any, ref: any) => {
  const { executionIntrval, setExecutionInterval } =
    useContext(StrategyContext);

  const { modalHandler } = props;

  // Refs
  let saveBtnRef = useRef({ offsetTop: 0, offsetLeft: 0 });
  let inputRef = useRef({ offsetTop: 0, offsetLeft: 0 });
  let dropdownRef = useRef({ offsetTop: 0, offsetLeft: 0 });
  let cancelBtnRef = useRef({ offsetTop: 0, offsetLeft: 0 });

  const [currentInput, setCurrentInput] = useState(
    executionIntrval ? rawCalcInterval(executionIntrval).interval : null
  );
  const [currentTimestamp, setCurrentTimestamp] = useState(
    executionIntrval ? rawCalcInterval(executionIntrval).unit : "days"
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoverDetailsOpen, setHoverDetailsOpen] = useState<any>(false);

  const handleSave = () => {
    if (!currentInput) {
      setHoverDetailsOpen({
        top: saveBtnRef.current.offsetTop,
        left: saveBtnRef.current.offsetLeft - 50,
        text: "You have not defined a valid input",
      });
      setTimeout(() => {
        setHoverDetailsOpen(false);
      }, 2000);
      return;
    }
    const intervalInSeconds = calcIntervalToSeconds(
      currentInput,
      currentTimestamp
    );
    setExecutionInterval(intervalInSeconds);
    modalHandler(false);
  };

  const handleIntervalChoice = (interval: string) => {
    setCurrentTimestamp(interval);
    setDropdownOpen(false);
  };

  return (
    <motion.div
      className={styles.frequencyModalBody}
      onClick={(e: any) => e.stopPropagation()}
      style={props.style}
      variants={props.variants}
      animate={props.animationConiditon}
      transition={{
        duration: 1,
      }}
      ref={ref}
    >
      {hoverDetailsOpen && (
        <HoverDetails
          top={hoverDetailsOpen.top}
          left={hoverDetailsOpen.left}
          text={hoverDetailsOpen.text}
        />
      )}
      {dropdownOpen && (
        <div className={styles.frequencyModalDropdownContainer}>
          <motion.div
            className={styles.frequencyModalDropdownRow}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              scale: 1.01,
              transition: { duration: 0.1 },
            }}
            onClick={(e: any) => handleIntervalChoice("minutes")}
          >
            <div className={styles.frequencyModalDropdownRowText}>Minutes</div>
          </motion.div>
          <motion.div
            className={styles.frequencyModalDropdownRow}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              scale: 1.01,
              transition: { duration: 0.1 },
            }}
            onClick={(e: any) => handleIntervalChoice("hours")}
          >
            <div className={styles.frequencyModalDropdownRowText}>Hours</div>
          </motion.div>
          <motion.div
            className={styles.frequencyModalDropdownRow}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              scale: 1.01,
              transition: { duration: 0.1 },
            }}
            onClick={(e: any) => handleIntervalChoice("days")}
          >
            <div className={styles.frequencyModalDropdownRowText}>Days</div>
          </motion.div>
          <motion.div
            className={styles.frequencyModalDropdownRow}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              scale: 1.01,
              transition: { duration: 0.1 },
            }}
            onClick={(e: any) => handleIntervalChoice("weeks")}
          >
            <div className={styles.frequencyModalDropdownRowText}>Weeks</div>
          </motion.div>
          <motion.div
            className={styles.frequencyModalDropdownRow}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              scale: 1.01,
              transition: { duration: 0.1 },
            }}
            onClick={(e: any) => handleIntervalChoice("months")}
          >
            {" "}
            <div className={styles.frequencyModalDropdownRowText}>Months</div>
          </motion.div>
        </div>
      )}
      <div className={styles.frequencyModalRightContainer}>
        <div
          className={styles.frequencyModalGrayCircle}
          style={{ left: "150%", top: "80%" }}
        >
          <img
            src="/checkimage.svg"
            alt=""
            className={styles.frequencyModalCheckImage}
          />
        </div>
      </div>
      <div className={styles.frequencyModalLeftContainer}>
        <div className={styles.frequencyModalTextContainer}>
          <div className={styles.frequencyModalTitleText}>
            {`Strategy Created 
              `}
            {`Successfully`}
          </div>
          <div
            className={styles.frequencyModalDescriptionText}
          >{`Choose How frequently you'd like the strategy to run
                        
                        e.g, every 5 days, every 3.8 hours, etc.`}</div>
        </div>
        <div
          className={styles.frequencyModalBottomContainer}
          style={{ marginTop: "-90px" }}
        >
          <div className={styles.frequencyModalInputFlex}>
            <div className={styles.frequencyModalInputTitle}>Frequency</div>
            <div className={styles.frequencyModalInputFlexRow}>
              <input
                className={styles.frequencyModalInput}
                placeholder="Enter Number"
                type="number"
                onChange={(e: any) => setCurrentInput(e.target.value)}
              />
              <div
                className={styles.frequencyModalInputTimestampsContainer}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={styles.frequencyModalInputTimestampsText}>
                  {currentTimestamp.split("")[0].toUpperCase() +
                    currentTimestamp.slice(1)}
                </div>
                <img
                  src="/arrowdownfrequency.svg"
                  alt=""
                  className={styles.frequencyModalInputTImestampsArrowDown}
                />
              </div>
            </div>
          </div>
          <div className={styles.frequencyModalButtonsFlexRow}>
            <motion.div
              className={styles.frequencyModalCancelButton}
              whileHover={{ scale: 1.05 }}
            >
              Cancel
            </motion.div>
            <motion.div
              className={styles.frequencyModalSaveButton}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSave()}
              ref={saveBtnRef}
            >
              Save
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
