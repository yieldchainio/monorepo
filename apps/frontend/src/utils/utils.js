import axios from "axios";
import { ethers } from "ethers";
import _ from "lodash";

export const getTokenDetails = async (_token_identifier) => {
  //   interface IToken {
  //     token_identifier: number;
  //     name: string;
  //     address: string;
  //     symbol: string;
  //     logo: string;
  //     decimals: number;
  //     coinkey: string;
  //     priceusd: number;
  //     chainid: number;
  //   }

  let full_tokens_list = await axios.get("https://api.yieldchain.io/tokens");
  full_tokens_list = full_tokens_list.data.tokens;
  let current_token_details = await full_tokens_list[
    await full_tokens_list.findIndex(
      (token_item /* IToken */) =>
        token_item.token_identifier == _token_identifier
    )
  ];

  return current_token_details;
};

export const getFlowDetails = async (_flow_identifier) => {
  //   interface IFlow {
  //     flow_identifier: number;
  //     token_identifier: number;
  //     outflow0_or_inflow1: number;
  //   }

  let full_flows_list = await axios.get("https://api.yieldchain.io/flows");
  full_flows_list = full_flows_list.data.flows;

  let current_flow_details = await full_flows_list[
    await full_flows_list.findIndex(
      (flow_item /* IFlow */) => flow_item.flow_identifier == _flow_identifier
    )
  ];
  return current_flow_details;
};

export const getFunctionDetails = async (_function_identifier) => {
  //   interface IFunction {
  //     function_identifier: number;
  //     function_name: string;
  //     number_of_parameters: number;
  //     flows: number[];
  //     arguments: number[];
  //   }

  let full_functions_list = await axios.get(
    "https://api.yieldchain.io/functions"
  );
  full_functions_list = full_functions_list.data.functions;

  let current_function_details = await full_functions_list[
    await full_functions_list.findIndex(
      (function_item /* IFunction */) =>
        function_item.function_identifier == _function_identifier
    )
  ];
  return current_function_details;
};

export const getParameterDetails = async (_parameter_identifier) => {
  //   interface IParameter {
  //     parameter_identifier: number;
  //     index: number;
  //     solidity_type: string;
  //     value: string;
  //   }

  let full_parameters_list = await axios.get(
    "https://api.yieldchain.io/parameters"
  );
  full_parameters_list = full_parameters_list.data.parameters;

  let current_parameter_details = await full_parameters_list[
    await full_parameters_list.findIndex(
      (parameter_item) =>
        parameter_item.parameter_identifier == _parameter_identifier
    )
  ];
  return current_parameter_details;
};

export const getAddressDetails = async (_address_identifier) => {
  //   interface IAddress {
  //     address_identifier: number;
  //     address: string;
  //     abi: any;
  //     chain_id: number;
  //     functions: any[];
  //   }

  let full_addresses_list = await axios.get(
    "https://api.yieldchain.io/addresses"
  );
  full_addresses_list = full_addresses_list.data.addresses;

  let current_address_details = await full_addresses_list[
    await full_addresses_list.findIndex(
      (address_item) => address_item.address_identifier == _address_identifier
    )
  ];
  return current_address_details;
};

export const getNetworkDetails = async (_network_identifier) => {
  let full_networks_list = await axios.get(
    "https://api.yieldchain.io/networks"
  );
  full_networks_list = full_networks_list.data.networks;

  let current_network_details = await full_networks_list[
    await full_networks_list.findIndex(
      (networkObj) => networkObj.chain_id == _network_identifier
    )
  ];
  return current_network_details;
};

export const getProtocolDetails = async (_protocoL_identifier) => {
  let full_protocols_list = await axios.get(
    "https://api.yieldchain.io/protocols"
  );
  full_protocols_list = full_protocols_list.data.protocols;

  let current_protocol_details = await full_protocols_list[
    await full_protocols_list.findIndex(
      (protocolObj) => protocolObj.protocol_identifier == _protocoL_identifier
    )
  ];
  return current_protocol_details;
};

export const calculateInterval = (interval) => {
  let minute = 60;
  let hour = 3600;
  let day = 86400;
  let week = 604800;
  let month = day * 30;

  if (interval >= month) {
    if (interval == month) {
      return "Monthly";
    } else {
      return `${(interval / month).toFixed(1)} Months`;
    }
  }

  if (interval >= week) {
    if (interval == month) {
      return "Weekly";
    } else {
      return `${(interval / week).toFixed(1)} Weeks`;
    }
  }

  if (interval >= day) {
    if (interval == month) {
      return "Daily";
    } else {
      return `${(interval / day).toFixed(1)} Days`;
    }
  }

  if (interval >= hour) {
    if (interval == hour) {
      return "Hourly";
    } else {
      return `${(interval / hour).toFixed(1)} Hours`;
    }
  }

  if (interval >= minute) {
    if (interval == minute) {
      return "Minute";
    } else {
      return `${(interval / minute).toFixed(1)} Minutes`;
    }
  }
};

