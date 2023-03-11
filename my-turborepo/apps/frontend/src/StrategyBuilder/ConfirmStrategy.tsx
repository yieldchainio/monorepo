import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import styles from "../css/strategyBuilder.module.css";
import { DatabaseContext, StrategyContext } from "../Contexts/DatabaseContext";
import { toTitleCase } from "utils/utils";
import { motion } from "framer-motion";
import axios from "axios";
import * as ethers from "ethers";
import { sortStepsArr } from "../Contexts/Dump";
import { NodeStepEnum } from "./Enums";

export const ConfirmStrategy = (props: any) => {
  const {
    strategySteps,
    setStrategySteps,
    strategyName,
    executionInterval,
    baseSteps,
    depositToken,
    strategyNetworks,
  } = useContext<any>(StrategyContext);

  const { signer, provider, chainId, account } =
    useContext<any>(DatabaseContext);

  const { modalHandler } = props;

  const [description, setDescription] = useState<string>("None");

  const [strategy_steps, setStrategy_steps] = useState<any>([]);
  const [base_strategy_steps, setBaseStrategySteps] = useState<any>([]);

  const generateStrategyDescription = () => {
    let description = "";
    for (const step of strategy_steps) {
      let stepActionName = toTitleCase(step.type);
      let stepOutflows = step.outflows.map((outflow: any, index: number) =>
        index > 0 ? ", " : "" + toTitleCase(outflow.token_details.symbol)
      );
      let stepProtocol = toTitleCase(step.protocol_details.name);
      let stepInflows = step.inflows.map((inflow: any, index: number) =>
        index > 0 ? ", " : "" + toTitleCase(inflow.token_details.symbol)
      );

      if (stepOutflows.length > 0 && stepInflows.length > 0) {
        description += `${stepActionName} ${stepOutflows.join(
          " "
        )} on ${stepProtocol}, ${
          stepInflows.join(" ").length > 2 ? "get" + stepInflows.join(" ") : ""
        }. `;
      } else if (stepOutflows.length > 0) {
        description += `${stepActionName} ${stepOutflows.join(
          " "
        )} on ${stepProtocol} `;
      } else if (stepInflows.length > 0) {
        description += `${stepActionName} ${stepInflows.join(
          " "
        )} on ${stepProtocol} `;
      } else {
        description += `${stepActionName} on ${stepProtocol} `;
      }
    }
    return description;
  };

  useEffect(() => {
    setDescription(generateStrategyDescription());
  }, [strategy_steps]);

  useEffect(() => {
    let tArr = [...strategySteps];
    let bTArr = [...baseSteps];
    tArr = sortStepsArr(
      tArr.filter(
        (step: any) =>
          step.type !== "deposittoken" &&
          step.type !== "tokens" &&
          step.type !== "swapcomponent" &&
          step.type !== NodeStepEnum.CHOOSE_ACTION
      ),
      false
    );
    bTArr = sortStepsArr(
      bTArr.filter(
        (step: any) =>
          step.type !== "deposittoken" &&
          step.type !== "tokens" &&
          step.type !== "swapcomponent" &&
          step.type !== NodeStepEnum.CHOOSE_ACTION
      ),
      false
    );

    setStrategy_steps(tArr);
    setBaseStrategySteps(bTArr);
  }, [strategySteps]);

  const getDeploymentData = async () => {
    let strategyObject = {
      strategy_name: strategyName,
      execution_interval: executionInterval,
      strategy_initiation: {
        base_steps: base_strategy_steps,
      },
      steps_array: strategy_steps,
      vault_deposit_token_identifier: depositToken.token_identifier,
      network: parseInt(strategyNetworks[0].chain_id),
    };
    console.log("This is strategy object am posting");
    console.log(strategyObject);
    let contractData = await axios.post(
      "https://builderapi.yieldchain.io/create-strategy",
      {
        strategyObject: strategyObject,
      }
    );
    console.log(contractData, "contract DATA");

    let iFace = new ethers.utils.Interface(contractData.data.txidData.abi);
    let bytecode = contractData.data.txidData.bytecode;
    let factory = new ethers.ContractFactory(iFace, bytecode, signer);

    let stratContract = await factory.deploy();

    let strategyObjectToAdd = {
      address: stratContract.address,
      name: strategyName,
      upkeep_id: 1,
      apy: 50,
      tvl: 10000,
      main_protocol_identifier: 1,
      creator_user_identifier: 1,
      chain_id: 56,
      main_token_identifier: depositToken.token_identifier,
      final_token_identifier: depositToken.token_identifier,
      is_verified: true,
      is_trending: false,
      execution_interval: executionInterval,
      strategy_object: {
        ...strategyObject,
      },
    };

    let addingStrategy = await axios.post(
      "https://builderapi.yieldchain.io/add-strategy",
      {
        strategyObject: strategyObjectToAdd,
      }
    );
    console.log("Adding strategy", addingStrategy);
    console.log(stratContract.address, "Strat contract");
  };

  return (
    <div
      className={styles.deployStrategyBlurWrapper}
      onClick={() => modalHandler(false)}
    >
      <div
        className={styles.deployStrategyContainer}
        style={{ zIndex: "9999999999999999999999" }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <div className={styles.deployStrategyTitle}>Confirm Strategy</div>
        <div className={styles.deployStrategyDescription}>{description}</div>
        <div className={styles.deployStrategyApyTitle}>APY / APR</div>
        <div className={styles.deployStrategyApyContainer}>
          <div className={styles.deployStrategyFlexRowContainer}>
            <div className={styles.deployStrategyApyOffText}>New APY</div>
            <div className={styles.deployStrategyApyColorfulText}>220%</div>
          </div>
          <div className={styles.deployStrategyFlexDivisorLine}></div>
          <div
            className={styles.deployStrategyFlexRowContainer}
            style={{ marginTop: "8px" }}
          >
            <div className={styles.deployStrategyApyOffText}>Old APR</div>
            <div className={styles.deployStrategyApyOnText}>31%</div>
          </div>
        </div>
        <div className={styles.deployStrategyApyTitle}>Token Details</div>
        <div className={styles.deployStrategyApyContainer}>
          <div className={styles.deployStrategyFlexRowContainer}>
            <div className={styles.deployStrategyApyOffText}>Deposit Token</div>
            <div className={styles.deployStrategyTokenContainer}>
              <div className={styles.deployStrategyApyOnText}>CAKE</div>
              <img
                className={styles.deployStrategyTokenIcon}
                alt=""
                src="/cake.svg"
              />
            </div>
          </div>
          <div className={styles.deployStrategyFlexDivisorLine}></div>
          <div
            className={styles.deployStrategyFlexRowContainer}
            style={{ marginTop: "8px" }}
          >
            <div className={styles.deployStrategyApyOffText}>Reward Token</div>
            <div className={styles.deployStrategyTokenContainer}>
              <div className={styles.deployStrategyApyOnText}>BNB</div>
              <img
                className={styles.deployStrategyTokenIcon}
                alt=""
                src="/cake.svg"
              />
            </div>
          </div>
        </div>
        <div className={styles.deployStrategyApyTitle}>Gas Fees</div>
        <div className={styles.deployStrategyApyContainer}>
          <div className={styles.deployStrategyFlexRowContainer}>
            <div className={styles.deployStrategyApyOffText}>
              Gas Fee Per Run
            </div>
            <div className={styles.deployStrategyTokenContainer}>
              <div className={styles.deployStrategyApyOnText}>2.21$</div>
              <img
                className={styles.deployStrategyTokenIcon}
                alt=""
                src="/graywarningsign.svg"
              />
            </div>
          </div>
        </div>
        <div className={styles.deployStrategyButtonsContainer}>
          <motion.div
            className={styles.deployStrategyCancelButton}
            whileHover={{ scale: 1.05 }}
            onClick={() => modalHandler(false)}
          >
            Cancel
          </motion.div>
          <motion.div
            className={styles.deployStrategyDeployButton}
            whileHover={{ scale: 1.05 }}
            onClick={() => getDeploymentData()}
          >
            Deploy Now
          </motion.div>
        </div>
      </div>
    </div>
  );
};
