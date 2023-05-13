"use strict";
// /**
//  * Dummy data for stateistics
//  */
// import { PrismaClient, strategiesv2, statistics } from "@prisma/client";
// import { eachDayOfInterval } from "date-fns";
// // Init a new instance of the prisma client
// const prisma = new PrismaClient();
// // // Get all of the strategies
// // const strategies: strategiesv2[] = await prisma.strategiesv2.findMany();
// // // Function to generate a random number within a range
// // const genRangedRandom = (min: number = 0, max: number = 100) => {
// //   // find diff
// //   let difference: number = max - min;
// //   // generate random number
// //   let rand: number = Math.random();
// //   // multiply with difference
// //   rand = Math.floor(rand * difference);
// //   // add with min value
// //   rand = rand + min;
// //   return rand;
// // };
// // const genMax = (max: number, min: number): [number, number] => {
// //   const newMax =
// //     max === 0
// //       ? Math.floor(Math.random() * Math.floor(Math.random() * 200))
// //       : max;
// //   const newMin = Math.floor(Math.random() * Math.floor(Math.random() * newMax));
// //   if (newMax < newMin) return genMax(newMax, newMin);
// //   else return [newMax, newMin];
// // };
// // // iterate over each one of the strategies
// // for (const strategy of strategies) {
// //   /**
// //    * we find a suitable range and randomly assign APY within that rangr
// //    */
// //   const [max, min] = genMax(0, 0);
// //   console.log(new Date());
// //   const dates = eachDayOfInterval({
// //     start: new Date(2023, 1, 1),
// //     end: new Date(2023, 4, 1),
// //   });
// //   /**
// //    * We do 100 iterations for 100 random data points per strategy
// //    */
// //   const stratStatistics: Omit<statistics, "statistic_id">[] = [];
// //   for (let i = 0; i < dates.length; i++) {
// //     stratStatistics.push({
// //       strategy_id: strategy.id,
// //       timestamp: dates[i],
// //       apy: genRangedRandom(min, max),
// //       gasFee: BigInt(genRangedRandom(1, 100)) * 10n ** 15n,
// //     });
// //   }
// //   await prisma.statistics.createMany({
// //     data: stratStatistics,
// //   });
// // }
// const statistics = await prisma.statistics.findMany();
// const newStatistics: statistics[] = [];
// export const msPerDay = 24 * 60 * 60 * 1000;
// for (const stat of statistics) {
//   const desiredTime = new Date(stat.timestamp).getTime() - 30 * msPerDay;
//   const desiredDate = new Date(desiredTime);
//   newStatistics.push({
//     ...stat,
//     timestamp: desiredDate,
//   });
// }
// await prisma.statistics.deleteMany({
//   where: {
//     gasFee: {
//       not: {
//         equals: "0",
//       },
//     },
//   },
// });
// try {
//   await prisma.statistics.createMany({
//     data: newStatistics,
//   });
// } catch (e: any) {
//   await prisma.statistics.createMany({
//     data: statistics,
//   });
// }
//# sourceMappingURL=statistics.js.map