export const rawCalcInterval = (intervalSecs) => {
  let minute = 60;
  let hour = 3600;
  let day = 86400;
  let week = 604800;
  let month = day * 30;

  if (intervalSecs >= month) {
    return {
      interval:
        (intervalSecs / month).toFixed(1).toString().split(".")[1] > 0
          ? (intervalSecs / month).toFixed(1)
          : intervalSecs / month,
      unit: "months",
    };
  }
  if (intervalSecs >= week) {
    return {
      interval:
        (intervalSecs / week).toFixed(1).toString().split(".")[1] > 0
          ? (intervalSecs / week).toFixed(1)
          : intervalSecs / week,
      unit: "weeks",
    };
  }
  if (intervalSecs >= day) {
    return {
      interval:
        (intervalSecs / day).toFixed(1).toString().split(".")[1] > 0
          ? (intervalSecs / day).toFixed(1)
          : intervalSecs / day,
      unit: "days",
    };
  }
  if (intervalSecs >= hour) {
    return {
      interval:
        (intervalSecs / hour).toFixed(1).toString().split(".")[1] > 0
          ? (intervalSecs / hour).toFixed(1)
          : intervalSecs / hour,
      unit: "hours",
    };
  }
  if (intervalSecs >= minute) {
    return {
      interval:
        (intervalSecs / minute).toFixed(1).toString().split(".")[1] > 0
          ? (intervalSecs / minute).toFixed(1)
          : intervalSecs / minute,
      unit: "minutes",
    };
  } else {
    return { interval: intervalSecs, unit: "seconds" };
  }
};

export const getStepDetails = async (_step_obj) => {
  let step_identifier = _step_obj.step_identifier;
  let step_address = await getAddressDetails(_step_obj.address_identifiers[0]);
  let step_type = _step_obj.type;
  let step_divisor = _step_obj.divisor;
  let step_function = await getFunctionDetails(
    _step_obj.function_identifiers[0]
  );
  let step_protocol = await getProtocolDetails(_step_obj.protocol_identifier);
  let step_custom_args = _step_obj.additional_args;
  let step_flows = [];
  if (_step_obj.inflows && _step_obj.outflows) {
    step_flows = _step_obj.inflows.concat(_step_obj.outflows);
  } else {
    for await (const flowId of _step_obj.flows_identifiers ||
      _step_obj.flow_identifiers) {
      let flow = await getFlowDetails(flowId);
      let flowTokenDetails = await getTokenDetails(flow.token_identifier);
      let fullflow = {
        flow_identifier: flow.flow_identifier,
        flow_token: flowTokenDetails,
        outflow0_or_inflow1: flow.outflow0_or_inflow1,
      };
      step_flows.push(fullflow);
    }
  }

  let step_details = {
    step_identifier,
    step_address,
    step_type,
    step_divisor,
    step_function,
    step_protocol,
    step_custom_args,
    step_flows,
  };

  return step_details;
};

export const toTitleCase = (_string) => {
  let titleCaseString = _string
    .toLowerCase()
    .replace(_string[0].toLowerCase(), _string[0].toUpperCase());

  return titleCaseString;
};

export const formatDecimals = async (_stringNumber, _decimals) => {
  let newStringNumber =
    (await _stringNumber.split(".")[0]) +
    "." +
    (await _stringNumber.split(".")[1].slice(0, 4));

  return newStringNumber;
};

export const openInNewTab = async (_url) => {
  alert(_url);
  window.open(_url, "_blank");
};

export const getActionDetails = async (_action_identifier) => {
  let full_actions_list = await axios.get("https://api.yieldchain.io/actions");
  full_actions_list = full_actions_list.data.actions;

  let current_action_details = await full_actions_list[
    await full_actions_list.findIndex(
      (action_item) => action_item.action_identifier == _action_identifier
    )
  ];
  return current_action_details;
};

export const lowerCaser = (_string) => {
  let lowerCaseString = _string.toLowerCase().replaceAll(" ", "");
  return lowerCaseString;
};

export const findActionProtocols = async (_action_identifier) => {
  let actionDetails = await getActionDetails(_action_identifier);
  let actionTable = await axios.get(
    `https://api.yieldchain.io/actions/${lowerCaser(actionDetails.name)}`
  ).data.actionTable;

  let allProtocols = (await axios.get("https://api.yieldchain.io/protocols"))
    .data.protocols;

  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;

  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;

  let protocolsAddresses = (
    await axios.get("https://api.yieldchain.io/protocols-addresses")
  ).data.protocols_addresses;

  let allActionFunctions = actionTable.map((action) => action.function_id);

  let allActionAddresses = [];

  for await (const addressItem of allAddresses) {
    for await (const addfunc of addressItem.functions) {
      if (allActionFunctions.includes(addfunc)) {
        allActionAddresses.push(addressItem);
      }
    }
  }

  let allActionProtocols = [];

  for await (const protocolAddressPair of protocolsAddresses) {
    if (
      allActionAddresses.findIndex(
        (actionAddy) => actionAddy == protocolAddressPair.address_identifier
      ) !== -1
    ) {
      allActionProtocols.push(
        await getProtocolDetails(protocolAddressPair.protocol_identifier)
      );
    }
  }

  return allActionProtocols;

  // Function Closing Bracket
};

