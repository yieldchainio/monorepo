"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionTableRow = void 0;
const react_1 = require("react");
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const DropdownInput_1 = __importDefault(require("./DropdownInput"));
const TextInput_1 = require("./TextInput");
const Checkbox_1 = require("./Checkbox");
const framer_motion_1 = require("framer-motion");
const FunctionTableRow = ({ tempId, name, choiceHandler, flows, args, txnsAmount, otherFuncIds, actions, index, removalHandler, address, }) => {
    const [chosen, setChosen] = (0, react_1.useState)(false);
    const [counterFuncId, setCounterFuncId] = (0, react_1.useState)(null);
    const [unlockedByFuncId, setUnlockedByFuncId] = (0, react_1.useState)(null);
    const [actionId, setAction] = (0, react_1.useState)(null);
    const [funcPageOpen, setFuncPageOpen] = (0, react_1.useState)(false);
    const [chosenFlows, setChosenFlows] = (0, react_1.useState)([]);
    const [chosenArguments, setChosenArguments] = (0, react_1.useState)(args);
    // Handle arg text value change
    const handleArgumentValueChange = (_value, index) => {
        let newArr = [...chosenArguments];
        newArr[index].value = _value;
        setChosenArguments(newArr);
    };
    // Handle change of argument's group ID
    const handleArgumentGroupIdChange = (_value, index) => {
        let newArr = [...chosenArguments];
        newArr[index].group_id = parseInt(_value);
        setChosenArguments(newArr);
    };
    // Handle a flow choice (true/false - on/off)
    const handleFlowChoice = (index, _chosen) => {
        let newArr = [...chosenFlows];
        let refreedFlow = flows[index];
        if (_chosen) {
            newArr.push(refreedFlow);
        }
        else {
            newArr = newArr.filter((flow) => flow.outflow0_or_inflow1 !== refreedFlow.outflow0_or_inflow1 &&
                flow.token_details.token_identifier !==
                    refreedFlow.token_details.token_identifier);
        }
        setChosenFlows(newArr);
    };
    const isFlowChecked = (flow) => {
        return chosenFlows.some((chosenFlow) => chosenFlow.token_details.token_identifier ===
            flow.token_details.token_identifier &&
            chosenFlow.outflow0_or_inflow1 === flow.outflow0_or_inflow1);
    };
    (0, react_1.useEffect)(() => {
        flows = flows.sort((a, b) => a.percentageOfFuncTxns + b.percentageOfFuncTxns);
    }, [flows]);
    // Invoke the choice handler each time any of these parameters change
    (0, react_1.useEffect)(() => {
        let newFlows = flows.map((flow) => {
            let isFlowChosen = chosenFlows.some((chosenFlow) => chosenFlow.token_details.token_identifier ===
                flow.token_details.token_identifier);
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
    return (<div>
      {funcPageOpen && (<div className={maincss_module_css_1.default.funcPageWrapper} onClick={() => setFuncPageOpen(false)} style={{
                overflowX: "hidden",
                overflowY: "hidden",
            }}>
          <div className={maincss_module_css_1.default.funcModalBody} style={{
                overflowX: "hidden",
                overflowY: "hidden",
            }} onClick={(e) => e.stopPropagation()}>
            <div className={maincss_module_css_1.default.funcModalTitleContainer}>
              <div className={maincss_module_css_1.default.funcModalTitle}>{name}</div>
              <div className={maincss_module_css_1.default.funcModalSubtitle}>
                Transactions Found:
              </div>
              <div className={maincss_module_css_1.default.funcModalSubtitle}>{txnsAmount}</div>
            </div>{" "}
            <div className={maincss_module_css_1.default.funcModalFlowsTitle}>ERC20 Flows:</div>
            <div className={maincss_module_css_1.default.funcModalFlowsTable}>
              <div className={maincss_module_css_1.default.funcModalFlowRow}>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{ gap: "2.5vh" }}>
                  <div style={{ textDecoration: "underline" }}>Token:</div>

                  {flows.map((flow) => {
                return (<div className={maincss_module_css_1.default.funcModalColumContainer}>
                        {flow.token_details.logo == ("" || null) ? (<img src="/unknowntoken.svg" alt="" style={{
                            borderRadius: "50%",
                            width: "3vw",
                        }}/>) : (<img src={flow.token_details.logo} alt="" style={{
                            borderRadius: "50%",
                            width: "3vw",
                        }}/>)}

                        <div className={maincss_module_css_1.default.flowsColumnText}>
                          {flow.token_details.name}
                        </div>
                      </div>);
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn}>
                  <div style={{
                textDecoration: "underline",
            }}>
                    Address:
                  </div>
                  {flows.map((flow) => {
                return (<framer_motion_1.motion.div style={{
                        overflow: "hidden",
                        width: "10vw",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                    }} whileHover={{
                        textDecoration: "underline",
                    }} title={flow.token_details.address} onClick={() => {
                        navigator.clipboard.writeText(flow.token_details.address);
                    }}>
                        {flow.token_details.address}
                      </framer_motion_1.motion.div>);
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn}>
                  <div style={{
                textDecoration: "underline",
            }}>
                    Out/Inflow:
                  </div>
                  {flows.map((flow) => {
                return (<div className={maincss_module_css_1.default.flowsColumnText} style={{
                        color: flow.outflow0_or_inflow1 === 1
                            ? "rgb(0, 211, 60)"
                            : "red",
                    }}>
                        {flow.outflow0_or_inflow1 === 1 ? "Inflow" : "Outflow"}
                      </div>);
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn}>
                  {" "}
                  <div style={{
                textDecoration: "underline",
            }}>
                    Markets:
                  </div>
                  {flows.map((flow) => {
                return (<div>
                        {flow.token_details.markets.length > 0
                        ? flow.token_details.markets.filter((market, index) => {
                            return (flow.token_details.markets.indexOf(market) ===
                                index);
                        })
                        : ["N/A"]}
                      </div>);
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn}>
                  <div style={{
                textDecoration: "underline",
            }}>
                    % Of Txns:
                  </div>
                  {flows.map((flow) => {
                return <div>{flow.percentageOfFuncTxns.toFixed(0)}%</div>;
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{
                gap: "4.3vh",
            }}>
                  <div style={{
                textDecoration: "underline",
            }}>
                    Include:
                  </div>
                  {flows.map((flow, index) => {
                return (<Checkbox_1.Checkbox choiceHandler={handleFlowChoice} style={{
                        width: "2vw",
                        height: "2vw",
                        marginLeft: "1.5vw",
                    }} argsToInclude={[index]} checked={isFlowChecked(flow)}/>);
            })}
                </div>
              </div>
            </div>
            <div className={maincss_module_css_1.default.funcModalFlowsTitle}>Arguments: </div>
            <div className={maincss_module_css_1.default.funcModalFlowsTable}>
              <div className={maincss_module_css_1.default.funcModalFlowRow}>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{ gap: "2.5vh" }}>
                  <div style={{ textDecoration: "underline" }}>Index:</div>

                  {args.map((arg, index) => {
                return <div>{arg.tempId}</div>;
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{ gap: "2.5vh" }}>
                  <div style={{ textDecoration: "underline" }}>Name:</div>

                  {args.map((arg) => {
                return <div>{arg.name}</div>;
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{ gap: "2.5vh" }}>
                  <div style={{ textDecoration: "underline" }}>Value:</div>

                  {args.map((arg, index) => {
                return (<TextInput_1.TextInput onChange={handleArgumentValueChange} changeArgs={[index]} style={{
                        width: "20vw",
                        height: "1.3vh",
                        fontSize: "1.2vw",
                        padding: "1.1vw",
                    }} value={arg.value}/>);
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{ gap: "2.5vh" }}>
                  <div style={{ textDecoration: "underline" }}>Type:</div>

                  {args.map((arg) => {
                return <div>{arg.type}</div>;
            })}
                </div>
                <div className={maincss_module_css_1.default.funcModalFlowColumn} style={{ gap: "2.5vh" }}>
                  <div style={{ textDecoration: "underline" }}>Group ID:</div>

                  {args.map((arg, index) => {
                return (<TextInput_1.TextInput onChange={handleArgumentGroupIdChange} changeArgs={[index]} style={{
                        width: "20vw",
                        height: "1.3vh",
                        fontSize: "1.2vw",
                        padding: "1.1vw",
                    }} value={arg.tempId}/>);
            })}
                </div>
              </div>
            </div>
          </div>{" "}
        </div>)}
      <div className={maincss_module_css_1.default.functionsTableRow} style={{ border: "1px solid transparent", gap: "0px" }}>
        <div className={maincss_module_css_1.default.functionsTableColumn} style={{ width: "8%", marginRight: "5.5vw" }}>
          {tempId}
        </div>
        <framer_motion_1.motion.div className={maincss_module_css_1.default.functionsTableColumn} style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginRight: "2vw",
            width: "20%",
            cursor: "pointer",
        }} whileHover={{
            textDecoration: "underline",
            color: "rgb(0, 0, 0, 0.75)",
        }} transition={{ duration: 0.2 }} onClick={() => setFuncPageOpen(!funcPageOpen)}>
          {name}
        </framer_motion_1.motion.div>
        <DropdownInput_1.default options={otherFuncIds.map((_funcId) => {
            return {
                label: _funcId.toString(),
                data: _funcId,
            };
        })} choiceHandler={setCounterFuncId} style={{
            width: "10vw",
            height: "4vh",
            marginRight: "4.5vw",
        }} textStyle={{ fontSize: "1.4vw" }} itemStyle={{ fontSize: "1.2vw", height: "max-content" }} dropdownStyle={{
            height: "20vh",
            width: "10vw",
            marginLeft: "-1.2vw",
            gap: "0px",
        }} placeholder={{
            label: "null",
        }}/>
        <DropdownInput_1.default options={otherFuncIds.map((_funcId) => {
            return {
                label: _funcId.toString(),
                data: _funcId,
            };
        })} choiceHandler={setUnlockedByFuncId} style={{
            width: "10vw",
            height: "4vh",
            marginRight: "5vw",
        }} textStyle={{ fontSize: "1.4vw" }} itemStyle={{ fontSize: "1.2vw", height: "max-content" }} dropdownStyle={{
            height: "20vh",
            width: "10vw",
            gap: "0px",
        }} placeholder={{
            label: "null",
        }}/>
        <DropdownInput_1.default options={actions.map((action) => {
            return {
                label: action.name,
                data: action.action_identifier,
            };
        })} choiceHandler={setAction} style={{
            width: "10vw",
            height: "4vh",
            marginLeft: "0.2vw",
        }} placeholder={{
            label: "null",
        }} textStyle={{ fontSize: "1vw" }} itemStyle={{ fontSize: "1.2vw", height: "max-content" }} dropdownStyle={{
            height: "20vh",
            width: "10vw",
            marginLeft: "0.2vw",
            gap: "0px",
        }}/>
        <Checkbox_1.Checkbox choiceHandler={setChosen}/>
        <framer_motion_1.motion.img src="trashcan.png" alt="" style={{
            width: "1.5vw",
            marginLeft: "3vw",
            marginBottom: "0.5vh",
            cursor: "pointer",
        }} whileHover={{
            scale: 1.1,
        }} onClick={() => removalHandler(index)}/>
      </div>
    </div>);
};
exports.FunctionTableRow = FunctionTableRow;
//# sourceMappingURL=FunctionRow.js.map