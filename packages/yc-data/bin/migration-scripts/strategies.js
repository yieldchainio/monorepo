import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const strategies = await client.strategiesv2.findMany();
// const protocols = await client.protocolsv2.findMany();
// const strategiesWithNewSteps = strategies.map((strategy) => {
//   const steps: any[] = strategy.steps as unknown as JSON[];
//   const newSteps: any[] = [];
//   for (const step of steps) {
//     const newProtocolDetails = protocols.find(
//       (protocol) => protocol.name == step.protocol_details.name
//     );
//     newSteps.push({ ...step, protocol_details: newProtocolDetails });
//   }
//   return { ...strategy, steps: newSteps };
// });
// for (const strategy of strategiesWithNewSteps) {
//   await client.strategiesv2.update({
//     where: {
//       id: strategy.id,
//     },
//     data: {
//       steps: strategy.steps,
//     },
//   });
// }
for (const strategy of strategies) {
    console.log(strategy.steps);
}
//# sourceMappingURL=strategies.js.map