import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "../css/editDistribution.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "../Contexts/DatabaseContext";
import { ButtonVariants } from "../MotionVariants";
import { HoverDetails } from "../HoverDetails";
import { SizingEnum } from "./Enums";
import { NodeStepEnum } from "./Enums";
import { calcDivisor } from "../utils/utils";

export const EditDistributionModal = (props: any) => {
  // Strategy Context
  const {
    strategySteps,
    setStrategySteps,
    actionableTokens,
    setActionableTokens,
  } = useContext(StrategyContext);

  // Props
  const { parentId, childId, modalHandler, unusedPercentage } = props;

  const { setPercentage, locationDetails } = props;
  const [customPercentage, setCustomPercentage] = useState<number>(0);
  const [currentChoice, setCurrentChoice] = useState<number>(100);

  const handlePercentageChoice = async (percentage: number) => {
    // Setting the percentage to the unused percentage if the percentage is above the unused percentage.
    // (i.e , i there is 40% left, and the user tries to use 80% - we use 40% instead, as that is the maximum left)
    let isAboveLimit = percentage > unusedPercentage;
    if (isAboveLimit) {
      setPercentage(unusedPercentage);
      modalHandler(false);
      return;
    }

    // Index of the child step within the strategy Steps Array
    let childStepIndex = strategySteps.findIndex(
      (_step: any) => _step.step_identifier == childId
    );

    // Index of parent step (to use for finding actionable tokens from outflows)
    let parentStepIndex = strategySteps.findIndex(
      (_step: any) => _step.step_identifier == parentId
    );

    // Changing the percentage & divisors
    let tArr = [...strategySteps];
    tArr[childStepIndex].percentage = percentage;
    tArr[childStepIndex].divisor = await calcDivisor(percentage);

    // Setting the strategy steps to the new array, closing the modal
    setStrategySteps(tArr);
    modalHandler(false);

    let tempActionableTokens: any[] = [...actionableTokens];
    if (unusedPercentage + percentage >= 100) {
      console.log(
        "percentage has left, Iterating over parent tokens",
        strategySteps[parentStepIndex].inflows
      );
      for (const token of strategySteps[parentStepIndex].inflows) {
        let isInActionableTokens = tempActionableTokens.find((_token: any) => {
          return (
            _token.token_identifier == token.token_details.token_identifier
          );
        });

        if (!isInActionableTokens) {
          tempActionableTokens.push(token.token_details);
        }
      }
      if (tempActionableTokens.length > actionableTokens.length) {
        setActionableTokens(tempActionableTokens);
      }
    }
    console.log("Strategy Steps", strategySteps);
  };

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
          top: `${locationDetails.top}px`,
          left: `${locationDetails.left}px`,
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
            handlePercentageChoice(
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