export const findProtocolActions = async (_protocol_identifier) => {
  let allActions = (await axios.get("https://api.yieldchain.io/actions")).data
    .actions;

  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;

  let allProtocolsAddresses = (
    await axios.get("https://api.yieldchain.io/protocols-addresses")
  ).data.protocols_addresses;

  let currentProtocolAddresses = [];

  for await (const protocolAddressPair of allProtocolsAddresses) {
    if (protocolAddressPair.protocol_identifier == _protocol_identifier) {
      await getAddressDetails(protocolAddressPair.address_identifier).then(
        (address) => currentProtocolAddresses.push(address)
      );
    }
  }

  let allProtocolFunctions = [];

  for await (const address of currentProtocolAddresses) {
    for await (const funcid of address.functions) {
      await getFunctionDetails(funcid).then((func) =>
        allProtocolFunctions.push(func)
      );
    }
  }

  let allProtocolActionsPairs = [];

  for await (const action of allActions) {
    let actionDetails = await getActionDetails(action.action_identifier);

    let actionTable = (
      await axios.get(
        `https://api.yieldchain.io/actions/${lowerCaser(actionDetails.name)}`
      )
    ).data.actionTable;

    for await (const actionFunction of actionTable) {
      let funcId = actionFunction.function_identifier;
      if (
        allProtocolFunctions.find(
          (functionObj) => functionObj.function_identifier == funcId
        )
      ) {
        let functionDetails = await getFunctionDetails(funcId);
        allProtocolActionsPairs.push({
          actionDetails: actionDetails,
          functionDetails: functionDetails,
        });
      }
    }
  }

  /**
   * If The Function Is Supposed To Be Used After Another Function, It Should Not Be Displayed In The Protocol Table,
   * Assuming It Is For Choosing Base Actions, Meaning No Prior Actions Were Added into The Strategy, And therefore
   * The Function Could Not Have Been Unlocked
   */

  allProtocolActionsPairs = allProtocolActionsPairs.filter(
    (pair) =>
      pair.functionDetails.unlocked_by == null &&
      pair.functionDetails.function_identifier !==
        pair.functionDetails.unlocked_by
  );

  console.log("All protocols action pairs", allProtocolActionsPairs);
  return allProtocolActionsPairs;
};

export const getFunctionAction = async (_function_identifier) => {
  let allActions = (await axios.get("https://api.yieldchain.io/actions")).data
    .actions;

  for await (const action of allActions) {
    let actionTable = (
      await axios.get(
        `https://api.yieldchain.io/actions/${lowerCaser(action.name)}`
      )
    ).data.actionTable;

    for await (const actionFunction of actionTable) {
      if (actionFunction.function_identifier == _function_identifier) {
        return action;
      }
    }
  }
};

export const getProtocolTableRowDetails = async (
  _protocol_identifier,
  _function_identifier,
  _action_identifier
) => {
  let protocolDetails = await getProtocolDetails(_protocol_identifier);
  let functionDetails = await getFunctionDetails(_function_identifier);
  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;

  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;

  let allActions = (await axios.get("https://api.yieldchain.io/actions")).data
    .actions;

  let flows = await Promise.all(
    functionDetails.flows.map(async (flow) => await getFlowDetails(flow))
  );
  let outflows = await Promise.all(
    flows
      .filter((flow) => flow.outflow0_or_inflow1 == 0)
      .map(
        async (outflow) =>
          (outflow = {
            flow_identifier: outflow.flow_identifier,
            token_details: await getTokenDetails(outflow.token_identifier),
            outflow0_or_inflow1: outflow.outflow0_or_inflow1,
          })
      )
  );

  let inflows = await Promise.all(
    flows
      .filter((flow) => flow.outflow0_or_inflow1 == 1)
      .map(
        async (inflow) =>
          (inflow = {
            flow_identifier: inflow.flow_identifier,
            token_details: await getTokenDetails(inflow.token_identifier),
            outflow0_or_inflow1: inflow.outflow0_or_inflow1,
          })
      )
  );

  let functionAddress = allAddresses.find((addressObj) => {
    if (!addressObj.functions) {
      return false;
    }
    if (addressObj.functions.includes(_function_identifier)) {
      return true;
    }
  });

  let network = await getNetworkDetails(functionAddress.chain_id);

  let functionUnlocks = allFunctions.filter(
    (func) => func.unlocked_by == _function_identifier
  );

  let functionsToActions = await Promise.all(
    functionUnlocks.map(async (lockedFunc) => {
      let actionDetails = await getFunctionAction(
        lockedFunc.function_identifier
      );
      lockedFunc = {
        function_details: lockedFunc,
        action_details: actionDetails,
      };
      return lockedFunc;
    })
  );

  let protocolTableRowDetails = {
    outflows: await Promise.all(outflows),
    inflows: await Promise.all(inflows),
    networkDetails: network,
    unlockedActions: functionsToActions,
  };

  return protocolTableRowDetails;
};

