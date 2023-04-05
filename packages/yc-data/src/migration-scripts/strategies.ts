import { PrismaClient, strategiesv2 } from "@prisma/client";

const prisma = new PrismaClient();

const strategies = await prisma.strategiesv2.findMany();

for (const strategy of strategies) {
  console.log(strategy.steps);
}

// const strategiesAndSteps: Array<[string, DBStep]> = [];
// for (const strategy of strategies) {
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

//   // iterate over each step and map the ID
//   for (const step of strategy.steps) {
//     const oldStep = { ...(step as any) } as any;
//     const newStep = {} as DBStep;

//     const newID = uuidv4();
//     oldToNewIDs.set(oldStep.step_identifier, newID);
//   }

//   const newSteps: Omit<DBStep, "children">[] = [rootStep];
//   // Another iteration where we now change the details
//   for (const step of strategy.steps) {
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

//     const newStep: Omit<DBStep, "children"> = {
//       parentId: newParentId as string,
//       id: newId,
//       protocol: oldStep.protocol_details.id,
//       action: newAction.id,
//       percentage: oldStep.percentage,
//       inflows: newFlows
//         .filter((flow) =>
//           oldStep.inflows.find((oldFlow: number) => oldFlow === flow.old_id)
//         )
//         .map((flow) => flow.id),
//       outflows: newFlows
//         .filter((flow) =>
//           oldStep.outflows.find((oldFlow: number) => oldFlow === flow.old_id)
//         )
//         .map((flow) => flow.id),

//       function: newFunction.id,
//       customArgs: oldStep.additional_args,
//     };
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

//   strategiesAndSteps.push([strategy.id, rootStep]);
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
