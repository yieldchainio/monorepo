import { PrismaClient } from "@prisma/client";
// @ts-ignore
import toChecksumAddress from "to-checksum-address";
import { v4 as uuidv4 } from "uuid";
import { DBAction, DBFunction, DBProtocol, DBStep } from "@yc/yc-models";

const client = new PrismaClient();

const strategies = await client.strategiesv2.findMany();
const newActions = await client.actionsv2.findMany();
const oldFunctions = await client.functions.findMany();
const newFunctions = await client.functionsv2.findMany();
const newFlows = await client.flowsv2.findMany();
const oldAddresses = await client.addresses.findMany();
const newAddresses = await client.addressesv2.findMany();

for (const strategy of strategies) {
  // Mapping old IDs to new UUIDS
  const oldToNewIDs = new Map<number, string>();

  // Creating a root step
  const rootStep: DBStep = {
    id: "root",
    parentId: null,
    protocol: "",
    percentage: 100,
    inflows: [],
    outflows: [],
    action: "",
    customArgs: [],
    function: "",
    children: [],
  };

  // iterate over each step and map the ID
  for (const step of strategy.steps) {
    const oldStep = { ...(step as any) } as any;
    const newStep = {} as DBStep;

    const newID = uuidv4();
    oldToNewIDs.set(oldStep.id, newID);
  }

  const newSteps: Omit<DBStep, "children">[] = [];
  // Another iteration where we now change the details
  for (const step of strategy.steps) {
    const oldStep = { ...(step as any) } as any;

    const newParentId = oldToNewIDs.get(oldStep.parent_step_identifier);
    const newId = oldToNewIDs.get(oldStep.step_identifier);
    const newAction = newActions.find(
      (action) => action.name.toLowerCase() === oldStep.type
    );
    const oldFunction = oldFunctions.find(
      (func) => func.function_identifier == oldStep.function_identifiers[0]
    );
    if (!oldFunction) throw "Old function undefined";

    const oldAddress = oldAddresses.find((address) =>
      address.functions.includes(oldFunction.function_identifier)
    );

    if (!oldAddress || !oldAddress.contract_address) throw "Address undefined";

    if (!newParentId || !newId || !newAction)
      throw new Error("Parent or ID or action is not defined");

    const newAddress = newAddresses.find(
      (address) =>
        address.address.toLowerCase() ===
        oldAddress.contract_address?.toLowerCase()
    );

    if (!newAddress) throw "New address undefined";

    const newFunction = newFunctions.find((func) => {
      const nameMatches = func.name === oldFunction.function_name;
      const addressMatches =
        newAddresses
          .find((address_) => address_.id === func.address_id)
          ?.address.toLowerCase() ===
          oldAddress?.contract_address?.toLowerCase() &&
        oldAddress.contract_address !== null;

      if (nameMatches && addressMatches) return func;
    });

    if (!newFunction) throw "New Function Undefined!";

    const newStep: Omit<DBStep, "children"> = {
      parentId: newParentId,
      id: newId,
      protocol: oldStep.protocol_details.id,
      action: newAction.id,
      percentage: oldStep.percentage,
      inflows: newFlows
        .filter((flow) =>
          oldStep.inflows.find((oldFlow: number) => oldFlow === flow.old_id)
        )
        .map((flow) => flow.id),
      outflows: newFlows
        .filter((flow) =>
          oldStep.outflows.find((oldFlow: number) => oldFlow === flow.old_id)
        )
        .map((flow) => flow.id),

      function: newFunction.id,
      customArgs: oldStep.additional_args,
    };
    if (oldStep.parent_step_identifier === undefined)
      newStep.parentId = rootStep.id;

    newSteps.push(newStep);
  }
}