export const getFunctionAddress = async (_function_identifier) => {
  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;
  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;
  let currentAddress = allAddresses.find(
    (addressObj) =>
      addressObj.functions &&
      addressObj.functions.includes(_function_identifier)
  );

  return currentAddress;
};

export const calcDivisor = async (_percentage) => {
  let arr = parseFloat(100 / _percentage).toPrecision(18);

  return parseFloat(arr);
};

export const getPercentageFromBigDivisor = (_divisor) => {
  let percentage =
    (parseFloat(_divisor.toString().slice(-17, 0).join(".")) * 100) /
    _divisor /
    _divisor;

  return percentage;
};

export const getUnusedPercentage = (_steps) => {
  let totalPercentage = 100;
  for (const step of _steps) {
    totalPercentage -= getPercentageFromBigDivisor(step.divisor);
  }
  return 100 - totalPercentage;
};

export const isNumSymmetric = (_num) => {
  let numString = _num.toString();
  let numStringReversed = numString.split("").reverse().join("");
  if (numString == numStringReversed) {
    return true;
  }
  return false;
};

/**
 * @param {*} _arr
 * @param {*} _index
 * @param {*} _parentNodeOffsetX
 * @param {*} _parentNodeWidth
 * @param {*} _childWidth
 * @param {*} _baseMargin
 * @param {*} _childsMargin
 * @returns The X Offset Of A Child Node Based On The Parent Node,
 * The Index Of The Child Node, And The Array Of Child Nodes That Belong
 * To The Same Parent Node
 *  */

export const pingPongSymmetricalBlockSpread = (
  _arr,
  _index,
  _parentNodeOffsetX,
  _parentNodeWidth,
  _childWidth,
  _baseMargin,
  _childsMargin
) => {
  /**
   * Checks To See If The Array Is Symmetric, If it Isnt, And The Index Is 0,
   * It Will Place it Right Under The Parent Node In The middle. If it is/Isnt,
   * but the index isnt 0 - It Will Spread it symmetrically out to the sides from the parent node.
   * This Is Because, The first item will always be placed in the middle (Assuming
   * The Array Is A-Symmetric), And The Rest Will Be Placed Symmetrically Out
   * To The Sides. If the index isn't 0, the rest of the array is treated as a symmetric
   * array (Since 0 would already be placed in the middle, anyways)
   */
  let isArrSymmetric = isNumSymmetric(_arr.length / 2);

  if (!isArrSymmetric && _index == 0) {
    // Exactly In The Middle Of The Parent Node
    let childOffsetX = _parentNodeOffsetX + _parentNodeWidth / 2;

    return [childOffsetX, false];
  } else {
    /* Shorthanding @params */
    let baseMargin = _baseMargin;
    let childsMargin = _childsMargin;

    // If The array is symmetric, then the index shall remain the same.
    // If it is A-symmetric, the array shall be treated as symmetric,
    // Which means the first (0) item is removed, and therefore each
    // Item's index is treated as if it 1 less than it actually is.
    let index = _index;
    let isIndexSymmetric = isNumSymmetric(index / 2);

    /**
     * In The Actual Graph Division, If The Index Is Symmetric,
     * The Child Node Is Placed On The Right Side Of The Parent Node,
     * If it isn't it is placed on the left side - With margins as per
     * the index of it, according to the base & childs margins provided
     * in the @params
     */

    // Initiallizing The Variable
    let childOffsetX;

    // A symmetric Index
    let symmetricIndex;
    if (isIndexSymmetric) {
      if (isArrSymmetric) {
        symmetricIndex = index / 2;
      } else {
        symmetricIndex = index / 2 - 1;
      }
    } else {
      symmetricIndex = (index - 1) / 2;
    }

    // Switching Cases Between The Index Being Symmetric (Goes To The Right Side)
    // And The index being A-Symmetric (Goes To The Left Side)
    switch (isIndexSymmetric) {
      case true:
        childOffsetX =
          _parentNodeOffsetX +
          _parentNodeWidth +
          baseMargin +
          _childWidth / 2 +
          childsMargin * symmetricIndex;
        return [childOffsetX, true];

      case false:
        let assymetricIndex = index == 1 ? 0 : index - 2;
        childOffsetX =
          _parentNodeOffsetX -
          _childWidth / 2 -
          baseMargin -
          childsMargin * symmetricIndex;
        return [childOffsetX, false];
    }
  }
};

