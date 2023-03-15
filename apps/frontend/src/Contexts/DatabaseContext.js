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
exports.StrategyContextProvider = exports.StrategyContext = exports.DatabaseContext = void 0;
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const Erc20abi = __importStar(require("../ABIs/erc20abi.json"));
const BaseStratABI = __importStar(require("../ABIs/BaseStratABI.json"));
const ethers_1 = require("ethers");
const d3_hierarchy_1 = require("d3-hierarchy");
const utils_1 = require("../utils/utils");
const Enums_1 = require("StrategyBuilder/Enums");
const Dump_1 = require("./Dump");
const ethereum = window.ethereum;
exports.DatabaseContext = (0, react_1.createContext)({});
exports.StrategyContext = (0, react_1.createContext)({});
const DatabaseContextProvider = (props) => {
    const getAccounts = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];
            return account;
        }
    };
    const getCurrentChain = async () => {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });
            return chainId;
        }
    };
    const [fullProtocolsNetworksList, setFullProtocolsNetworksList] = (0, react_1.useState)(undefined);
    const [fullTokensList, setFullTokensList] = (0, react_1.useState)(undefined);
    const [fullStrategiesList, setFullStrategiesList] = (0, react_1.useState)(undefined);
    const [fullNetworksList, setFullNetworksList] = (0, react_1.useState)(undefined);
    const [protocolsAddressesList, setprotocolsAddressesList] = (0, react_1.useState)(undefined);
    const [fullProtocolsList, setFullProtocolsList] = (0, react_1.useState)(undefined);
    const [fullAddressesList, setFulladdressesList] = (0, react_1.useState)(undefined);
    const [fullFunctionsList, setFullFunctionsList] = (0, react_1.useState)(undefined);
    const [fullActionsList, setFullActionsList] = (0, react_1.useState)([undefined]);
    const [fullParametersList, setFullParametersList] = (0, react_1.useState)(undefined);
    /**
     * @StrategyBuilder - Specific Context. Things like Information
     * About Different Actions (The Protocols, Functions That Include A Certain
     * Action, For Instance)
     */
    const [actionsFunctions, setActionsFunctions] = (0, react_1.useState)(undefined);
    const [actionsProtocols, setActionsProtocols] = (0, react_1.useState)(new Map());
    const [accountAddress, setAccountAddress] = (0, react_1.useState)("");
    const [currentChainId, setCurrentChainId] = (0, react_1.useState)(1);
    const [baseStrategyABI, setBaseStrategyABI] = (0, react_1.useState)([]);
    const [erc20ABI, setErc20ABI] = (0, react_1.useState)([]);
    const [provider, setProvider] = (0, react_1.useState)(undefined);
    const [signer, setSigner] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        (async () => {
            let baseurl = "https://api.yieldchain.io/";
            const [protocolsNetworks, protocols, addresses, strategies, tokens, networks, protocolsAddresses, functions, actions, parameters,] = await axios_1.default.all([
                axios_1.default.get("https://api.yieldchain.io/protocols-networks"),
                axios_1.default.get(`${baseurl}protocols`),
                axios_1.default.get(`${baseurl}addresses`),
                axios_1.default.get(`${baseurl}strategies`),
                axios_1.default.get(`${baseurl}tokens`),
                axios_1.default.get(`${baseurl}networks`),
                axios_1.default.get(`${baseurl}protocols-addresses`),
                axios_1.default.get(`${baseurl}functions`),
                axios_1.default.get(`${baseurl}actions`),
                axios_1.default.get(`${baseurl}parameters`),
            ]);
            setFullProtocolsList(protocols.data.protocols);
            setFulladdressesList(addresses.data.addresses);
            setFullStrategiesList(strategies.data.strategies);
            setFullNetworksList(networks.data.networks);
            setFullTokensList(tokens.data.tokens);
            setFullProtocolsNetworksList(["Banananananan"]);
            setprotocolsAddressesList(protocolsAddresses.data.protocols_addresses);
            setFullFunctionsList(functions.data.functions);
            setFullParametersList(parameters.data.parameters);
            setFullActionsList(actions.data.actions);
            // setAccountAddress(await getAccounts());
            setCurrentChainId(await getCurrentChain());
            setBaseStrategyABI(BaseStratABI);
            setProvider(new ethers_1.ethers.providers.Web3Provider(window.ethereum));
            setErc20ABI(Erc20abi);
            setSigner(new ethers_1.ethers.providers.Web3Provider(window.ethereum).getSigner());
            /**
             * @ActionsInfos - A Map That Maps Action Identifiers To All
             * Of Their Functions, Their Protocols, Etc.
             */
            let tempActionsFunctionsMapping = new Map();
            let tempActionsProtocolsMapping = new Map(actionsProtocols);
            for await (const action of actions.data.actions) {
                let actionFunctions = await (await axios_1.default.get(`${baseurl}actions/${action.name.toLowerCase().split(" ").join("")}`)).data.actionTable;
                let mappedActionFunctions = actionFunctions
                    .map((func) => {
                    if (!!func || !!func.function_identifier)
                        return;
                    try {
                        return (0, utils_1.getFunctionFullDetails)(func.function_identifier);
                    }
                    catch (e) {
                        return;
                    }
                })
                    .filter((func) => !!func);
                await Promise.all(mappedActionFunctions).then((promises) => {
                    promises = promises.filter((func) => !!func);
                    tempActionsFunctionsMapping.set(action.action_identifier, promises);
                });
                let actionAddresses = await Promise.all(addresses.data.addresses.filter((address) => {
                    for (const func of actionFunctions) {
                        if (address.functions.includes(func.function_identifier)) {
                            return true;
                        }
                    }
                }));
                let actionProtocols = await Promise.all(protocols.data.protocols.filter((protocol) => {
                    for (const pair of protocolsAddresses.data.protocols_addresses) {
                        if (pair.protocol_identifier == protocol.protocol_identifier &&
                            actionAddresses.find((address) => address.address_identifier == pair.address_identifier)) {
                            return true;
                        }
                    }
                }));
                tempActionsProtocolsMapping.set(action.action_identifier, actionProtocols);
            }
            setActionsFunctions(tempActionsFunctionsMapping);
            setActionsProtocols(tempActionsProtocolsMapping);
        })();
        return () => {
            // this now gets called when the component unmounts
        };
    }, []);
    return (<exports.DatabaseContext.Provider value={{
            fullProtocolsList,
            fullAddressesList,
            fullTokensList,
            fullNetworksList,
            fullStrategiesList,
            fullProtocolsNetworksList,
            fullActionsList,
            protocolsAddressesList,
            accountAddress,
            setAccountAddress,
            baseStrategyABI,
            erc20ABI,
            provider,
            signer,
            actionsFunctions,
            actionsProtocols,
            fullParametersList,
            fullFunctionsList,
        }}>
      {props.children}{" "}
    </exports.DatabaseContext.Provider>);
};
const StrategyContextProvider = (props) => {
    const { fullFunctionsList } = (0, react_1.useContext)(exports.DatabaseContext);
    /**
     * @enum The Steps Of The Strategy Creation Process, Used To Keep Track Of The User's Progress And Render
     * The Correct Components Accordingly
     */
    let StrategyProcessSteps;
    (function (StrategyProcessSteps) {
        StrategyProcessSteps[StrategyProcessSteps["NOT_ENTERED"] = 0] = "NOT_ENTERED";
        StrategyProcessSteps[StrategyProcessSteps["INITIALLIZING"] = 1] = "INITIALLIZING";
        StrategyProcessSteps[StrategyProcessSteps["CHOOSING_BASE_STEPS"] = 2] = "CHOOSING_BASE_STEPS";
        StrategyProcessSteps[StrategyProcessSteps["CHOOSING_INTERVAL"] = 3] = "CHOOSING_INTERVAL";
        StrategyProcessSteps[StrategyProcessSteps["ASSEMBLING_STRATEGY"] = 4] = "ASSEMBLING_STRATEGY";
        StrategyProcessSteps[StrategyProcessSteps["FINALLIZING_STRATEGY"] = 5] = "FINALLIZING_STRATEGY";
        StrategyProcessSteps[StrategyProcessSteps["DEPLOYED_STRATEGY"] = 6] = "DEPLOYED_STRATEGY";
    })(StrategyProcessSteps || (StrategyProcessSteps = {}));
    /**
     * @states
     */
    const [strategyName, setStrategyName] = (0, react_1.useState)(undefined);
    const [executionInterval, setExecutionInterval] = (0, react_1.useState)(undefined);
    const [baseSteps, setBaseSteps] = (0, react_1.useState)([]);
    const [strategySteps, setStrategySteps] = (0, react_1.useState)([]);
    const [depositToken, setDepositToken] = (0, react_1.useState)(undefined);
    const [strategyProcessLocation, setStrategyProcessLocation] = (0, react_1.useState)(StrategyProcessSteps.NOT_ENTERED);
    const [strategyNetworks, setStrategyNetworks] = (0, react_1.useState)([
        {
            chain_id: "56",
            name: "BNB Chain",
            logo: "https://static.debank.com/image/bsc_token/logo_url/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82/9003539eb61139bd494b7412b785d482.png",
            rpc_url: "https://bsc-dataseed.binance.org/",
            explorer_url: "https://bscscan.com/",
            chain_id_hex: "0x38",
            automation_address: "0x8570914708b9800d00252d921417f5e29895f62b",
        },
    ]);
    const [actionableTokens, setActionableTokens] = (0, react_1.useState)([]);
    const [quickAddActions, setQuickAddActions] = (0, react_1.useState)([]);
    const [showTokenModal, setShowTokenModal] = (0, react_1.useState)(false);
    const [showPercentageBox, setShowPercentageBox] = (0, react_1.useState)(false);
    const [unusedBaseBalance, setUnusedBaseBalance] = (0, react_1.useState)(100);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [d3StrategyHirarchy, setD3StrategyHirarchy] = (0, react_1.useState)([]);
    const [d3StrategyHirarchySizing, setD3StrategyHirarchySizing] = (0, react_1.useState)({
        width: {
            integer: window.innerWidth,
            unit: "px",
        },
        height: {
            integer: window.innerHeight,
            unit: "px",
        },
    });
    // Keeps Track Of The Current Size Of Each Node Using Refs
    const nodeRefs = (0, react_1.useRef)(new Array());
    /**
     * @Handler Handles Base Step Added
     */
    const layoutNodes = () => {
        const sortStepsArr = (arr, removeEmpties) => {
            let sortedArr = [...arr].filter((step) => {
                return !!step;
            });
            sortedArr = sortedArr.sort((a, b) => {
                return a.step_identifier - b.step_identifier;
            });
            let oldToNewIDsMapping = new Map();
            if (removeEmpties) {
                sortedArr.forEach((step, index) => {
                    if (step.empty && step.empty == true) {
                        sortedArr.splice(index, 1);
                    }
                });
            }
            sortedArr = sortedArr.map((step, index) => {
                oldToNewIDsMapping.set(step.step_identifier, index);
                let newObj = { ...step };
                let newParentId = oldToNewIDsMapping.get(newObj.parent_step_identifier);
                newObj.step_identifier = index;
                newObj.parent_step_identifier = newParentId
                    ? newParentId
                    : newObj.parent_step_identifier;
                return newObj;
            });
            return sortedArr;
        };
        let stepsTorender = sortStepsArr([...strategySteps], false);
        for (let i = 0; i < stepsTorender.length; i++) {
            let step = stepsTorender[i];
            if (step.type === Enums_1.NodeStepEnum.PLACEHOLDER) {
                continue;
            }
            let doesHaveChildren = stepsTorender.find((_step) => {
                let shouldReturn = _step.parent_step_identifier === step.step_identifier &&
                    _step.type !== Enums_1.NodeStepEnum.PLACEHOLDER;
                return shouldReturn;
            });
            let isCompleteStep = step.type !== Enums_1.NodeStepEnum.PLACEHOLDER &&
                step.type !== Enums_1.NodeStepEnum.CHOOSE_ACTION &&
                step.type !== Enums_1.NodeStepEnum.CONFIG_ACTION;
            if (!doesHaveChildren) {
                let arrToSplice = [];
                let currentStepHeight = step.height;
                let basePlaceholderHeight = 96;
                let latestId = step.step_identifier;
                while (currentStepHeight >= basePlaceholderHeight) {
                    stepsTorender.splice(i + 1, 0, {
                        step_identifier: stepsTorender.length,
                        parent_step_identifier: latestId,
                        type: Enums_1.NodeStepEnum.PLACEHOLDER,
                        function_identifiers: [],
                        width: 327,
                        height: 96,
                        empty: isCompleteStep ? false : true,
                    });
                    latestId = stepsTorender[i + 1].step_identifier;
                    currentStepHeight -= basePlaceholderHeight;
                }
            }
        }
        let hierarchy = (0, d3_hierarchy_1.stratify)()
            .id((d) => d.step_identifier)
            .parentId((d) => d.parent_step_identifier)(sortStepsArr(stepsTorender, false));
        let totalWidth = 0;
        let totalHeight = 0;
        let floorToHeight = new Map();
        let tallestArr = [];
        for (const node of hierarchy.descendants()) {
            let depth = node.depth;
            floorToHeight.get(depth)
                ? floorToHeight.set(depth, [...floorToHeight.get(depth), node])
                : floorToHeight.set(depth, [node]);
        }
        for (const [key, value] of floorToHeight) {
            let tallestNode = value.reduce((prev, current) => {
                return prev.data.height > current.data.height ? prev : current;
            });
            tallestArr.push(tallestNode);
        }
        let layout = (0, d3_hierarchy_1.tree)()
            .nodeSize([1, 190])
            .separation((a, b) => {
            let baseWidth = a.data.width + b.data.width;
            let siblingsArrSymmetric = a.parent.children.length % 2 == 0;
            baseWidth ? (baseWidth = baseWidth / 2 + 30) : (baseWidth = 357);
            if (siblingsArrSymmetric &&
                a.parent.children.findIndex((d) => d.id == a.id) ==
                    a.parent.children.length / 2) {
                baseWidth += a.parent.data.width - 30;
            }
            return baseWidth;
        });
        // TODO: This Flextree thing was supposed to be able to receive dynamic node sizing,
        // TODO: However, it was breaking the app (Simply froze it when horizontal children
        // TODO: were added...), would be great if i can use it sometime.
        // let layout = flextree({
        //   children: (d: any) => d.children,
        //   nodeSize: (d: any) => [d.data.width, d.data.height * 2],
        //   spacing: (a: any, b: any) => {
        //     let _totalWidth = a.data.width + b.data.width;
        //     return _totalWidth + 30;
        //   },
        // });
        hierarchy.each((d, index) => {
            isNaN(d.data.width)
                ? (d.data.width = 327)
                : (d.data.width = d.data.width);
            isNaN(d.data.height)
                ? (d.data.height = 96)
                : (d.data.height = d.data.height);
        });
        let root = layout(hierarchy);
        let { width, nodesNum, height } = (0, Dump_1.DetermineWidth)(root);
        setD3StrategyHirarchySizing({
            width: {
                integer: width,
                unit: "px",
            },
            nodesNum: nodesNum,
            height: {
                integer: height,
                unit: "px",
            },
        });
        return root.descendants().map((d3Step) => {
            return {
                ...d3Step.data,
                position: { x: d3Step.x, y: d3Step.y },
                children: d3Step.children,
            };
        });
    };
    (0, react_1.useEffect)(() => {
        if (strategySteps.length > 1) {
            setD3StrategyHirarchy(layoutNodes());
        }
    }, [strategySteps]);
    const handleBaseStepAdd = async (baseStep, percentage, additional_args) => {
        let { actionName, action_outflows, action_inflows, function_identifier, address_identifier, protocol_identifier, protocolDetails, } = baseStep;
        let tempBaseSteps = [...baseSteps];
        let tempSteps = [...strategySteps];
        let tempActionableTokens = [...actionableTokens];
        let step = {
            type: actionName,
            divisor: await (0, utils_1.calcDivisor)(percentage),
            function_identifiers: [function_identifier],
            address_identifiers: [address_identifier],
            protocol_identifier: protocol_identifier,
            protocol_details: protocolDetails,
            additional_args: additional_args ? additional_args : [],
            flows_identifiers: action_outflows
                .concat(action_inflows)
                .map((flow) => flow.flow_identifier),
            step_identifier: tempSteps.length + 1,
            parent_step_identifier: tempSteps.length,
            outflows: action_outflows,
            inflows: action_inflows,
            percentage: percentage,
            width: 327,
            height: 96,
        };
        let newQuickAddActions = fullFunctionsList.filter((func) => {
            return func.unlocked_by == function_identifier;
        });
        newQuickAddActions = [
            ...(await newQuickAddActions
                .filter((func) => !!func)
                .map(async (func) => {
                let fullFuncDetails = await (0, utils_1.getFunctionFullDetails)(func.function_identifier);
                return {
                    quickAddAction: fullFuncDetails,
                    originStep: step,
                };
            })),
        ];
        newQuickAddActions = await Promise.all(newQuickAddActions);
        console.log("Neq quick add actions!!!", newQuickAddActions);
        tempBaseSteps.push(step);
        tempSteps.push({
            type: "tokens",
            tokens: action_outflows.map((flow) => flow.token_details),
            step_identifier: tempSteps.length,
            parent_step_identifier: tempSteps.find((step) => step.type == "swapcomponent").step_identifier,
            width: 64 * action_outflows.length,
            height: 64,
        });
        tempSteps.push(step);
        tempActionableTokens.push(...[...action_inflows.map((inflow) => inflow.token_details)]);
        setBaseSteps(tempBaseSteps);
        setStrategySteps(tempSteps);
        setActionableTokens(tempActionableTokens);
        setShowPercentageBox(false);
        setUnusedBaseBalance(unusedBaseBalance - percentage);
        setQuickAddActions((prev) => prev.length ? prev.concat(newQuickAddActions) : newQuickAddActions);
    };
    // Updating the strategy steps once when the deposit token is selected,
    // Ensuring the deposit token & "Multi Swap" component are visible
    // and are the highest in the hirarchy.
    const { fullNetworksList } = (0, react_1.useContext)(exports.DatabaseContext);
    const updateStrategiesNetwork = async () => {
        let depositTokenChainId = depositToken.chain_id;
        let depositTokenNetwork = fullNetworksList.find((network) => network.chain_id == depositTokenChainId);
        let alreadyHas = strategyNetworks.find((network) => network.chain_id == depositTokenChainId);
        let newArr = [...strategyNetworks];
        if (!alreadyHas)
            newArr.push(depositTokenNetwork);
        setStrategyNetworks(newArr);
    };
    (0, react_1.useEffect)(() => {
        if (depositToken) {
            updateStrategiesNetwork();
            if (strategySteps.length > 0) {
                return;
            }
            let tempStratSteps = [...strategySteps];
            tempStratSteps.push({
                type: "deposittoken",
                token: depositToken,
                step_identifier: 0,
                parent_step_identifier: "",
                width: 90,
                height: 90,
            });
            tempStratSteps.push({
                type: "swapcomponent",
                step_identifier: 1,
                parent_step_identifier: 0,
                width: 188,
                height: 56,
            });
            setStrategySteps(tempStratSteps);
        }
    }, [depositToken]);
    return (<exports.StrategyContext.Provider value={{
            strategyName,
            setStrategyName,
            executionInterval,
            setExecutionInterval,
            baseSteps,
            setBaseSteps,
            strategySteps,
            setStrategySteps,
            depositToken,
            setDepositToken,
            strategyProcessLocation,
            setStrategyProcessLocation,
            StrategyProcessSteps,
            showPercentageBox,
            setShowPercentageBox,
            handleBaseStepAdd,
            unusedBaseBalance,
            setUnusedBaseBalance,
            isModalOpen,
            setIsModalOpen,
            actionableTokens,
            setActionableTokens,
            quickAddActions,
            setQuickAddActions,
            d3StrategyHirarchy,
            setD3StrategyHirarchy,
            nodeRefs,
            d3StrategyHirarchySizing,
            strategyNetworks,
            showTokenModal,
            setShowTokenModal,
        }}>
      {props.children}{" "}
    </exports.StrategyContext.Provider>);
};
exports.StrategyContextProvider = StrategyContextProvider;
exports.default = DatabaseContextProvider;
//# sourceMappingURL=DatabaseContext.js.map