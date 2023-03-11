import { createContext, useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { MetaMaskInpageProvider } from "@metamask/providers";
import * as Erc20abi from "../ABIs/erc20abi.json";
import * as BaseStratABI from "../ABIs/BaseStratABI.json";
import { ethers } from "ethers";
import { stratify, tree } from "d3-hierarchy";
import {
  getFunctionAddress,
  calcDivisor,
  getFunctionFullDetails,
  isNumSymmetric,
  getFunctionAction,
} from "../utils/utils";
import { NodeStepEnum } from "StrategyBuilder/Enums";
import { DetermineWidth } from "./Dump";
declare var window: any;
const ethereum = window.ethereum as MetaMaskInpageProvider;

export const DatabaseContext = createContext<any>({});
export const StrategyContext = createContext<any>({});

const DatabaseContextProvider = (props: any) => {
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

  const [fullProtocolsNetworksList, setFullProtocolsNetworksList] =
    useState<any>(undefined);
  const [fullTokensList, setFullTokensList] = useState<any>(undefined);
  const [fullStrategiesList, setFullStrategiesList] = useState<any>(undefined);
  const [fullNetworksList, setFullNetworksList] = useState<any>(undefined);
  const [protocolsAddressesList, setprotocolsAddressesList] =
    useState<any>(undefined);
  const [fullProtocolsList, setFullProtocolsList] = useState<any>(undefined);
  const [fullAddressesList, setFulladdressesList] = useState<any>(undefined);
  const [fullFunctionsList, setFullFunctionsList] = useState<any>(undefined);
  const [fullActionsList, setFullActionsList] = useState<any>([undefined]);
  const [fullParametersList, setFullParametersList] = useState<any>(undefined);

  /**
   * @StrategyBuilder - Specific Context. Things like Information
   * About Different Actions (The Protocols, Functions That Include A Certain
   * Action, For Instance)
   */

  const [actionsFunctions, setActionsFunctions] = useState<any>(undefined);
  const [actionsProtocols, setActionsProtocols] = useState<any>(new Map());

  const [accountAddress, setAccountAddress] = useState<any>("");
  const [currentChainId, setCurrentChainId] = useState<any>(1);
  const [baseStrategyABI, setBaseStrategyABI] = useState<any>([]);
  const [erc20ABI, setErc20ABI] = useState<any>([]);
  const [provider, setProvider] = useState<any>(undefined);
  const [signer, setSigner] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      let baseurl = "https://api.yieldchain.io/";

      const [
        protocolsNetworks,
        protocols,
        addresses,
        strategies,
        tokens,
        networks,
        protocolsAddresses,
        functions,
        actions,
        parameters,
      ] = await axios.all([
        axios.get("https://api.yieldchain.io/protocols-networks"),
        axios.get(`${baseurl}protocols`),
        axios.get(`${baseurl}addresses`),
        axios.get(`${baseurl}strategies`),
        axios.get(`${baseurl}tokens`),
        axios.get(`${baseurl}networks`),
        axios.get(`${baseurl}protocols-addresses`),
        axios.get(`${baseurl}functions`),
        axios.get(`${baseurl}actions`),
        axios.get(`${baseurl}parameters`),
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
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
      setErc20ABI(Erc20abi);
      setSigner(new ethers.providers.Web3Provider(window.ethereum).getSigner());

      /**
       * @ActionsInfos - A Map That Maps Action Identifiers To All
       * Of Their Functions, Their Protocols, Etc.
       */
      let tempActionsFunctionsMapping = new Map();
      let tempActionsProtocolsMapping = new Map(actionsProtocols);
      for await (const action of actions.data.actions) {
        let actionFunctions = await (
          await axios.get(
            `${baseurl}actions/${action.name.toLowerCase().split(" ").join("")}`
          )
        ).data.actionTable;
        let mappedActionFunctions = actionFunctions
          .map((func: any) => {
            if (!!func || !!func.function_identifier) return;
            try {
              return getFunctionFullDetails(func.function_identifier);
            } catch (e: any) {
              return;
            }
          })
          .filter((func: any) => !!func);
        await Promise.all(mappedActionFunctions).then((promises: any) => {
          promises = promises.filter((func: any) => !!func);
          tempActionsFunctionsMapping.set(action.action_identifier, promises);
        });

        let actionAddresses = await Promise.all(
          addresses.data.addresses.filter((address: any) => {
            for (const func of actionFunctions) {
              if (address.functions.includes(func.function_identifier)) {
                return true;
              }
            }
          })
        );

        let actionProtocols = await Promise.all(
          protocols.data.protocols.filter((protocol: any) => {
            for (const pair of protocolsAddresses.data.protocols_addresses) {
              if (
                pair.protocol_identifier == protocol.protocol_identifier &&
                actionAddresses.find(
                  (address: any) =>
                    address.address_identifier == pair.address_identifier
                )
              ) {
                return true;
              }
            }
          })
        );
        tempActionsProtocolsMapping.set(
          action.action_identifier,
          actionProtocols
        );
      }
      setActionsFunctions(tempActionsFunctionsMapping);
      setActionsProtocols(tempActionsProtocolsMapping);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
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
      }}
    >
      {props.children}{" "}
    </DatabaseContext.Provider>
  );
};