export const getFunctionFullDetails = async (_function_identifier) => {
  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;

  let allFlows = (await axios.get("https://api.yieldchain.io/flows")).data
    .flows;

  let allArguments = (await axios.get("https://api.yieldchain.io/parameters"))
    .data.parameters;

  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;

  let allProtocols = (await axios.get("https://api.yieldchain.io/protocols"))
    .data.protocols;

  let protocolsAddresses = (
    await axios.get("https://api.yieldchain.io/protocols-addresses")
  ).data.protocols_addresses;

  let currentFunction = await allFunctions.find(
    (functionObj) => functionObj.function_identifier == _function_identifier
  );

  let currentAddress = await allAddresses.find((address) =>
    address.functions.includes(currentFunction.function_identifier)
  );

  let currentProtocol = await allProtocols.find((protocol) => {
    return protocolsAddresses.find((protocolAddress) => {
      return (
        protocolAddress.protocol_identifier == protocol.protocol_identifier &&
        protocolAddress.address_identifier == currentAddress.address_identifier
      );
    });
  });

  let currentArguments = await allArguments.filter((arg) =>
    currentFunction.arguments.includes(arg.parameter_identifier)
  );

  let currentCustomArgumens = await allArguments.filter((arg) =>
    arg.value.includes("abi.decode(current_custom_arguments[")
  );

  let currentFlows = await allFlows.filter((flow) =>
    currentFunction.flows.includes(flow.flow_identifier)
  );
  let unlockedFunctions = await allFunctions.filter(
    (functionObj) =>
      functionObj.unlocked_by == currentFunction.function_identifier
  );

  unlockedFunctions = await Promise.all(
    unlockedFunctions.map(async (func) => {
      let funcFlows = await Promise.all(
        func.flows.map(async (flow) => {
          let flowDetails = await getFlowDetails(flow);
          let tokenDetails = await getTokenDetails(
            flowDetails.token_identifier
          );
          flowDetails = {
            flow_identifier: flow,
            token_details: tokenDetails,
            outflow0_or_inflow1: flowDetails.outflow0_or_inflow1,
          };
          return flowDetails;
        })
      );

      let funcOutflows = await Promise.all(
        funcFlows
          .filter((flow) => flow.outflow0_or_inflow1 == 0)
          .map(async (outflow) => {
            let flowDetails = await getFlowDetails(outflow.flow_identifier);
            let detailsFlow = {
              flow_identifier: outflow.flow_identifier,
              token_details: await getTokenDetails(
                flowDetails.token_identifier
              ),
            };
            return detailsFlow;
          })
      );
      let funcInflows = await Promise.all(
        funcFlows
          .filter((flow) => flow.outflow0_or_inflow1 == 1)
          .map(async (inflow) => {
            let flowDetails = await getFlowDetails(inflow.flow_identifier);
            let detailsFlow = {
              flow_identifier: inflow.flow_identifier,
              token_details: await getTokenDetails(
                flowDetails.token_identifier
              ),
            };
            return detailsFlow;
          })
      );
      let funcDetails = {
        function_identifier: func.function_identifier,
        function_name: currentFunction.function_name,
        number_of_parameters: currentFunction.number_of_parameters,
        arguments: await allArguments.filter((arg) =>
          func.arguments.includes(arg.parameter_identifier)
        ),
        custom_arguments: await allArguments.filter(
          (arg) =>
            func.arguments.includes(arg.parameter_identifier) &&
            arg.value.includes("abi.decode(current_custom_arguments[")
        ),
        outflows: funcOutflows,
        inflows: funcInflows,
        unlocked_functions: await allFunctions.filter(
          (functionObj) => functionObj.unlocked_by == func.function_identifier
        ),
        protocol: currentProtocol,
      };
      return funcDetails;
    })
  );

  let counterFunction = await allFunctions.find(
    (functionObj) =>
      functionObj.function_identifier ==
      currentFunction.counter_function_identifier
  );

  let outflows = await Promise.all(
    currentFlows
      .filter((flow) => flow.outflow0_or_inflow1 == 0)
      .map(async (outflow) => {
        let flowDetails = await getFlowDetails(outflow.flow_identifier);
        let detailsFlow = {
          flow_identifier: outflow.flow_identifier,
          token_details: await getTokenDetails(flowDetails.token_identifier),
        };
        return detailsFlow;
      })
  );
  let inflows = await Promise.all(
    currentFlows
      .filter((flow) => flow.outflow0_or_inflow1 == 1)
      .map(async (inflow) => {
        let flowDetails = await getFlowDetails(inflow.flow_identifier);
        let detailsFlow = {
          flow_identifier: inflow.flow_identifier,
          token_details: await getTokenDetails(flowDetails.token_identifier),
        };
        return detailsFlow;
      })
  );

  let functionDetails = {
    function_identifier: currentFunction.function_identifier,
    function_name: currentFunction.function_name,
    number_of_parameters: currentFunction.number_of_parameters,
    arguments: currentArguments,
    custom_arguments: currentCustomArgumens,
    outflows: outflows,
    inflows: inflows,
    unlocked_functions: unlockedFunctions,
    protocol: currentProtocol,
    unlocked_by: currentFunction.unlocked_by,
  };
  return functionDetails;
};

