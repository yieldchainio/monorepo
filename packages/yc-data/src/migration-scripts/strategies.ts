import { PrismaClient, strategiesv2 } from "@prisma/client";
import { DBStep } from "@yc/yc-models";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

const strategies = await client.strategiesv2.findMany();
const tokens = await client.tokensv2.findMany();

const map = <T = any>(node: DBStep, callback: (node: DBStep) => any) => {
  // Create a stack array
  const stack: DBStep[] = [node];
  const result: T[] = [];

  // While it's length is bigger than 0, pop a step,
  // invoke the callback on it, and then add all of it's children to the stack
  while (stack.length > 0) {
    const node = stack.pop() as DBStep;
    result.push(callback(node));

    for (const child of node.children) {
      stack.push(child);
    }
  }

  return result;
};

for (const strategy of strategies) {
  console.log(strategy.steps);
  // @ts-ignore
  console.log(strategy.steps.children[0]);
  break;
}

// for (const strategy of strategies) {
//   const depositToken = tokens.find(
//     (token) => token.id == strategy.deposit_token_id
//   );

//   if (!depositToken) throw "No Deposit Token";

//   map(strategy.steps as unknown as DBStep, (node) => {
//     const percentage = node.percentage;

//     const tokenPercentages: Record<string, number> = {};

//     if (node.id === "root") node.inflows.push(depositToken);
//     for (const flow of node.outflows) tokenPercentages[flow.id] = percentage;

//     // @ts-ignore
//     node["tokenPercentages"] = tokenPercentages;
//   });

//   await client.strategiesv2.update({
//     where: {
//       id: strategy.id,
//     },
//     data: {
//       steps: strategy.steps as unknown as any,
//     },
//   });
// }

// const strategiesAndSteps: Array<[string, DBStep]> = [];
// for (const newStrat of strategies) {
//   // Mapping old IDs to new UUIDS
//   const oldToNewIDs = new Map<number, string>();

//   // Creating a root step
//   const rootStep: DBStep = {
//     id: "root",
//     parentId: null,
//     protocol: "",
//     percentage: 100,
//     inflows: [],
//     outflows: [],
//     action: "",
//     customArgs: [],
//     function: "",
//     children: [],
//   };

//   const strategy = oldStrategies.find(
//     (strat) => strat.address?.toLowerCase() === newStrat.address.toLowerCase()
//   );

//   if (!strategy) throw "Cannot find old strategy!";

//   // iterate over each step and map the ID
//   // @ts-ignore
//   for (const step of strategy.strategy_object.steps_array) {
//     const oldStep = { ...(step as any) } as any;

//     const newID = uuidv4();
//     oldToNewIDs.set(oldStep.step_identifier, newID);
//   }

//   const newSteps: Omit<DBStep, "children">[] = [rootStep];
//   // Another iteration where we now change the details
//   // @ts-ignore
//   for (const step of strategy.strategy_object.steps_array) {
//     const oldStep = { ...(step as any) } as any;

//     const newParentId = oldToNewIDs.get(oldStep.parent_step_identifier);
//     const newId = oldToNewIDs.get(oldStep.step_identifier);
//     const newAction = newActions.find(
//       (action) => action.name.toLowerCase() === oldStep.type.toLowerCase()
//     );
//     const oldFunction = oldFunctions.find(
//       (func) => func.function_identifier == oldStep.function_identifiers[0]
//     );
//     if (!oldFunction) throw "Old function undefined";

//     const oldAddress = oldAddresses.find((address) =>
//       address.functions.includes(oldFunction.function_identifier)
//     );

//     if (!oldAddress || !oldAddress.contract_address) throw "Address undefined";

//     if (
//       newParentId === undefined &&
//       oldStep.parent_step_identifier !== undefined
//     )
//       throw "Parent ID Undefined whilst old is defined";

//     if (newId === undefined) throw "New ID is undefined";

//     if (newAction === undefined) throw "New Action Is undefined";

//     const newAddress = newAddresses.find(
//       (address) =>
//         address.address.toLowerCase() ===
//         oldAddress.contract_address?.toLowerCase()
//     );

//     if (!newAddress) throw "New address undefined";

