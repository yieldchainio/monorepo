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
exports.ConfirmStrategy = void 0;
const react_1 = __importStar(require("react"));
const strategyBuilder_module_css_1 = __importDefault(require("../css/strategyBuilder.module.css"));
const DatabaseContext_1 = require("../Contexts/DatabaseContext");
const utils_1 = require("utils/utils");
const framer_motion_1 = require("framer-motion");
const axios_1 = __importDefault(require("axios"));
const ethers = __importStar(require("ethers"));
const Dump_1 = require("../Contexts/Dump");
const Enums_1 = require("./Enums");
const ConfirmStrategy = (props) => {
    const { strategySteps, setStrategySteps, strategyName, executionInterval, baseSteps, depositToken, strategyNetworks, } = (0, react_1.useContext)(DatabaseContext_1.StrategyContext);
    const { signer, provider, chainId, account } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const { modalHandler } = props;
    const [description, setDescription] = (0, react_1.useState)("None");
    const [strategy_steps, setStrategy_steps] = (0, react_1.useState)([]);
    const [base_strategy_steps, setBaseStrategySteps] = (0, react_1.useState)([]);
    const generateStrategyDescription = () => {
        let description = "";
        for (const step of strategy_steps) {
            let stepActionName = (0, utils_1.toTitleCase)(step.type);
            let stepOutflows = step.outflows.map((outflow, index) => index > 0 ? ", " : "" + (0, utils_1.toTitleCase)(outflow.token_details.symbol));
            let stepProtocol = (0, utils_1.toTitleCase)(step.protocol_details.name);
            let stepInflows = step.inflows.map((inflow, index) => index > 0 ? ", " : "" + (0, utils_1.toTitleCase)(inflow.token_details.symbol));
            if (stepOutflows.length > 0 && stepInflows.length > 0) {
                description += `${stepActionName} ${stepOutflows.join(" ")} on ${stepProtocol}, ${stepInflows.join(" ").length > 2 ? "get" + stepInflows.join(" ") : ""}. `;
            }
            else if (stepOutflows.length > 0) {
                description += `${stepActionName} ${stepOutflows.join(" ")} on ${stepProtocol} `;
            }
            else if (stepInflows.length > 0) {
                description += `${stepActionName} ${stepInflows.join(" ")} on ${stepProtocol} `;
            }
            else {
                description += `${stepActionName} on ${stepProtocol} `;
            }
        }
        return description;
    };
    (0, react_1.useEffect)(() => {
        setDescription(generateStrategyDescription());
    }, [strategy_steps]);
    (0, react_1.useEffect)(() => {
        let tArr = [...strategySteps];
        let bTArr = [...baseSteps];
        tArr = (0, Dump_1.sortStepsArr)(tArr.filter((step) => step.type !== "deposittoken" &&
            step.type !== "tokens" &&
            step.type !== "swapcomponent" &&
            step.type !== Enums_1.NodeStepEnum.CHOOSE_ACTION), false);
        bTArr = (0, Dump_1.sortStepsArr)(bTArr.filter((step) => step.type !== "deposittoken" &&
            step.type !== "tokens" &&
            step.type !== "swapcomponent" &&
            step.type !== Enums_1.NodeStepEnum.CHOOSE_ACTION), false);
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
        let contractData = await axios_1.default.post("https://builderapi.yieldchain.io/create-strategy", {
            strategyObject: strategyObject,
        });
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
        let addingStrategy = await axios_1.default.post("https://builderapi.yieldchain.io/add-strategy", {
            strategyObject: strategyObjectToAdd,
        });
        console.log("Adding strategy", addingStrategy);
        console.log(stratContract.address, "Strat contract");
    };
    return (<div className={strategyBuilder_module_css_1.default.deployStrategyBlurWrapper} onClick={() => modalHandler(false)}>
      <div className={strategyBuilder_module_css_1.default.deployStrategyContainer} style={{ zIndex: "9999999999999999999999" }} onClick={(e) => e.stopPropagation()}>
        <div className={strategyBuilder_module_css_1.default.deployStrategyTitle}>Confirm Strategy</div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyDescription}>{description}</div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyApyTitle}>APY / APR</div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyApyContainer}>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexRowContainer}>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyOffText}>New APY</div>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyColorfulText}>220%</div>
          </div>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexDivisorLine}></div>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexRowContainer} style={{ marginTop: "8px" }}>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyOffText}>Old APR</div>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyOnText}>31%</div>
          </div>
        </div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyApyTitle}>Token Details</div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyApyContainer}>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexRowContainer}>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyOffText}>Deposit Token</div>
            <div className={strategyBuilder_module_css_1.default.deployStrategyTokenContainer}>
              <div className={strategyBuilder_module_css_1.default.deployStrategyApyOnText}>CAKE</div>
              <img className={strategyBuilder_module_css_1.default.deployStrategyTokenIcon} alt="" src="/cake.svg"/>
            </div>
          </div>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexDivisorLine}></div>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexRowContainer} style={{ marginTop: "8px" }}>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyOffText}>Reward Token</div>
            <div className={strategyBuilder_module_css_1.default.deployStrategyTokenContainer}>
              <div className={strategyBuilder_module_css_1.default.deployStrategyApyOnText}>BNB</div>
              <img className={strategyBuilder_module_css_1.default.deployStrategyTokenIcon} alt="" src="/cake.svg"/>
            </div>
          </div>
        </div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyApyTitle}>Gas Fees</div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyApyContainer}>
          <div className={strategyBuilder_module_css_1.default.deployStrategyFlexRowContainer}>
            <div className={strategyBuilder_module_css_1.default.deployStrategyApyOffText}>
              Gas Fee Per Run
            </div>
            <div className={strategyBuilder_module_css_1.default.deployStrategyTokenContainer}>
              <div className={strategyBuilder_module_css_1.default.deployStrategyApyOnText}>2.21$</div>
              <img className={strategyBuilder_module_css_1.default.deployStrategyTokenIcon} alt="" src="/graywarningsign.svg"/>
            </div>
          </div>
        </div>
        <div className={strategyBuilder_module_css_1.default.deployStrategyButtonsContainer}>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.deployStrategyCancelButton} whileHover={{ scale: 1.05 }} onClick={() => modalHandler(false)}>
            Cancel
          </framer_motion_1.motion.div>
          <framer_motion_1.motion.div className={strategyBuilder_module_css_1.default.deployStrategyDeployButton} whileHover={{ scale: 1.05 }} onClick={() => getDeploymentData()}>
            Deploy Now
          </framer_motion_1.motion.div>
        </div>
      </div>
    </div>);
};
exports.ConfirmStrategy = ConfirmStrategy;
//# sourceMappingURL=ConfirmStrategy.js.map