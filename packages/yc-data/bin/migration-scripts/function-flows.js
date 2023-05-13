"use strict";
// /**
//  * MIGrating the function flows
//  */
// import { FlowDirection, PrismaClient, functionsv2 } from "@prisma/client";
// const prisma = new PrismaClient();
// // Get all data
// const flows = await prisma.flowsv2.findMany();
// const functions = await prisma.functionsv2.findMany();
// const tokens = await prisma.tokensv2.findMany();
// const newFuncs: functionsv2[] = functions.map((func) => {
//   // Get flows
//   const funcFlows = flows.filter((flow) => func.flows_ids.includes(flow.id));
//   // Assert that we do not lose any
//   if (funcFlows.length !== func.flows_ids.length)
//     throw "Flows Length Mismatch For Func ID: " + func.id;
//   // Get all tokens
//   const funcTokens = funcFlows.flatMap((flow) => {
//     const token = tokens.find((token) => token.id == flow.token_id);
//     return token
//       ? [
//           {
//             token,
//             direction: flow.direction,
//           },
//         ]
//       : [];
//   });
//   // Assert that we do not lose any
//   if (funcFlows.length !== funcTokens.length)
//     throw "Tokens To Flows Length Mismatch For Func ID: " + func.id;
//   const outflows = [];
//   const inflows = [];
//   for (const flow of funcTokens) {
//     if (flow.direction == FlowDirection.INFLOW) inflows.push(flow.token);
//     else if (flow.direction === FlowDirection.OUTFLOW)
//       outflows.push(flow.token);
//     else throw "Flow Does Not Mathc ANy Direction For Func ID: " + func.id;
//   }
//   return {
//     ...func,
//     outflows: outflows.map((token) => token.id),
//     inflows: inflows.map((token) => token.id),
//   };
// });
// if (newFuncs.length !== functions.length)
//   throw "Functions Length Misatch Between Old And New.";
// for (const func of newFuncs) {
//   await prisma.functionsv2.update({
//     where: {
//       id: func.id,
//     },
//     data: func,
//   });
// }
//# sourceMappingURL=function-flows.js.map