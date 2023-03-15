"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsTable = void 0;
const react_1 = __importStar(require("react"));
const protocolpools_module_css_1 = __importDefault(require("./css/protocolpools.module.css"));
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const utils_1 = require("utils/utils");
const utils_2 = require("utils/utils");
var ActionTypes;
(function (ActionTypes) {
    ActionTypes[ActionTypes["STAKE"] = 0] = "STAKE";
    ActionTypes[ActionTypes["HARVEST"] = 1] = "HARVEST";
    ActionTypes[ActionTypes["SWAP"] = 2] = "SWAP";
    ActionTypes[ActionTypes["ADDLIQ"] = 3] = "ADDLIQ";
    ActionTypes[ActionTypes["LPZAP"] = 4] = "LPZAP";
    ActionTypes[ActionTypes["CROSSCHAINSWAP"] = 5] = "CROSSCHAINSWAP";
})(ActionTypes || (ActionTypes = {}));
const PoolsTableRow = (props) => {
    /**
     * The Global Context For The Current Session's Strategy Base Steps
     */
    const { showPercentageBox, setShowPercentageBox } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    let navigate = (0, react_router_dom_1.useNavigate)();
    const actionName = props.actionDetails.name;
    const [action_outflows, setActionOutflows] = (0, react_1.useState)(undefined);
    const [action_inflows, setActionInflows] = (0, react_1.useState)(undefined);
    const [action_networkDetails, setActionNetworkDetails] = (0, react_1.useState)(undefined);
    const [action_unlockedActions, setActionUnlockedActions] = (0, react_1.useState)(undefined);
    const [action_address, setActionAddress] = (0, react_1.useState)(undefined);
    const [action_function, setActionFunction] = (0, react_1.useState)(undefined);
    const initData = async () => {
        try {
            let { protocol_identifier, function_identifier, action_identifier } = props.executeThis;
            setActionAddress(await (0, utils_1.getFunctionAddress)(function_identifier));
            let rowDetails = await (0, utils_1.getProtocolTableRowDetails)(protocol_identifier, function_identifier, action_identifier);
            let functionDetails = await (0, utils_2.getFunctionDetails)(props.executeThis.function_identifier);
            functionDetails.arguments = [
                ...(await functionDetails.arguments.map(async (arg) => {
                    let parameterDetails;
                    return await (0, utils_2.getParameterDetails)(arg).then((res) => {
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
        }
        catch (err) {
            console.log(err, "err");
        }
    };
    (0, react_1.useEffect)(() => {
        if (props.executeThis &&
            !action_outflows &&
            !action_inflows &&
            !action_networkDetails &&
            !action_unlockedActions) {
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
    if (action_outflows &&
        action_inflows &&
        action_networkDetails &&
        action_unlockedActions) {
        return (<div style={{ height: "88px" }} onClick={() => setShowPercentageBox(false)}>
        <div className={protocolpools_module_css_1.default.poolTableNameContainer}>
          <div className={protocolpools_module_css_1.default.poolsTableNameText}>{actionName}</div>
        </div>
        <div className={protocolpools_module_css_1.default.poolsTableNetworkContainer}>
          <img src={action_networkDetails.logo} alt="" className={protocolpools_module_css_1.default.poolsTableSingleImgStyle}/>
          <div className={protocolpools_module_css_1.default.poolsTableNetworkText}>
            {action_networkDetails.name}
          </div>
        </div>
        <div className={protocolpools_module_css_1.default.poolsTableTvlText}></div>
        <div className={protocolpools_module_css_1.default.outflowsContainer}>
          {action_outflows.length <= 0 ? (<div className={protocolpools_module_css_1.default.unlockedActionsText}>-</div>) : (action_outflows.map((outflow, index) => index <= 1 ? (<img src={outflow.token_details.logo} alt="" className={protocolpools_module_css_1.default.outflowImg} key={index} style={action_outflows[index + 1]
                    ? { border: "2px solid black", zIndex: 10 - index }
                    : {}}></img>) : index == action_outflows.length - 1 ? (<div className={protocolpools_module_css_1.default.outFlowsPlusText}>
                  +{action_outflows.length - 1}
                </div>) : (() => null)))}
          {action_outflows.length !== 1 ? (() => null) : (<div className={protocolpools_module_css_1.default.unlockedActionsText} style={{ left: "30px", top: "8px" }}>
              {action_outflows[0].token_details.symbol}
            </div>)}
        </div>
        <div className={protocolpools_module_css_1.default.inflowsContainer}>
          {action_inflows.length <= 0 ? (<div className={protocolpools_module_css_1.default.unlockedActionsText} style={{ left: "18px", top: "8px", fontSize: "32px" }}>
              -
            </div>) : (action_inflows.map((inflow, index) => index <= 1 ? (<img src={inflow.token_details.logo} alt="" className={protocolpools_module_css_1.default.inflowImg} key={index} style={action_inflows[index + 1]
                    ? { border: "2px solid black", zIndex: 10 - index }
                    : {}}></img>) : index == action_inflows.length - 1 ? (<div className={protocolpools_module_css_1.default.inFlowsPlusText}>
                  +{action_inflows.length - 1}
                </div>) : (() => null)))}
          {action_inflows.length !== 1 ? (() => null) : (<div className={protocolpools_module_css_1.default.unlockedActionsText} style={{ left: "34px", top: "8px" }}>
              {action_inflows[0].token_details.symbol}
            </div>)}
        </div>
        <div className={protocolpools_module_css_1.default.unlockedActionsText}>Harvest</div>
        <framer_motion_1.motion.button className={protocolpools_module_css_1.default.poolsTableActionBtn} whileHover={{
                scale: 1.05,
                background: "linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)) padding-box, linear-gradient(90deg,   rgba(0, 176, 235, 1) 0%,  rgba(217, 202, 15, 1) 100%) border-box",
                border: "1px solid transparent",
                color: "white",
            }} whileTap={{ scale: 0.95 }} onClick={(e) => {
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
                    additional_args: action_function.arguments.filter((arg) => arg.value.includes("abi.decode(current_custom_arguments[")),
                });
            }}>
          + Base Step
        </framer_motion_1.motion.button>
      </div>);
    }
    else {
        return <h1>Penis...</h1>;
    }
};
const PoolsTable = (props) => {
    const { fullProtocolsList, fullAddressesList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, protocolsAddressesList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const protocol_identifier = props.protocol_identifier;
    const { showPercentageBox, setShowPercentageBox } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const [rowsList, setRowsList] = (0, react_1.useState)(undefined);
    const [addressesList, setAddressesList] = (0, react_1.useState)(undefined);
    const initData = async () => {
        let actionFunctionsPairs = await (0, utils_1.findProtocolActions)(protocol_identifier);
        let correspondingAddresses = await setRowsList(actionFunctionsPairs);
    };
    (0, react_1.useEffect)(() => {
        if (protocol_identifier && !rowsList) {
            initData();
        }
        else {
        }
    }, [protocol_identifier]);
    if (rowsList) {
        return (<div>
        <div className={protocolpools_module_css_1.default.poolsTableTitle}>
          <div className={protocolpools_module_css_1.default.tableTitleText}>Action</div>
          <div className={protocolpools_module_css_1.default.tableTitleText}>Outflows</div>
          <div className={protocolpools_module_css_1.default.tableTitleText}>Inflows</div>
          <div className={protocolpools_module_css_1.default.tableTitleText}>Unlocked Actions</div>
          <div className={protocolpools_module_css_1.default.tableTitleText}>Network</div>
          <div className={protocolpools_module_css_1.default.tableTitleText}>Action</div>
        </div>
        <img src="/reddownarrow.svg" alt="" style={{
                height: "15px",
                width: "14px",
                position: "absolute",
                top: "516px",
                left: "415px",
            }}/>
        <img src="/greenuparrow.svg" alt="" style={{
                height: "13px",
                width: "11px",
                position: "absolute",
                top: "516px",
                left: "655px",
            }}/>

        <div className={protocolpools_module_css_1.default.poolsTable}>
          {rowsList.map((actionFunctionPair, index) => (<PoolsTableRow key={index} executeThis={{
                    protocol_identifier: parseInt(protocol_identifier),
                    function_identifier: actionFunctionPair.functionDetails.function_identifier,
                    action_identifier: actionFunctionPair.actionDetails.action_identifier,
                }} actionDetails={actionFunctionPair.actionDetails} showPercentageBox={showPercentageBox} protocolDetails={props.protocolDetails}></PoolsTableRow>))}
        </div>
      </div>);
    }
    else {
        return null;
    }
};
exports.PoolsTable = PoolsTable;
//# sourceMappingURL=poolsTable.js.map