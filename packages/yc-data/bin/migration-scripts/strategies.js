import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const strategies = await client.strategiesv2.findMany();
// const oldFunctions = await client.functions.findMany()
// const newFlows = await client.flowsv2.findMany();
// for (const strategy of strategies) {
//   // Mapping old IDs to new UUIDS
//   const oldToNewIDs = new Map<number, string>();
//   // Creating a root step
//   const rootStep: DBStep = {
//     id: "root",
//     parentId: null,
//     protocol: {} as DBProtocol,
//     percentage: 100,
//     inflows: [],
//     outflows: [],
//     action: {} as DBAction,
//     customArgs: [],
//     function: {} as DBFunction,
//     children: [],
//   };
//   // iterate over each step and map the ID
//   for (const step of strategy.steps) {
//     const oldStep = { ...(step as any) } as any;
//     const newStep = {} as DBStep;
//     const newID = uuidv4();
//     oldToNewIDs.set(oldStep.id, newID);
//   }
//   // Another iteration where we now change the details
//   for (const step of strategy.steps) {
//     const oldStep = { ...(step as any) } as any;
//     const newStep: DBStep = {
//       parentId: oldToNewIDs.get(oldStep.parent_step_identifier) as string,
//       id: oldToNewIDs.get(oldStep.step_identifier) as string,
//       protocol: oldStep.protocol_details,
//       action:
//     };
//     if (oldStep.parent_step_identifier === undefined)
//       newStep.parentId = rootStep.id;
//   }
// }
for (const strat of strategies) {
    console.log(strat.steps.map((step) => {
        return { inflows: step.inflows[0], outflows: step.outflows[0] };
    }));
    break;
}
// Migrate the steps
//# sourceMappingURL=strategies.js.map