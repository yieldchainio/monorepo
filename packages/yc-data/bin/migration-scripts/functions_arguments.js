"use strict";
// import {
//   argumentsv2,
//   BaseVariableTypes,
//   CallType,
//   functionsv2,
//   PrismaClient,
//   VariableTypes,
// } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
// const prisma = new PrismaClient();
// // const newAddresses = await prisma.addressesv2.findMany();
// const newFuncs = await prisma.functionsv2.findMany();
// // const newFlows = await prisma.flowsv2.findMany();
// // const oldFunctions = await prisma.functions.findMany();
// // const oldAddresses = await prisma.addresses.findMany();
// // const oldArguments = await prisma.parameters.findMany();
// const newActions = await prisma.actionsv2.findMany();
// // let newFunctions = oldFunctions.flatMap((func) => {
// //   const newID = uuidv4();
// //   const address = oldAddresses.find((address_) =>
// //     address_.functions.includes(func.function_identifier)
// //   );
// //   if (!address) throw new Error("Address not defined, func: " + func);
// //   const newAddress = newAddresses.find(
// //     (address_) =>
// //       address_.address.toLowerCase() === address.contract_address?.toLowerCase()
// //   );
// //   if (!newAddress) throw new Error("NEW adress not defined, func: " + func);
// //   const abi: any[] = address.abi as unknown as JSON[];
// //   const abiFunc = abi.find(
// //     (abiObj) => abiObj.type == "function" && abiObj.name == func.function_name
// //   );
// //   if (!abiFunc || func.function_name?.includes("LiquidityYc")) {
// //     console.log("FUnc Where ABI not found:", func);
// //     funcsNoABI.push(func);
// //     return [];
// //   }
// //   const newFuncFlows = newFlows.filter(
// //     (flow) => flow.old_func_id === func.function_identifier
// //   );
// //   const newArgs = func.arguments.map((arg) => {
// //     const fullArg = oldArguments.find(
// //       (_arg) => _arg.parameter_identifier === arg
// //     );
// //     if (!fullArg) throw new Error("arg is not defined ser, func: " + func);
// //     const abiArg = abiFunc.inputs.find(
// //       (arg__: any) => arg__.name === fullArg.name
// //     );
// //     if (!abiArg) {
// //       console.log("This Func No Arg:", abiFunc);
// //       console.log("The arg:", fullArg);
// //       throw new Error("ABI arg is not defined Func: " + func);
// //     }
// //     const variableType =
// //       abiArg.type.includes("[]" || "string") || abiArg.type === "bytes"
// //         ? VariableTypes.DYNAMIC
// //         : VariableTypes.STATIC;
// //     const baseType = abiArg.type.includes("[")
// //       ? BaseVariableTypes.ARRAY
// //       : abiArg.type.includes("tuple")
// //       ? BaseVariableTypes.STRUCT
// //       : BaseVariableTypes.NORMAL;
// //     return {
// //       index: fullArg.index,
// //       value: fullArg.value,
// //       custom: fullArg.value?.includes("custom"),
// //       solidity_type: abiArg.type,
// //       variable_type: variableType,
// //       base_type: baseType,
// //       name: fullArg.name,
// //       dev_notes: "None",
// //       id: uuidv4(),
// //     };
// //   });
// //   const returnValueType =
// //     abiFunc.outputs.find((arg: any) => arg.type.includes("[]" || "string")) ||
// //     abiFunc.outputs.find((arg: any) => arg.type === "bytes")
// //       ? VariableTypes.DYNAMIC
// //       : VariableTypes.STATIC;
// //   const returnValuebaseType = abiFunc.outputs.find((arg: any) =>
// //     arg.type.includes("[")
// //   )
// //     ? BaseVariableTypes.ARRAY
// //     : abiFunc.outputs.find((arg: any) => arg.type.includes("tuple"))
// //     ? BaseVariableTypes.STRUCT
// //     : BaseVariableTypes.NORMAL;
// //   return [
// //     {
// //       func: {
// //         id: uuidv4(),
// //         name: func.function_name || "",
// //         callback: func.is_callback || false,
// //         call_type: CallType.CALL,
// //         return_value_type: returnValueType,
// //         return_value_base_type: returnValuebaseType,
// //         address_id: newAddress?.id,
// //         argumentsv2: { create: newArgs },
// //         arguments_ids: newArgs.map((arg) => arg.id),
// //         flows_ids: newFuncFlows.map((flow) => flow.id),
// //         dependancy_function_id: func.unlocked_by || null,
// //         inverse_function_id: func.counter_function_identifier || null,
// //         oldId: func.function_identifier || undefined,
// //       },
// //       args: newArgs,
// //     },
// //   ];
// // });
// // // @ts-ignore
// // newFunctions = newFunctions.map((newFunc) => {
// //   const dependancyFuncId = newFunctions.find(
// //     (_func) => _func.func.oldId === newFunc.func.dependancy_function_id
// //   )?.func.id;
// //   const inverseFunctionId = newFunctions.find(
// //     (_func) => _func.func.oldId === newFunc.func.inverse_function_id
// //   )?.func.id;
// //   if (
// //     !dependancyFuncId &&
// //     newFunc.func.dependancy_function_id !== (undefined || null)
// //   )
// //     throw new Error("Dependcy function id not found! Func: " + newFunc);
// //   if (
// //     !inverseFunctionId &&
// //     newFunc.func.inverse_function_id !== (undefined || null)
// //   ) {
// //     console.log("The function:", newFunc);
// //     throw new Error("Inverse function id not found! Func: " + newFunc);
// //   }
// //   return {
// //     ...newFunc,
// //     func: {
// //       ...newFunc.func,
// //       inverse_function_id: inverseFunctionId || null,
// //       dependancy_function_id: dependancyFuncId || null,
// //     },
// //   };
// // });
// // for (const func of newFunctions) {
// //   console.log("Func In Iter", func);
// //   await prisma.functionsv2.create({
// //     data: func.func as unknown as functionsv2,
// //   });
// // }
// // console.log("All Functions WIthout ABI:", funcsNoABI);
// // const badFuncs = [];
// // for (const func of newFunctions) {
// //   const oldFuncAddress = await prisma.functions.findFirst({
// //     where: {
// //         functions
// //     }
// //   })
// //   if (func.arguments_ids.length !== abiFunc.inputs.length) badFuncs.push(func);
// // }
// // for (const flow of newFlows) {
// //   const func = await prisma.functionsv2.findFirst({
// //     where: {
// //       flows_ids: {
// //         has: flow.id,
// //       },
// //     },
// //   });
// //   if (!func) {
// //     console.log("Flow: ", flow);
// //     throw new Error("Flow has no FUNC!!!!!!!!");
// //   }
// //   await prisma.flowsv2.update({
// //     where: {
// //       id: flow.id,
// //     },
// //     data: {
// //       function_id: func.id,
// //     },
// //   });
// // }
// // const oldCustomFuncs = oldFunctions.filter(
// //   (func) =>
// //     func.flows.length === 0 && func.function_name !== "requestWithdrawal"
// // );
// // let newFunctions = oldCustomFuncs.map((func) => {
// //   const oldAddress = oldAddresses.find((add) =>
// //     add.functions.includes(func.function_identifier)
// //   );
// //   if (!oldAddress) {
// //     console.log("Erro rfunc:", func);
// //     throw "No OLD Address Found.";
// //   }
// //   const newAddress = newAddresses.find(
// //     (add) =>
// //       add.address.toLowerCase() === oldAddress.contract_address?.toLowerCase()
// //   );
// //   if (!newAddress) {
// //     console.log("Erro rfunc:", func);
// //     throw "No NEW Address Found.";
// //   }
// //   const flows = newFlows.filter(
// //     (flow) => flow.old_func_id == func.function_identifier
// //   );
// //   const newArgs = func.arguments.map((arg) => {
// //     const fullArg = oldArguments.find(
// //       (_arg) => _arg.parameter_identifier === arg
// //     );
// //     if (!fullArg) throw new Error("arg is not defined ser, func: " + func);
// //     const variableType = VariableTypes.STATIC;
// //     return {
// //       index: fullArg.index,
// //       value: fullArg.value,
// //       custom: fullArg.value?.includes("custom"),
// //       solidity_type: fullArg.solidity_type,
// //       variable_type: variableType,
// //       base_type: BaseVariableTypes.NORMAL,
// //       name: fullArg.name,
// //       dev_notes: "None",
// //       id: uuidv4(),
// //     };
// //   });
// //   const newFunc = {
// //     id: uuidv4(),
// //     name: func.function_name || "",
// //     callback: func.is_callback || false,
// //     call_type: CallType.CALL,
// //     return_value_type: VariableTypes.STATIC,
// //     return_value_base_type: BaseVariableTypes.NORMAL,
// //     address_id: newAddress.id,
// //     argumentsv2: { create: newArgs },
// //     arguments_ids: newArgs.map((arg) => arg.id),
// //     flows_ids: flows.map((flow) => flow.id),
// //     dependancy_function_id: func.unlocked_by || null,
// //     inverse_function_id: func.counter_function_identifier || null,
// //     oldId: func.function_identifier || undefined,
// //   };
// //   return {
// //     func: newFunc,
// //     args: newArgs,
// //   };
// // });
// // // @ts-ignore
// // newFunctions = newFunctions.map((newFunc) => {
// //   const dependancyFuncId = newFunctions.find(
// //     (_func) => _func.func.oldId === newFunc.func.dependancy_function_id
// //   )?.func.id;
// //   const inverseFunctionId = newFunctions.find(
// //     (_func) => _func.func.oldId === newFunc.func.inverse_function_id
// //   )?.func.id;
// //   if (
// //     !dependancyFuncId &&
// //     newFunc.func.dependancy_function_id !== (undefined || null)
// //   ) {
// //     console.log("Func With Error:", newFunc.func);
// //     throw new Error("Dependcy function id not found! Func: " + newFunc);
// //   }
// //   if (
// //     !inverseFunctionId &&
// //     newFunc.func.inverse_function_id !== (undefined || null)
// //   ) {
// //     console.log("The function:", newFunc);
// //     throw new Error("Inverse function id not found! Func: " + newFunc);
// //   }
// //   return {
// //     ...newFunc,
// //     oldId: undefined,
// //     func: {
// //       ...newFunc.func,
// //       inverse_function_id: inverseFunctionId || null,
// //       dependancy_function_id: dependancyFuncId || null,
// //     },
// //   };
// // });
// // newFunctions = newFunctions.map((func) => {
// //   const newObj = { ...func };
// //   delete newObj?.func?.oldId;
// //   return {
// //     ...func,
// //     oldId: undefined,
// //   };
// // });
// // for (const func of newFunctions) {
// //   console.log("Func In Iter", func);
// //   await prisma.functionsv2.create({
// //     data: func.func as unknown as functionsv2,
// //   });
// // }
// for (const func of newFuncs) {
//   const actionsIds = func.actions_ids;
//   const actions = func.actions_ids.filter(
//     (actionId, i) => actionsIds.findIndex((acid) => acid === actionId) === i
//   );
//   await prisma.functionsv2.update({
//     where: {
//       id: func.id,
//     },
//     data: {
//       actions_ids: actions,
//     },
//   });
// }
//# sourceMappingURL=functions_arguments.js.map