export const StrategyContextProvider = (props: any) => {
  const { fullFunctionsList } = useContext(DatabaseContext);
  /**
   * @enum The Steps Of The Strategy Creation Process, Used To Keep Track Of The User's Progress And Render
   * The Correct Components Accordingly
   */

  enum StrategyProcessSteps {
    NOT_ENTERED,
    INITIALLIZING,
    CHOOSING_BASE_STEPS,
    CHOOSING_INTERVAL,
    ASSEMBLING_STRATEGY,
    FINALLIZING_STRATEGY,
    DEPLOYED_STRATEGY,
  }

  /**
   * @states
   */
  const [strategyName, setStrategyName] = useState<any>(undefined);
  const [executionInterval, setExecutionInterval] = useState<any>(undefined);
  const [baseSteps, setBaseSteps] = useState<any>([]);
  const [strategySteps, setStrategySteps] = useState<any>([]);
  const [depositToken, setDepositToken] = useState<any>(undefined);
  const [strategyProcessLocation, setStrategyProcessLocation] =
    useState<StrategyProcessSteps>(StrategyProcessSteps.NOT_ENTERED);
  const [strategyNetworks, setStrategyNetworks] = useState<any>([
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
  const [actionableTokens, setActionableTokens] = useState<any>([]);
  const [quickAddActions, setQuickAddActions] = useState<any>([]);

  const [showTokenModal, setShowTokenModal] = useState<any>(false);

  const [showPercentageBox, setShowPercentageBox] = useState<any>(false);
  const [unusedBaseBalance, setUnusedBaseBalance] = useState<any>(100);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [d3StrategyHirarchy, setD3StrategyHirarchy] = useState<any>([]);
  const [d3StrategyHirarchySizing, setD3StrategyHirarchySizing] = useState<any>(
    {
      width: {
        integer: window.innerWidth,
        unit: "px",
      },
      height: {
        integer: window.innerHeight,
        unit: "px",
      },
    }
  );

  // Keeps Track Of The Current Size Of Each Node Using Refs
  const nodeRefs = useRef<any>(new Array());
  /**
   * @Handler Handles Base Step Added
   */

  const layoutNodes = () => {
    const sortStepsArr = (arr: any, removeEmpties: boolean) => {
      let sortedArr = [...arr].filter((step: any) => {
        return !!step;
      });
      sortedArr = sortedArr.sort((a: any, b: any) => {
        return a.step_identifier - b.step_identifier;
      });
      let oldToNewIDsMapping = new Map();
      if (removeEmpties) {
        sortedArr.forEach((step: any, index: number) => {
          if (step.empty && step.empty == true) {
            sortedArr.splice(index, 1);
          }
        });
      }
      sortedArr = sortedArr.map((step: any, index: number) => {
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
      if (step.type === NodeStepEnum.PLACEHOLDER) {
        continue;
      }

      let doesHaveChildren = stepsTorender.find((_step: any) => {
        let shouldReturn =
          _step.parent_step_identifier === step.step_identifier &&
          _step.type !== NodeStepEnum.PLACEHOLDER;

        return shouldReturn;
      });

      let isCompleteStep =
        step.type !== NodeStepEnum.PLACEHOLDER &&
        step.type !== NodeStepEnum.CHOOSE_ACTION &&
        step.type !== NodeStepEnum.CONFIG_ACTION;

      if (!doesHaveChildren) {
        let arrToSplice = [];
        let currentStepHeight = step.height;
        let basePlaceholderHeight = 96;
        let latestId = step.step_identifier;
        while (currentStepHeight >= basePlaceholderHeight) {
          stepsTorender.splice(i + 1, 0, {
            step_identifier: stepsTorender.length,
            parent_step_identifier: latestId,
            type: NodeStepEnum.PLACEHOLDER,
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

    let hierarchy = stratify()
      .id((d: any) => d.step_identifier)
      .parentId((d: any) => d.parent_step_identifier)(
      sortStepsArr(stepsTorender, false)
    );

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
      let tallestNode = value.reduce((prev: any, current: any) => {
        return prev.data.height > current.data.height ? prev : current;
      });
      tallestArr.push(tallestNode);
    }

    interface IData {
      step_identifier: number;
      parent_step_identifier: number;
      type: NodeStepEnum | string;
      function_identifiers: number[];
      width: number;
      height: number;
      empty?: boolean;
    }

    interface IPosition {
      x: number;
      y: number;
    }

    interface YcNode {
      position: IPosition;
      data: IData;
      children: any;
    }

    let layout = tree()
      .nodeSize([1, 190])
      .separation((a: any, b: any) => {
        let baseWidth = a.data.width + b.data.width;
        let siblingsArrSymmetric = a.parent.children.length % 2 == 0;
        baseWidth ? (baseWidth = baseWidth / 2 + 30) : (baseWidth = 357);
        if (
          siblingsArrSymmetric &&
          a.parent.children.findIndex((d: any) => d.id == a.id) ==
            a.parent.children.length / 2
        ) {
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

    hierarchy.each((d: any, index: any) => {
      isNaN(d.data.width)
        ? (d.data.width = 327)
        : (d.data.width = d.data.width);

      isNaN(d.data.height)
        ? (d.data.height = 96)
        : (d.data.height = d.data.height);
    });

    let root = layout(hierarchy);

    let { width, nodesNum, height } = DetermineWidth(root);

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

    return root.descendants().map((d3Step: any) => {
      return {
        ...d3Step.data,
        position: { x: d3Step.x, y: d3Step.y },
        children: d3Step.children,
      };
    });
  };

  useEffect(() => {
    if (strategySteps.length > 1) {
      setD3StrategyHirarchy(layoutNodes());
    }
  }, [strategySteps]);

  const handleBaseStepAdd = async (
    baseStep: any,
    percentage: number,
    additional_args: any
  ) => {
    let {
      actionName,
      action_outflows,
      action_inflows,
      function_identifier,
      address_identifier,
      protocol_identifier,
      protocolDetails,
    } = baseStep;

    let tempBaseSteps = [...baseSteps];
    let tempSteps = [...strategySteps];
    let tempActionableTokens = [...actionableTokens];

    let step = {
      type: actionName,
      divisor: await calcDivisor(percentage),
      function_identifiers: [function_identifier],
      address_identifiers: [address_identifier],
      protocol_identifier: protocol_identifier,
      protocol_details: protocolDetails,
      additional_args: additional_args ? additional_args : [],
      flows_identifiers: action_outflows
        .concat(action_inflows)
        .map((flow: any) => flow.flow_identifier),
      step_identifier: tempSteps.length + 1,
      parent_step_identifier: tempSteps.length,
      outflows: action_outflows,
      inflows: action_inflows,
      percentage: percentage,
      width: 327,
      height: 96,
    };

    let newQuickAddActions = fullFunctionsList.filter((func: any) => {
      return func.unlocked_by == function_identifier;
    });

    newQuickAddActions = [
      ...(await newQuickAddActions
        .filter((func: any) => !!func)
        .map(async (func: any) => {
          let fullFuncDetails = await getFunctionFullDetails(
            func.function_identifier
          );
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
      tokens: action_outflows.map((flow: any) => flow.token_details),
      step_identifier: tempSteps.length,
      parent_step_identifier: tempSteps.find(
        (step: any) => step.type == "swapcomponent"
      ).step_identifier,
      width: 64 * action_outflows.length,
      height: 64,
    });
    tempSteps.push(step);
    tempActionableTokens.push(
      ...[...action_inflows.map((inflow: any) => inflow.token_details)]
    );
    setBaseSteps(tempBaseSteps);
    setStrategySteps(tempSteps);
    setActionableTokens(tempActionableTokens);
    setShowPercentageBox(false);
    setUnusedBaseBalance(unusedBaseBalance - percentage);
    setQuickAddActions((prev: any) =>
      prev.length ? prev.concat(newQuickAddActions) : newQuickAddActions
    );
  };

  // Updating the strategy steps once when the deposit token is selected,
  // Ensuring the deposit token & "Multi Swap" component are visible
  // and are the highest in the hirarchy.
  const { fullNetworksList } = useContext(DatabaseContext);

  const updateStrategiesNetwork = async () => {
    let depositTokenChainId = depositToken.chain_id;
    let depositTokenNetwork = fullNetworksList.find(
      (network: any) => network.chain_id == depositTokenChainId
    );
    let alreadyHas = strategyNetworks.find(
      (network: any) => network.chain_id == depositTokenChainId
    );
    let newArr = [...strategyNetworks];
    if (!alreadyHas) newArr.push(depositTokenNetwork);
    setStrategyNetworks(newArr);
  };

  useEffect(() => {
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

  return (
    <StrategyContext.Provider
      value={{
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
      }}
    >
      {props.children}{" "}
    </StrategyContext.Provider>
  );
};

export default DatabaseContextProvider;
