import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import styles from "./css/editDistribution.module.css";
import { motion } from "framer-motion";
import axios from "axios";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { isAbsolute } from "path";
import { CustomArgs } from "./StrategyBuilder/Configs/CustomArgs";
import { HoverDetails } from "HoverDetails";

export const EditDistributionModal = (props: any) => {
  const { setDivisor } = props;
  const { showPercentageBox, setShowPercentageBox, handleBaseStepAdd } =
    useContext(StrategyContext);

  const [customPercentage, setCustomPercentage] = useState<number>(0);
  const [currentChoice, setCurrentChoice] = useState<number>(100);
  const [additionalArgsOpen, setAdditionalArgsOpen] = useState<boolean>(false);
  const [additionalArgsAdded, setAdditionalArgsAdded] = useState<any>(false);
  const [hoverDetailsOpen, setHoverDetailsOpen] = useState<any>(false);

  // Refs
  const chooseBtnRef = useRef<any>();

  const handleCustomPercentage = (event: any) => {
    if (event > 100) {
      setCustomPercentage(100);
      return;
    }
    if (event < 0.1) {
      setCustomPercentage(0.1);
      return;
    }
    if (event > 0.1 && event < 100) {
      setCustomPercentage(event);
      return;
    }
  };

  const handleClick = (e: any) => {
    if (showPercentageBox.additional_args.length <= 0) {
      handleBaseStepAdd(
        showPercentageBox,
        currentChoice !== 110 ? currentChoice : customPercentage,
        null
      );
    } else {
      if (additionalArgsAdded) {
        handleBaseStepAdd(
          showPercentageBox,
          currentChoice !== 110 ? currentChoice : customPercentage,
          additionalArgsAdded
        );
      } else {
        setHoverDetailsOpen({
          top: chooseBtnRef.current.getBoundingClientRect().top,
          left: chooseBtnRef.current.getBoundingClientRect().left,
          text: "Please add the required additional arguments",
        });
      }
    }
  };

  useEffect(() => {
    console.log(
      "UseEffect Lalalala",
      showPercentageBox.additional_args,
      "Additioan largs"
    );
    if (
      showPercentageBox.additional_args &&
      showPercentageBox.additional_args.length > 0
    ) {
      setAdditionalArgsOpen(true);
    }
  }, [JSON.stringify(showPercentageBox)]);

  const ArgsModalHandler = (args: any) => {
    if (args.length == showPercentageBox.additional_args.length) {
      setAdditionalArgsOpen(false);
      setAdditionalArgsAdded(args);
    }
  };

  return (
    <div style={{ height: "0px", width: "0px" }}>
      {hoverDetailsOpen && (
        <HoverDetails
          top={hoverDetailsOpen.top}
          left={hoverDetailsOpen.left}
          text={hoverDetailsOpen.text}
        />
      )}
      {additionalArgsOpen && (
        <CustomArgs
          handler={ArgsModalHandler}
          customArgs={showPercentageBox.additional_args}
          style={{
            top: `${showPercentageBox.mouse_location.height - 560}px`,
            left: `${showPercentageBox.mouse_location.width - 689}px`,
            position: "absolute",
            zIndex: 10000,
          }}
        />
      )}
      {showPercentageBox && (
        <div
          className={styles.modalBody}
          onClick={(e) => e.stopPropagation()}
          style={{
            top: `${showPercentageBox.mouse_location.height - 260}px`,
            left: `${showPercentageBox.mouse_location.width - 289}px`,
            zIndex: `100`,
          }}
        >
          <div className={styles.title}>Set % Of Deposit</div>
          <motion.button
            className={styles.percentageBtn}
            key={25}
            onClick={() => setCurrentChoice(25)}
            style={currentChoice == 25 ? { border: "0.5px solid white" } : {}}
            whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
          >
            25%
          </motion.button>
          <motion.button
            className={styles.percentageBtn}
            key={50}
            onClick={() => setCurrentChoice(50)}
            style={
              currentChoice == 50
                ? { border: "0.5px solid white", left: "66px" }
                : { left: "66px" }
            }
            whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
          >
            50%
          </motion.button>
          <motion.button
            className={styles.percentageBtn}
            style={
              currentChoice == 75
                ? { border: "0.5px solid white", left: "116px" }
                : { left: "116px" }
            }
            key={75}
            onClick={() => setCurrentChoice(75)}
            whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
          >
            75%
          </motion.button>
          <motion.button
            className={styles.percentageBtn}
            style={
              currentChoice == 100
                ? { border: "0.5px solid white", left: "166px" }
                : { left: "166px" }
            }
            key={100}
            onClick={() => setCurrentChoice(100)}
            whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
          >
            100%
          </motion.button>
          <motion.input
            type="number"
            className={styles.customInput}
            placeholder="e.g 12"
            value={customPercentage}
            key={110}
            onChange={(e: any) =>
              handleCustomPercentage(parseInt(e.target.value))
            }
            onClick={() => setCurrentChoice(110)}
            style={currentChoice == 110 ? { border: "0.5px solid white" } : {}}
            whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
          />
          <div className={styles.percentageSymbol}>%</div>
          <motion.button
            className={styles.chooseBtn}
            whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
            onClick={(e: any) => handleClick(e)}
            ref={chooseBtnRef}
          >
            Choose
          </motion.button>
        </div>
      )}
    </div>
  );
};

