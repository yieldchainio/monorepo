import { useState, useEffect } from "react";
import styles from "./css/maincss.module.css";
import DropdownInput from "./DropdownInput";
import { TextInput } from "./TextInput";
import { IFlow, IFlowWithAmount } from "./scripts/map-funcs-to-flows";
import { DBAction, IntegrateAbleFunction } from "./types";
import { Checkbox } from "./Checkbox";
import { IFullArg, IFullFunction } from "./App";
import { motion } from "framer-motion";

export const FunctionTableRow = ({
  tempId,
  name,
  choiceHandler,
  flows,
  args,
  txnsAmount,
  otherFuncIds,
  actions,
  index,
  removalHandler,
  address,
}: {
  tempId: number;
  name: string;
  choiceHandler: (func: IFullFunction | IntegrateAbleFunction) => void;
  flows: IFlow[];
  args: IFullArg[];
  txnsAmount: number;
  otherFuncIds: number[];
  actions: DBAction[];
  index: number;
  removalHandler: (tempId: number) => void;
  address: string;
}) => {
  const [chosen, setChosen] = useState<boolean>(false);
  const [counterFuncId, setCounterFuncId] = useState<number | null>(null);
  const [unlockedByFuncId, setUnlockedByFuncId] = useState<number | null>(null);
  const [actionId, setAction] = useState<number | null>(null);
  const [funcPageOpen, setFuncPageOpen] = useState<boolean>(false);
  const [chosenFlows, setChosenFlows] = useState<IFlow[]>([]);
  const [chosenArguments, setChosenArguments] = useState<IFullArg[]>(args);

  // Handle arg text value change
  const handleArgumentValueChange = (_value: string, index: number) => {
    let newArr = [...chosenArguments];
    newArr[index].value = _value;
    setChosenArguments(newArr);
  };

  // Handle change of argument's group ID
  const handleArgumentGroupIdChange = (_value: string, index: number) => {
    let newArr = [...chosenArguments];
    newArr[index].group_id = parseInt(_value);
    setChosenArguments(newArr);
  };

  // Handle a flow choice (true/false - on/off)
  const handleFlowChoice = (index: number, _chosen: boolean) => {
    let newArr = [...chosenFlows];
    let refreedFlow = flows[index];
    if (_chosen) {
      newArr.push(refreedFlow);
    } else {
      newArr = newArr.filter(
        (flow: IFlow) =>
          flow.outflow0_or_inflow1 !== refreedFlow.outflow0_or_inflow1 &&
          flow.token_details.token_identifier !==
            refreedFlow.token_details.token_identifier
      );
    }

    setChosenFlows(newArr);
  };

  const isFlowChecked = (flow: IFlow) => {
    return chosenFlows.some(
      (chosenFlow: IFlow) =>
        chosenFlow.token_details.token_identifier ===
          flow.token_details.token_identifier &&
        chosenFlow.outflow0_or_inflow1 === flow.outflow0_or_inflow1
    );
  };

  useEffect(() => {
    flows = flows.sort(
      (a: IFlow, b: IFlow) => a.percentageOfFuncTxns + b.percentageOfFuncTxns
    );
  }, [flows]);

  // Invoke the choice handler each time any of these parameters change
  useEffect(() => {
    let newFlows = flows.map((flow: IFlow) => {
      let isFlowChosen = chosenFlows.some(
        (chosenFlow: IFlow) =>
          chosenFlow.token_details.token_identifier ===
          flow.token_details.token_identifier
      );
      return {
        ...flow,
        chosen: isFlowChosen,
      };
    });
    choiceHandler({
      tempId: tempId,
      name: name,
      chosen: chosen,
      flows: newFlows,
      counterFuncId: counterFuncId,
      unlockedByFuncId: unlockedByFuncId,
      txnsAmount: txnsAmount,
      args: chosenArguments,
      chosenFlows: chosenFlows,
      actionId: actionId || -1,
    });
  }, [
    chosen,
    chosenFlows,
    counterFuncId,
    unlockedByFuncId,
    actionId,
    chosenArguments,
  ]);

  return (
    <div>
      {funcPageOpen && (
        <div
          className={styles.funcPageWrapper}
          onClick={() => setFuncPageOpen(false)}
          style={{
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          <div
            className={styles.funcModalBody}
            style={{
              overflowX: "hidden",
              overflowY: "hidden",
            }}
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className={styles.funcModalTitleContainer}>
              <div className={styles.funcModalTitle}>{name}</div>
              <div className={styles.funcModalSubtitle}>
                Transactions Found:
              </div>
              <div className={styles.funcModalSubtitle}>{txnsAmount}</div>
            </div>{" "}
            <div className={styles.funcModalFlowsTitle}>ERC20 Flows:</div>
            <div className={styles.funcModalFlowsTable}>
              <div className={styles.funcModalFlowRow}>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{ gap: "2.5vh" }}
                >
                  <div style={{ textDecoration: "underline" }}>Token:</div>

                  {flows.map((flow: IFlow) => {
                    return (
                      <div className={styles.funcModalColumContainer}>
                        {flow.token_details.logo == ("" || null) ? (
                          <img
                            src="/unknowntoken.svg"
                            alt=""
                            style={{
                              borderRadius: "50%",
                              width: "3vw",
                            }}
                          />
                        ) : (
                          <img
                            src={flow.token_details.logo}
                            alt=""
                            style={{
                              borderRadius: "50%",
                              width: "3vw",
                            }}
                          />
                        )}

                        <div className={styles.flowsColumnText}>
                          {flow.token_details.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.funcModalFlowColumn}>
                  <div
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Address:
                  </div>
                  {flows.map((flow: IFlow) => {
                    return (
                      <motion.div
                        style={{
                          overflow: "hidden",
                          width: "10vw",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        whileHover={{
                          textDecoration: "underline",
                        }}
                        title={flow.token_details.address}
                        onClick={() => {
                          navigator.clipboard.writeText(
                            flow.token_details.address
                          );
                        }}
                      >
                        {flow.token_details.address}
                      </motion.div>
                    );
                  })}
                </div>
                <div className={styles.funcModalFlowColumn}>
                  <div
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Out/Inflow:
                  </div>
                  {flows.map((flow: IFlow) => {
                    return (
                      <div
                        className={styles.flowsColumnText}
                        style={{
                          color:
                            flow.outflow0_or_inflow1 === 1
                              ? "rgb(0, 211, 60)"
                              : "red",
                        }}
                      >
                        {flow.outflow0_or_inflow1 === 1 ? "Inflow" : "Outflow"}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.funcModalFlowColumn}>
                  {" "}
                  <div
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Markets:
                  </div>
                  {flows.map((flow: IFlow) => {
                    return (
                      <div>
                        {flow.token_details.markets.length > 0
                          ? flow.token_details.markets.filter(
                              (market: any, index: number) => {
                                return (
                                  flow.token_details.markets.indexOf(market) ===
                                  index
                                );
                              }
                            )
                          : ["N/A"]}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.funcModalFlowColumn}>
                  <div
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    % Of Txns:
                  </div>
                  {flows.map((flow: IFlow) => {
                    return <div>{flow.percentageOfFuncTxns.toFixed(0)}%</div>;
                  })}
                </div>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{
                    gap: "4.3vh",
                  }}
                >
                  <div
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Include:
                  </div>
                  {flows.map((flow: IFlow, index: number) => {
                    return (
                      <Checkbox
                        choiceHandler={handleFlowChoice}
                        style={{
                          width: "2vw",
                          height: "2vw",
                          marginLeft: "1.5vw",
                        }}
                        argsToInclude={[index]}
                        checked={isFlowChecked(flow)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.funcModalFlowsTitle}>Arguments: </div>
            <div className={styles.funcModalFlowsTable}>
              <div className={styles.funcModalFlowRow}>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{ gap: "2.5vh" }}
                >
                  <div style={{ textDecoration: "underline" }}>Index:</div>

                  {args.map((arg: IFullArg, index: number) => {
                    return <div>{arg.tempId}</div>;
                  })}
                </div>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{ gap: "2.5vh" }}
                >
                  <div style={{ textDecoration: "underline" }}>Name:</div>

                  {args.map((arg: IFullArg) => {
                    return <div>{arg.name}</div>;
                  })}
                </div>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{ gap: "2.5vh" }}
                >
                  <div style={{ textDecoration: "underline" }}>Value:</div>

                  {args.map((arg: IFullArg, index: number) => {
                    return (
                      <TextInput
                        onChange={handleArgumentValueChange}
                        changeArgs={[index]}
                        style={{
                          width: "20vw",
                          height: "1.3vh",
                          fontSize: "1.2vw",
                          padding: "1.1vw",
                        }}
                        value={arg.value}
                      />
                    );
                  })}
                </div>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{ gap: "2.5vh" }}
                >
                  <div style={{ textDecoration: "underline" }}>Type:</div>

                  {args.map((arg: IFullArg) => {
                    return <div>{arg.type}</div>;
                  })}
                </div>
                <div
                  className={styles.funcModalFlowColumn}
                  style={{ gap: "2.5vh" }}
                >
                  <div style={{ textDecoration: "underline" }}>Group ID:</div>

                  {args.map((arg: IFullArg, index: number) => {
                    return (
                      <TextInput
                        onChange={handleArgumentGroupIdChange}
                        changeArgs={[index]}
                        style={{
                          width: "20vw",
                          height: "1.3vh",
                          fontSize: "1.2vw",
                          padding: "1.1vw",
                        }}
                        value={arg.tempId}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      )}
      <div
        className={styles.functionsTableRow}
        style={{ border: "1px solid transparent", gap: "0px" }}
      >
        <div
          className={styles.functionsTableColumn}
          style={{ width: "8%", marginRight: "5.5vw" }}
        >
          {tempId}
        </div>
        <motion.div
          className={styles.functionsTableColumn}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginRight: "2vw",
            width: "20%",
            cursor: "pointer",
          }}
          whileHover={{
            textDecoration: "underline",
            color: "rgb(0, 0, 0, 0.75)",
          }}
          transition={{ duration: 0.2 }}
          onClick={() => setFuncPageOpen(!funcPageOpen)}
        >
          {name}
        </motion.div>
        <DropdownInput
          options={otherFuncIds.map((_funcId: number) => {
            return {
              label: _funcId.toString(),
              data: _funcId,
            };
          })}
          choiceHandler={setCounterFuncId}
          style={{
            width: "10vw",
            height: "4vh",
            marginRight: "4.5vw",
          }}
          textStyle={{ fontSize: "1.4vw" }}
          itemStyle={{ fontSize: "1.2vw", height: "max-content" }}
          dropdownStyle={{
            height: "20vh",
            width: "10vw",
            marginLeft: "-1.2vw",
            gap: "0px",
          }}
          placeholder={{
            label: "null",
          }}
        />
        <DropdownInput
          options={otherFuncIds.map((_funcId: number) => {
            return {
              label: _funcId.toString(),
              data: _funcId,
            };
          })}
          choiceHandler={setUnlockedByFuncId}
          style={{
            width: "10vw",
            height: "4vh",
            marginRight: "5vw",
          }}
          textStyle={{ fontSize: "1.4vw" }}
          itemStyle={{ fontSize: "1.2vw", height: "max-content" }}
          dropdownStyle={{
            height: "20vh",
            width: "10vw",
            gap: "0px",
          }}
          placeholder={{
            label: "null",
          }}
        />
        <DropdownInput
          options={actions.map((action: DBAction) => {
            return {
              label: action.name,
              data: action.action_identifier,
            };
          })}
          choiceHandler={setAction}
          style={{
            width: "10vw",
            height: "4vh",
            marginLeft: "0.2vw",
          }}
          placeholder={{
            label: "null",
          }}
          textStyle={{ fontSize: "1vw" }}
          itemStyle={{ fontSize: "1.2vw", height: "max-content" }}
          dropdownStyle={{
            height: "20vh",
            width: "10vw",
            marginLeft: "0.2vw",
            gap: "0px",
          }}
        />
        <Checkbox choiceHandler={setChosen} />
        <motion.img
          src="trashcan.png"
          alt=""
          style={{
            width: "1.5vw",
            marginLeft: "3vw",
            marginBottom: "0.5vh",
            cursor: "pointer",
          }}
          whileHover={{
            scale: 1.1,
          }}
          onClick={() => removalHandler(index)}
        />
      </div>
    </div>
  );
};