const getChildren = (_parentNode, _nodesArr) => {
  let children = _nodesArr.filter(
    (node) => node.parent == _parentNode.step_identifier
  );
  if (children.length > 0) {
    return children;
  } else {
    return false;
  }
};

const getSiblings = (_node, _nodesArr) => {
  let siblings = _nodesArr.filter(
    (node) => node.parent_identifier == _node.parent_identifier
  );

  if (!siblings.length) {
    return false;
  } else {
    return siblings;
  }
};

const mapLevels = (_nodesArr) => {
  let headNode = _nodesArr.find((node) => node.parent_identifier == null);
  let visited = new Set();
  let queue = [headNode];
  let levelsMapping = new Map();
  let levelsWidthMapping = new Map();
  let iterator = levelsMapping[Symbol.iterator]();

  /**
   * @param {*} node
   * @returns The "Level" (Floor, Horizontal Row) Of A Node.
   * It Does That By Searching For The Node's Parent's Parent's Parent...
   * Until It Finds The Head Node (At Row 0), And Counts The Number Of
   * Times It Had To Search For A Parent.
   */
  function getLevel(node) {
    let level = 0;
    let currentNode = node;
    while (currentNode.parent_identifier !== null) {
      currentNode = _nodesArr.find(
        (node) => node.step_identifier == currentNode.parent_identifier
      );
      level++;
    }
    return level;
  }

  while (queue.length) {
    let node = queue.shift();
    let level = getLevel(node);
    if (!levelsMapping.has(level)) {
      levelsMapping.set(level, []);
    }
    let siblingsBundle = getSiblings(node, _nodesArr);
    levelsMapping.get(level).push(siblingsBundle);
    visited.add(node.step_identifier);
    let children = _nodesArr.filter(
      (node) => node.parent_identifier == node.step_identifier
    );
    for (let child of children) {
      if (!visited.has(child.step_identifier)) {
        queue.push(child);
      }
    }
  }

  let containerWidth;

  const getRowWidth = (floorNumberToBundlesArrMapping, isFirst) => {
    let baseWidthArr = [];
    let children = [];
    // TODO REMOVE UNDER
    let value = [];
    value.forEach((siblingsBundle) => {
      if (isNumSymmetric(siblingsBundle.length / 2)) {
        baseWidthArr.unshift("empty");
      }
      siblingsBundle.forEach((sibling) => {
        baseWidthArr.push(sibling);
        let currentChilds = getChildren(sibling, _nodesArr);
        if (currentChilds) {
          currentChilds.forEach((child) => child.push(children));
        }
      });
      if (!children.length) {
        return baseWidthArr;
      } else {
        getRowWidth(children).then((res) =>
          res.forEach((resChild) => {
            baseWidthArr.push(resChild);
            children.push(resChild);
            if (isFirst) {
              return baseWidthArr.length - children.length / 2;
            }
            return baseWidthArr;
          })
        );
      }
    });
  };
  for (let [key, value] of levelsMapping) {
    let baseWidthArr = [];
    value.forEach((siblingsBundle) => {
      siblingsBundle.forEach((sibling) => baseWidthArr.push(sibling));
      if (isNumSymmetric(siblingsBundle.length / 2)) {
        baseWidthArr.unshift("empty");
      }
    });
    levelsWidthMapping.set(key, value.length);
  }

  return levelsMapping;
};

