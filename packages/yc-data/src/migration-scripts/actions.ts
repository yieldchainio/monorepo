// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const oldActions = await prisma.actions.findMany();
// const newFlows = await prisma.flowsv2.findMany();
// const newFuncs = await prisma.functionsv2.findMany();

// const stakeTable = [1, 9, 6, 18, 21, 24, 28, 31, 34, 39];
// const addLiqTable = [4, 2];
// const removeLiqTable: number[] = [];
// const requestWithdrawalTable = [25];
// const harvestTable = [5, 10, 20, 23, 27, 30, 33, 36, 41];
// const swapTable = [12, 14];
// const withdrawTable = [2, 7, 11, 19, 22, 26, 29, 32, 35, 40];

// const actions = {
//   Stake: {
//     available: true,

//     oldFuncs: stakeTable,
//   },
//   "Add Liquidity": {
//     oldFuncs: addLiqTable,
//     available: true,
//   },
//   "Remove Liquidity": {
//     oldFuncs: removeLiqTable,
//     available: true,
//   },
//   "Request Withdrawal": {
//     oldFuncs: requestWithdrawalTable,
//     available: true,
//   },
//   Harvest: {
//     oldFuncs: harvestTable,
//     available: true,
//   },
//   Swap: {
//     oldFuncs: swapTable,
//     available: true,
//   },
//   Withdraw: {
//     oldFuncs: withdrawTable,
//     available: false,
//   },
// };

// let i = 0;
// const newActions = [];
// for (const [name, config] of Object.entries(actions)) {
//   const newFunctions = config.oldFuncs.map((oldFunc) => {
//     const corrFlow = newFlows.find((flow) => flow.old_func_id === oldFunc);
//     let newFunc = newFuncs.find((func) => func.id == corrFlow?.function_id);
//     if (!newFunc) {
//       if (oldFunc === 25)
//         newFunc = newFuncs.find(
//           (func) => func.id == "4a9f8acb-bb08-4e52-9635-10d4f1d96210"
//         );
//       if (oldFunc === 12) {
//         newFunc = newFuncs.find((func) => func.name === "lifibatchswap");
//       }
//       if (oldFunc === 14) {
//         newFunc = newFuncs.find((func) => func.name === "lifiswap");
//       }
//     }
//     if (!newFunc) throw new Error("NO FUNC, Old Func ID:" + " " + oldFunc);
//     return newFunc.id;
//   });
//   newActions.push({
//     name: name,
//     popularity: i,
//     available: config.available,
//     functions_ids: newFunctions,
//   });
//   i++;
// }

// await prisma.actionsv2.createMany({
//   data: newActions,
// });
