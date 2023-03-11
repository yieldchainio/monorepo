import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react";
import styles from "./css/protocolpools.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import {
  findProtocolActions,
  getProtocolTableRowDetails,
  getFunctionAddress,
} from "utils/utils";
import { isAbsolute } from "path";
import { EditDistributionModal } from "./editDistribution";
import { getFunctionDetails, getParameterDetails } from "utils/utils";

enum ActionTypes {
  STAKE,
  HARVEST,
  SWAP,
  ADDLIQ,
  LPZAP,
  CROSSCHAINSWAP,
}

interface IAction {
  type: ActionTypes;
  percentage: number;
  function: string;
  protocol: any;
  outflows?: any[];
  inflows?: any[];
  additional_args?: any[];
}

const PoolsTableRow = (props: any) => {
  /**
   * The Global Context For The Current Session's Strategy Base Steps
   */

  const { showPercentageBox, setShowPercentageBox } =
    useContext(StrategyContext);

  let navigate = useNavigate();
  const actionName = props.actionDetails.name;

  const [action_outflows, setActionOutflows] = useState<any>(undefined);
  const [action_inflows, setActionInflows] = useState<any>(undefined);
  const [action_networkDetails, setActionNetworkDetails] =
    useState<any>(undefined);
  const [action_unlockedActions, setActionUnlockedActions] =
    useState<any>(undefined);
  const [action_address, setActionAddress] = useState<any>(undefined);
  const [action_function, setActionFunction] = useState<any>(undefined);

  const initData = async () => {
    try {
      let { protocol_identifier, function_identifier, action_identifier } =
        props.executeThis;

      setActionAddress(await getFunctionAddress(function_identifier));

      let rowDetails = await getProtocolTableRowDetails(
        protocol_identifier,
        function_identifier,
        action_identifier
      );
      let functionDetails: any = await getFunctionDetails(
        props.executeThis.function_identifier
      );
      functionDetails.arguments = [
        ...(await functionDetails.arguments.map(async (arg: any) => {
          let parameterDetails;

          return await getParameterDetails(arg).then((res: any) => {
            return res;
          });
        })),
      ];
      functionDetails.arguments = await Promise.all(functionDetails.arguments);

      console.log(functionDetails, "functionDetails");
      let tempOutfLows = rowDetails.outflows;
      let tempInflows = rowDetails.inflows;
      let tempNetworkDetails = rowDetails.networkDetails;
      let tempUnlockedActions = rowDetails.unlockedActions;
      setActionOutflows(tempOutfLows);
      setActionInflows(tempInflows);
      setActionNetworkDetails(tempNetworkDetails);
      setActionUnlockedActions(tempUnlockedActions);
      setActionFunction(functionDetails);

      return {
        action_inflows,
        action_outflows,
        action_networkDetails,
        action_unlockedActions,
      };
    } catch (err) {
      console.log(err, "err");
    }
  };

  useEffect(() => {
    if (
      props.executeThis &&
      !action_outflows &&
      !action_inflows &&
      !action_networkDetails &&
      !action_unlockedActions
    ) {
      let res;
      initData().then((r) => (res = r));
    }

    return () => {
      setActionInflows(undefined);
      setActionOutflows(undefined);
      setActionNetworkDetails(undefined);
      setActionUnlockedActions(undefined);
    };
  }, []);

  if (
    action_outflows &&
    action_inflows &&
    action_networkDetails &&
    action_unlockedActions
  ) {
    return (
      <div
        style={{ height: "88px" }}
        onClick={() => setShowPercentageBox(false)}
      >
        <div className={styles.poolTableNameContainer}>
          <div className={styles.poolsTableNameText}>{actionName}</div>
        </div>
        <div className={styles.poolsTableNetworkContainer}>
          <img
            src={action_networkDetails.logo}
            alt=""
            className={styles.poolsTableSingleImgStyle}
          />
          <div className={styles.poolsTableNetworkText}>
            {action_networkDetails.name}
          </div>
        </div>
        <div className={styles.poolsTableTvlText}></div>
        <div className={styles.outflowsContainer}>
          {action_outflows.length <= 0 ? (
            <div className={styles.unlockedActionsText}>-</div>
          ) : (
            action_outflows.map((outflow: any, index: number) =>
              index <= 1 ? (
                <img
                  src={outflow.token_details.logo}
                  alt=""
                  className={styles.outflowImg}
                  key={index}
                  style={
                    action_outflows[index + 1]
                      ? { border: "2px solid black", zIndex: 10 - index }
                      : {}
                  }
                ></img>
              ) : index == action_outflows.length - 1 ? (
                <div className={styles.outFlowsPlusText}>
                  +{action_outflows.length - 1}
                </div>
              ) : (
                () => null
              )
            )
          )}
          {action_outflows.length !== 1 ? (
            () => null
          ) : (
            <div
              className={styles.unlockedActionsText}
              style={{ left: "30px", top: "8px" }}
            >
              {action_outflows[0].token_details.symbol}
            </div>
          )}
        </div>
        <div className={styles.inflowsContainer}>
          {action_inflows.length <= 0 ? (
            <div
              className={styles.unlockedActionsText}
              style={{ left: "18px", top: "8px", fontSize: "32px" }}
            >
              -
            </div>
          ) : (
            action_inflows.map((inflow: any, index: number) =>
              index <= 1 ? (
                <img
                  src={inflow.token_details.logo}
                  alt=""
                  className={styles.inflowImg}
                  key={index}
                  style={
                    action_inflows[index + 1]
                      ? { border: "2px solid black", zIndex: 10 - index }
                      : {}
                  }
                ></img>
              ) : index == action_inflows.length - 1 ? (
                <div className={styles.inFlowsPlusText}>
                  +{action_inflows.length - 1}
                </div>
              ) : (
                () => null
              )
            )
          )}
          {action_inflows.length !== 1 ? (
            () => null
          ) : (
            <div
              className={styles.unlockedActionsText}
              style={{ left: "34px", top: "8px" }}
            >
              {action_inflows[0].token_details.symbol}
            </div>
          )}
        </div>
        <div className={styles.unlockedActionsText}>Harvest</div>
        <motion.button
          className={styles.poolsTableActionBtn}
          whileHover={{
            scale: 1.05,
            background:
              "linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)) padding-box, linear-gradient(90deg,   rgba(0, 176, 235, 1) 0%,  rgba(217, 202, 15, 1) 100%) border-box",
            border: "1px solid transparent",
            color: "white",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={(e: any) => {
            e.stopPropagation();
            setShowPercentageBox({
              action_inflows: action_inflows,
              action_outflows: action_outflows,
              function_identifier: props.executeThis.function_identifier,
              protocol_identifier: props.executeThis.protocol_identifier,
              actionName: actionName,
              address_identifier: action_address.address_identifier,
              mouse_location: {
                height: e.screenY + window.scrollY,
                width: e.screenX,
              },
              protocolDetails: props.protocolDetails,
              additional_args: action_function.arguments.filter((arg: any) =>
                arg.value.includes("abi.decode(current_custom_arguments[")
              ),
            });
          }}
        >
          + Base Step
        </motion.button>
      </div>
    );
  } else {
    return <h1>Penis...</h1>;
  }
};

export const PoolsTable = (props: any) => {
  const {
    fullProtocolsList,
    fullAddressesList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
    protocolsAddressesList,
  } = useContext(DatabaseContext);

  const protocol_identifier = props.protocol_identifier;

  const { showPercentageBox, setShowPercentageBox } =
    useContext(StrategyContext);

  const [rowsList, setRowsList] = useState<any>(undefined);
  const [addressesList, setAddressesList] = useState<any>(undefined);

  const initData = async () => {
    let actionFunctionsPairs = await findProtocolActions(protocol_identifier);
    let correspondingAddresses = await setRowsList(actionFunctionsPairs);
  };

  useEffect(() => {
    if (protocol_identifier && !rowsList) {
      initData();
    } else {
    }
  }, [protocol_identifier]);

  if (rowsList) {
    return (
      <div>
        <div className={styles.poolsTableTitle}>
          <div className={styles.tableTitleText}>Action</div>
          <div className={styles.tableTitleText}>Outflows</div>
          <div className={styles.tableTitleText}>Inflows</div>
          <div className={styles.tableTitleText}>Unlocked Actions</div>
          <div className={styles.tableTitleText}>Network</div>
          <div className={styles.tableTitleText}>Action</div>
        </div>
        <img
          src="/reddownarrow.svg"
          alt=""
          style={{
            height: "15px",
            width: "14px",
            position: "absolute",
            top: "516px",
            left: "415px",
          }}
        />
        <img
          src="/greenuparrow.svg"
          alt=""
          style={{
            height: "13px",
            width: "11px",
            position: "absolute",
            top: "516px",
            left: "655px",
          }}
        />

        <div className={styles.poolsTable}>
          {rowsList.map((actionFunctionPair: any, index: any) => (
            <PoolsTableRow
              key={index}
              executeThis={{
                protocol_identifier: parseInt(protocol_identifier),

                function_identifier:
                  actionFunctionPair.functionDetails.function_identifier,

                action_identifier:
                  actionFunctionPair.actionDetails.action_identifier,
              }}
              actionDetails={actionFunctionPair.actionDetails}
              showPercentageBox={showPercentageBox}
              protocolDetails={props.protocolDetails}
            ></PoolsTableRow>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
