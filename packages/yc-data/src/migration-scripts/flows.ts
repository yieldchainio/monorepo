import { PrismaClient, CallType, FlowDirection } from "@prisma/client";

const prisma = new PrismaClient();

const oldFlows = await prisma.flows.findMany();
const oldTokens = await prisma.tokens.findMany();
const newtokens = await prisma.tokensv2.findMany();
const oldFunctions = await prisma.functions.findMany();

const newFlows = oldFlows.map((flow) => {
  const oldToken = oldTokens.find(
    (token) => token.token_identifier === flow.token_identifier
  );
  const newToken = newtokens.find(
    (token) =>
      token.address.toLowerCase() === oldToken?.address?.toLowerCase() &&
      token.chain_id === parseInt(oldToken.chain_id || "-1")
  );

  const parentFunction = oldFunctions.find((func) =>
    func.flows.includes(flow.flow_identifier)
  );

  const newFlow = {
    token_id: newToken?.id || "poo",
    old_id: flow.flow_identifier || 0,
    old_token_id: oldToken?.token_identifier || 0,
    old_func_id: parentFunction?.function_identifier || 0,
    function_id: "poo",
    direction:
      flow.outflow0_or_inflow1 == 0
        ? FlowDirection.OUTFLOW
        : FlowDirection.INFLOW,
  };

  return newFlow;
});

await prisma.flowsv2.createMany({
  data: newFlows,
});