export const EditPercentageModal = (props: any) => {
  const { setPercentage, locationDetails } = props;
  const [customPercentage, setCustomPercentage] = useState<number>(0);
  const [currentChoice, setCurrentChoice] = useState<number>(100);

  const handleCustomPercentage = (event: any) => {
    if (event > 100) {
      setCustomPercentage(100);
      return;
    }
    if (event < 0.1) {
      setCustomPercentage(0.1);
      return;
    }
    if (event > 0.1 && event < 100) {
      setCustomPercentage(event);
      return;
    }
  };

  return (
    <div
      style={{ height: "500px", width: "0px", zIndex: "999999999999999999" }}
    >
      <div
        className={styles.modalBody}
        onClick={(e) => e.stopPropagation()}
        style={{
          top: `${locationDetails.mouse_location.height - 160}px`,
          left: `${locationDetails.mouse_location.width - 290}px`,
          zIndex: "999999999999999999999999999999999999",
          border: "1px solid rgba(255, 255, 255, 0.25)",
        }}
      >
        <div className={styles.title}>Set % Of Deposit</div>
        <motion.button
          className={styles.percentageBtn}
          key={25}
          onClick={() => setCurrentChoice(25)}
          style={currentChoice == 25 ? { border: "0.5px solid white" } : {}}
          whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
        >
          25%
        </motion.button>
        <motion.button
          className={styles.percentageBtn}
          key={50}
          onClick={() => setCurrentChoice(50)}
          style={
            currentChoice == 50
              ? { border: "0.5px solid white", left: "66px" }
              : { left: "66px" }
          }
          whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
        >
          50%
        </motion.button>
        <motion.button
          className={styles.percentageBtn}
          style={
            currentChoice == 75
              ? { border: "0.5px solid white", left: "116px" }
              : { left: "116px" }
          }
          key={75}
          onClick={() => setCurrentChoice(75)}
          whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
        >
          75%
        </motion.button>
        <motion.button
          className={styles.percentageBtn}
          style={
            currentChoice == 100
              ? { border: "0.5px solid white", left: "166px" }
              : { left: "166px" }
          }
          key={100}
          onClick={() => setCurrentChoice(100)}
          whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
        >
          100%
        </motion.button>
        <motion.input
          type="number"
          className={styles.customInput}
          placeholder="e.g 12"
          value={customPercentage}
          key={110}
          onChange={(e: any) =>
            handleCustomPercentage(parseInt(e.target.value))
          }
          onClick={() => setCurrentChoice(110)}
          style={currentChoice == 110 ? { border: "0.5px solid white" } : {}}
          whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
        />
        <div className={styles.percentageSymbol}>%</div>
        <motion.button
          className={styles.chooseBtn}
          whileHover={{ backgroundColor: "rgba(32, 32, 35, 0.8)" }}
          onClick={() =>
            setPercentage(
              currentChoice !== 110 ? currentChoice : customPercentage
            )
          }
        >
          Choose
        </motion.button>
      </div>
    </div>
  );
};