const drawGraph = (_levelsMapping) => {
  let iterator = _levelsMapping[Symbol.iterator]();
  let iterableLevelsMapping = [];

  let visitedFloors = new Set();
  let visitedNodes = new Set();

  let floorsWidth = new Map();

  let totalContainerWidth = "default";
  let totalContainerHeight = "default";

  iterator.forEach((item) => iterableLevelsMapping.push(item));
  iterableLevelsMapping = iterableLevelsMapping.reverse();
  const scanRow = (levelPair) => {
    let parentLevelPair = iterableLevelsMapping[levelPair[0] + 1];
    /**
     * levelPair = e.g: [1 (level Number), [[node1, node2, node3], [node4, node5, node6], [node7, node8, node9]]]
     */
    let floorIndex = levelPair[0];
    let floorNodes = levelPair[1];
    let parentFloorIndex = parentLevelPair[0];
    let parentFloorNodes = parentLevelPair[1];

    let floorSize = 0;
    let parentFloorSize = 0;

    floorNodes.forEach((flrBndl) => (floorSize += flrBndl.length));
    parentFloorNodes.forEach((flrBndl) => (parentFloorSize += flrBndl.length));

    if (parentFloorSize > floorSize) {
      let parentPlacements = scanRow(parentLevelPair);
      for (const parentNode of parentPlacements) {
        let parentXPlacement = parentNode.offsetXPlacement;
        let parentYPlacement = parentNode.offsetYPlacement;
        let parentWidth = parentNode.width;
        let parentHeight = parentNode.height;
        let indexOfChildrenBundle = floorNodes.find((nodeBundle, index) => {
          let bundle = nodeBundle.find(
            (node) => node.parent_identifier == parentNode.step_identifier
          );
        });
      }
    } else {
    }
  };
  for (const levelPair of iterableLevelsMapping) {
    let { floorSize, parentFloorSize, floor, parentFloor } = scanRow(levelPair);
  }
};

/**
 * This Function Is Used To Scan The Graph, Return Mappings Of Each Row's "Base Width" (
 * Which Means the width of each "bundle" (which it also calculates), times the number of bundles,
 * including margins), and also a mapping of the total width of each row, which is the base width
 * plus the width of it's child row, and etc etc in a recrusive manner. This ensures
 * that each row will always be at the very least at the same width of it's child row's width.
 * It returns various details about the graph and each row.
 * It Also returns the first row who has no siblings nor 'cousins' (Aka, it's parent has no siblings
 * , and it also has no siblings of it's own)
 */
const scanGraph = (_levelsMapping) => {
  // Creating an iterable version of the mapping which includes each level, and all of it's
  // sibling bundles of nodes.
  let iterator = _levelsMapping[Symbol.iterator]();
  let iterableLevelsMapping = [];
  iterator.forEach((item) => iterableLevelsMapping.push(item));

  // Finds the first row which has no siblings, nor cousins (It's parent has no siblings)
  // This Row Will Always Be Positioned
  const findLastSiblingless = (levelPair) => {
    let level = levelPair[0];
    let siblingsBundles = levelPair[1];
    let siblings = [];
    siblingsBundles.forEach((siblingsBundle) =>
      siblingsBundle.forEach((sibling) => siblings.push(sibling))
    );
    if (!findLastSiblingless(iterableLevelsMapping[levelPair[0] + 1])) {
      return siblings.length !== false ? levelPair[0] : false;
    }
  };
  let lastSiblinglessRow = findLastSiblingless(iterableLevelsMapping[0]);

  let visitedFloors = new Set();
  let visitedNodes = new Set();

  let floorsWidth = new Map();
  let floorsBaseWidth = new Map();
  let totalWidth = 0;

  const scanRow = (levelPair) => {
    let parentLevelPair = iterableLevelsMapping[levelPair[0] + 1];
    let floorIndex = levelPair[0];
    let floorBundles = levelPair[1];

    let floorSize;
    let floorBaseSize;

    floorBundles.forEach((flrBndl, index, arr) => {
      let floorBundle = [...flrBndl];
      // isNumSymmetric(flrBndl.length / 2) ? floorBundle.unshift("empty") : null;

      let bundleWidth = 0;

      let parent = parentLevelPair[1].find((parentBundle) => {
        let _parent = parentBundle.find(
          (parent_) =>
            parent_.step_identifier == floorBundle[index].parent_identifier
        );
      });

      floorBundle.forEach((node, index) => {
        if (node == "empty") {
          bundleWidth += parent.width;
        } else {
          bundleWidth += node.width;
        }
      });

      floorBaseSize += bundleWidth;
    });

    floorsBaseWidth.set(floorIndex, floorBaseSize);

    if (iterableLevelsMapping[floorIndex + 1]) {
      let { floorTotalWidth } = scanRow(iterableLevelsMapping[floorIndex + 1]);
      floorSize += floorTotalWidth;
    } else {
      floorSize = floorBaseSize;
    }
    floorsWidth.set(floorIndex, floorSize);

    return { floorTotalWidth: floorSize, floorBaseWidth: floorBaseSize };
  };
};

const getActionFunctionsAddresses = async (action_identifier) => {
  let allActions = (await axios.get("https://api.yieldchain.io/actions")).data
    .actions;
  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;
  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;

  let currentAction = allActions.find(
    (_action) => _action.action_identifier == action_identifier
  );

  let actionFunctions = (
    await (
      await axios.get(
        `https://api.yieldchain.io/actions/${currentAction.name
          .toLowerCase()
          .split(" ")
          .join("")}`
      )
    ).data.actionTable
  ).map((_action) => {
    let details = allFunctions.find(
      (func_) => func_.function_identifier == _action.function_identifier
    );

    return details;
  });

  let actionAddresses = allAddresses.filter((address) => {
    for (const functionOfAddress of address.functions) {
      for (const actionFunction of actionFunctions) {
        if (functionOfAddress == actionFunction.function_identifier) {
          return true;
        }
      }
    }
  });

  return { actionAddresses: actionAddresses, actionFunctions: actionFunctions };
};