//     const newFunction = newFunctions.find((func) => {
//       const nameMatches = func.name === oldFunction.function_name;
//       const addressMatches =
//         newAddresses
//           .find((address_) => address_.id === func.address_id)
//           ?.address.toLowerCase() ===
//           oldAddress?.contract_address?.toLowerCase() &&
//         oldAddress.contract_address !== null;

//       if (nameMatches && addressMatches) return func;
//     });

//     if (!newFunction) throw "New Function Undefined!";

//     const oldProtocol = oldStep.protocol_details;
//     const newProtocol = newProtocols.find(
//       (protocol) => protocol.name == oldProtocol.name
//     );

//     if (!newProtocol || !newProtocol.id) throw "Protocol Undefined";
//     console.log("new Protocol", newProtocol.id);

//     const newStep: Omit<DBStep, "children"> = {
//       parentId: newParentId as string,
//       id: newId,
//       protocol: newProtocol.id,
//       action: newAction.id,
//       percentage: oldStep.percentage,
//       inflows: oldStep.inflows.map((flow: any) => {
//         const newToken =
//           newTokens.find(
//             (token) =>
//               token.chain_id?.toString() ===
//                 flow.token_details?.chain_id?.toString() &&
//               token.address.toLowerCase() ===
//                 flow.token_details.address.toLowerCase()
//           ) ||
//           newTokens.find(
//             (token) =>
//               flow.token_details.name.includes(token.name) &&
//               token.symbol == flow.token_details.symbol
//           );

//         if (!newToken) {
//           console.error(flow);
//           console.log(
//             newTokens.find(
//               (token) => token.name === "DAI-WETH LP-Token zyberSwap "
//             )
//           );
//           throw "New Token in Inflow not found!";
//         }

//         return newToken;
//       }),
//       outflows: oldStep.outflows.map((flow: any) => {
//         const newToken = newTokens.find(
//           (token) =>
//             token.chain_id.toString() ===
//               flow.token_details.chain_id.toString() &&
//             token.address.toLowerCase() ===
//               flow.token_details.address.toLowerCase()
//         );

//         if (!newToken) {
//           console.error(flow);
//           throw "New Token in Outflow not found!";
//         }
//         return newToken;
//       }),
//       function: newFunction.id,
//       customArgs: oldStep.additional_args,
//     };

//     if (newStep.inflows.length !== oldStep.inflows.length) {
//       console.error(
//         "Old inflows",
//         oldStep.inflows,
//         "new Inflows",
//         newStep.inflows
//       );
//       throw "Inflows length does not match";
//     }
//     if (newStep.outflows.length !== oldStep.outflows.length) {
//       console.error(
//         "Old outflows",
//         oldStep.outflows,
//         "new outflows",
//         newStep.outflows
//       );
//       throw "Outflows length does not match";
//     }

//     if (oldStep.parent_step_identifier === undefined)
//       newStep.parentId = rootStep.id;

//     newSteps.push(newStep);
//   }

//   const getChilds = (node: DBStep) => {
//     const children = (newSteps as DBStep[]).filter(
//       (step) => step.parentId == node.id
//     );
//     node.children = children;
//     for (const child of children) getChilds(child);
//   };

//   getChilds(rootStep);

//   const each = (node: DBStep, depth: number = 0) => {
//     let msg = "";
//     let j = 0;
//     let descendentsAmt = 0;
//     const addDescendent = (node: DBStep) => {
//       descendentsAmt++;
//       for (const child of node.children) addDescendent(child);
//     };
//     addDescendent(node);
//     while (j < descendentsAmt) {
//       msg += " ";
//       j++;
//     }
//     msg +=
//       newActions.find((action) => action.id === node.action)?.name || "Deposit";

//     console.log(msg);
//     for (const child of node.children) {
//       each(child, depth + 1);
//     }
//   };

//   strategiesAndSteps.push([newStrat.id, rootStep]);
//   // each(rootStep);
//   // break;
// }

// for (const [strategyID, rootStep] of strategiesAndSteps) {
//   await client.strategiesv2.update({
//     where: {
//       id: strategyID,
//     },

//     data: {
//       steps: JSON.parse(JSON.stringify(rootStep)),
//     },
//   });
// }