export const findProtocolActionMainFunction = async (
  action_identifier,
  protocol_identifier
) => {
  let { actionFunctions, actionAddresses } = await getActionFunctionsAddresses(
    action_identifier
  );

  let fullProtocolsList = (
    await axios.get("https://api.yieldchain.io/protocols")
  ).data.protocols;

  let protocolsAddresses = (
    await axios.get("https://api.yieldchain.io/protocols-addresses")
  ).data.protocols_addresses;

  let allFunctions = (await axios.get("https://api.yieldchain.io/functions"))
    .data.functions;

  let protocolActionAddresses = protocolsAddresses.filter((pair) => {
    let isSameProtocol = pair.protocol_identifier == protocol_identifier;
    let addressIsAction = actionAddresses.find(
      (_address) => _address.address_identifier == pair.address_identifier
    );
    return isSameProtocol && addressIsAction;
  });

  // TODO: Find a way to make this safer, if there r multiple ones for each protocol
  // TODO: (Say, 2 add liqudiity methods), then there needs to be another solution
  let correctAddress = actionAddresses.find(
    (address) =>
      address.address_identifier ==
      protocolActionAddresses[0].address_identifier
  );

  let actionFunction = allFunctions.find((_func, index, arr) => {
    let isIncluded = correctAddress.functions.find(
      (aFunc) => aFunc.function_identifier == _func.function_identifier
    );

    let isActionRelated = actionFunctions.find(
      (actionFunc) => actionFunc.function_identifier == arr.function_identifier
    );

    return isIncluded && isActionRelated;
  });

  return { func: actionFunction, address: correctAddress };
};

export const getProtocolByFunction = async (function_identifier) => {
  let allAddresses = (await axios.get("https://api.yieldchain.io/addresses"))
    .data.addresses;
  let allProtocols = (await axios.get("https://api.yieldchain.io/protocols"))
    .data.protocols;
  let allProtocolsAddresses = (
    await axios.get("https://api.yieldchain.io/protocols-addresses")
  ).data.protocols_addresses;

  let currentAddress = allAddresses.find((address) =>
    address.functions.includes(function_identifier)
  );

  console.log("Function Identifier", function_identifier);
  console.log("Current Address", allAddresses);

  console.log("Pairs", allProtocolsAddresses);
  let protocol = allProtocols.find(
    (protocol) =>
      protocol.protocol_identifier ==
      allProtocolsAddresses.find(
        (pair) => pair.address_identifier == currentAddress.address_identifier
      ).protocol_identifier
  );

  return protocol;
};

export const checkEmail = (email) => {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const isSignedUp = async (email, address) => {
  console.log("Address provided: ", address);
  let allUsers = (await axios.get("https://api.yieldchain.io/waitlist")).data
    .waitlist;

  let user = allUsers.find(
    (user) => user.email == email || user.address == address
  );

  return user;
};

export const calcIntervalToSeconds = (intervalNum, intervalType) => {
  let interval = 0;
  switch (intervalType) {
    case "minutes":
      interval = intervalNum * 60;
      break;
    case "hours":
      interval = intervalNum * 3600;
      break;
    case "days":
      interval = intervalNum * 86400;
      break;
    case "weeks":
      interval = intervalNum * 604800;
      break;
    case "months":
      interval = intervalNum * 2592000;
      break;
    case "years":
      interval = intervalNum * 31536000;
      break;
    default:
      interval = intervalNum;
      break;
  }
  return interval;
};

Array.prototype.asyncFilter = async function (condition) {
  console.log("Running async filter...");
  let results = await Promise.all(this.map(condition));
  console.log("async filter res", results);
  return this.filter((item, i) => results[i]);
};

export const asyncFilter = Array.prototype.asyncFilter;

export const randomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const getUserDetails = async (_userId, _address) => {
  let allUsers = (await axios.get("https://api.yieldchain.io/users")).data
    .users;

  let currentUser = allUsers.find(
    (user) => user.user_identifier == _userId || user.address == _address
  );

  console.log("Current User", currentUser);
  console.log("Current user ID", _userId);
  return currentUser;
};

export const isWhitelisted = async (address) => {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  let allUsers = (await axios.get("https://api.yieldchain.io/waitlist")).data
    .waitlist;

  let user = allUsers.find(
    (user) =>
      ethers.utils.getAddress(user.address) == ethers.utils.getAddress(address)
  );

  let isWhitelisted = user?.whitelisted || false;

  return isWhitelisted;
};

export const humanizeString = (string) => {
  return string
    .replace(/^_/, "")
    .replace(/[_]+/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
